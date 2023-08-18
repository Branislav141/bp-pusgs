using BackendBP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PayPal.Api;
using System.Collections.Generic;
using System.Diagnostics;
using System;
using BackendBP.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using BackendBP.Data;
using BackendBP.Areas.Identity.Data;
using Microsoft.AspNetCore.Authorization;
using PayPalCheckoutSdk.Orders;
using PayPalCheckoutSdk.Core;
using Newtonsoft.Json;

namespace BackendBP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PayPalController : Controller
    {

        private readonly ILogger<PayPalController> _logger;
        private IHttpContextAccessor httpContextAccessor;
        IConfiguration _configuration;
        private readonly DataContext _dbContext;
        private readonly UserManager<BackendUser> _userManager;
        public PayPalController(ILogger<PayPalController> logger, IHttpContextAccessor context, DataContext dbContext, IConfiguration iconfiguration, UserManager<BackendUser> userManager)
        {

            _logger = logger;
            httpContextAccessor = context;
            _configuration = iconfiguration;
            _dbContext = dbContext;
            _userManager = userManager;

        }



        private Payment payment;


        [HttpPost("CreateOrderByPayPal")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderToAdd inputModel, string PayerID = "")
        {
            var ClientID = _configuration.GetValue<string>("PayPal:Key");
            var ClientSecret = _configuration.GetValue<string>("PayPal:Secret");
            var mode = _configuration.GetValue<string>("PayPal:mode");
            APIContext apiContext = PaypalConfiguration.GetAPIContext(ClientID, ClientSecret, mode);

            var environment = new SandboxEnvironment(ClientID, ClientSecret);
            var client = new PayPalHttpClient(environment);

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid input data.");
            }

            try
            {

                var loggedInUserId = _userManager.GetUserId(User);
                var buyer = await _userManager.FindByIdAsync(loggedInUserId);
                var buyerEmail = buyer.Email;



                var currentDateTime = DateTime.Now;
                var random = new Random();
                var deliveryDate = currentDateTime.AddHours(1).AddMinutes(random.Next(0, 60));
                var maxDeliveryDate = currentDateTime.AddDays(2);
                deliveryDate = DateTime.Compare(deliveryDate, maxDeliveryDate) > 0 ? maxDeliveryDate : deliveryDate;

                var orderArticles = new List<Article>();


                foreach (var item in inputModel.cartItems)
                {
                    var itemId = item.Id;
                    var quantity = inputModel.Quantities.ContainsKey(itemId) ? inputModel.Quantities[itemId] : 1;


                    var orderArticle = new Article
                    {

                        Name = item.Name,
                        Price = item.Price,
                        Quantity = quantity,
                        Description = item.Description,
                        UserCreated = item.UserCreated,
                        APhoto = new ArticalPhoto
                        {

                            Url = item.APhoto.Url,
                            IsDeleted = false
                        }
                    };

                    orderArticles.Add(orderArticle);
                }



                var sellerEmails = orderArticles.Select(article => article.UserCreated).Distinct().ToList();

           
                var existingSellers = await _dbContext.Sell.Where(s => sellerEmails.Contains(s.Email)).ToListAsync();

             
                var newSellerEmails = sellerEmails.Except(existingSellers.Select(s => s.Email)).ToList();

                foreach (var newSellerEmail in newSellerEmails)
                {
                    var newSeller = new Seller { Email = newSellerEmail };
                    _dbContext.Sell.Add(newSeller);
                    existingSellers.Add(newSeller); 
                }


                var order = new Models.Order
                {
                    Articles = orderArticles,
                    TotalPrice = inputModel.TotalPrice,
                    Comment = inputModel.Comment,
                    DeliveryAddress = inputModel.DeliveryAddress,
                    OrderDate = currentDateTime,
                    DeliveryDate = deliveryDate,
                    Buyer = buyerEmail,
                    Sellers = existingSellers
                };
                _dbContext.Orders.Add(order);

                foreach (var item in inputModel.Quantities)
                {
                    var article = await _dbContext.Articles.FindAsync(item.Key);
                    if (article != null && article.Quantity > 0)
                    {
                        article.Quantity -= item.Value;
                    }
                }

                await _dbContext.SaveChangesAsync();


                var request = new OrdersCreateRequest();
                request.Prefer("return=representation");
                request.RequestBody(BuildPayPalOrderRequestBody(orderArticles, Convert.ToDecimal(inputModel.TotalPrice)));

                var response = await client.Execute(request);
                var createdOrder = response.Result<PayPalCheckoutSdk.Orders.Order>();





                return Ok(new { OrderId = createdOrder.Id });
            }
            catch (PayPal.PaymentsException ex)
            {
                return StatusCode(500, $"An error occurred while processing payment: {ex.Message}");
            }



        }

        private OrderRequest BuildPayPalOrderRequestBody(List<Article> orderArticles, decimal totalPrice)
        {
            var itemList = new List<PayPalCheckoutSdk.Orders.Item>();

            foreach (var article in orderArticles)
            {
                itemList.Add(new PayPalCheckoutSdk.Orders.Item()
                {
                    Name = article.Name,
                    UnitAmount = new Money()
                    {
                        CurrencyCode = "USD",
                        Value = article.Price.ToString("F2")
                    },
                   
                    Quantity = article.Quantity.ToString(),
                    
                });
            }

            var orderRequest = new OrderRequest()
            {
                Intent = "CAPTURE", 
                PurchaseUnits = new List<PurchaseUnitRequest>()
        {
            new PurchaseUnitRequest()
            {
                Amount = new AmountWithBreakdown()
                {
                    CurrencyCode = "USD",
                    Value = totalPrice.ToString("0.00"),
                    Breakdown = new AmountBreakdown()
                    {
                        ItemTotal = new Money()
                        {
                            CurrencyCode = "USD",
                            Value = totalPrice.ToString("0.00")
                        }
                    }
                },
                Items = itemList
            }
        }
            };

            return orderRequest;
        }






        [HttpPost("ApproveOrderByPayPal")]
        public async Task<IActionResult> ApproveOrderByPayPal([FromBody] ApproveOrderData approveData)
        {
            var ClientID = _configuration.GetValue<string>("PayPal:Key");
            var ClientSecret = _configuration.GetValue<string>("PayPal:Secret");
            var mode = _configuration.GetValue<string>("PayPal:mode");
            APIContext apiContext = PaypalConfiguration.GetAPIContext(ClientID, ClientSecret, mode);

            try
            {
                var environment = new SandboxEnvironment(ClientID, ClientSecret);
                var client = new PayPalHttpClient(environment);

                var orderCaptureRequest = new OrdersCaptureRequest(approveData.orderId);
                orderCaptureRequest.RequestBody(new OrderActionRequest());

                var response = await client.Execute(orderCaptureRequest);
                var capturedOrder = response.Result<PayPalCheckoutSdk.Orders.Order>();

             

                return Ok(new { Message = "Order approved and captured successfully." });
            }
            catch (Exception ex)
            {
               
               
                return StatusCode(500, new { Error = $"An error occurred while capturing order: {ex.Message}" });
            }
        }


    }
}

