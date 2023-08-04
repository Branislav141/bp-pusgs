using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendBP.Areas.Identity.Data;
using BackendBP.Data;
using BackendBP.Dtos;
using BackendBP.Migrations.Data;
using BackendBP.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly DataContext _dbContext;
    private readonly UserManager<BackendUser> _userManager;

    public OrderController(DataContext dbContext, UserManager<BackendUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }


    [HttpGet("GetAllOrders")]
    public IActionResult GetAllOrders()
    {
        List<Order> orders = _dbContext.Orders
       .Include(o => o.Articles)
           .ThenInclude(a => a.APhoto)
       .ToList();

        return Ok(orders);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] OrderToAdd inputModel)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("Invalid input data.");
        }

        try
        {

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
                    UserCreated=item.UserCreated,
                    APhoto = new ArticalPhoto 
                    {
                        
                        Url = item.APhoto.Url, 
                        IsDeleted = false 
                    }
                };

                orderArticles.Add(orderArticle);
            }

            
            var order = new Order
            {
                Articles = orderArticles,
                TotalPrice = inputModel.TotalPrice,
                Comment = inputModel.Comment,
                DeliveryAddress = inputModel.DeliveryAddress,
                OrderDate = currentDateTime,
                DeliveryDate = deliveryDate,
            };


            _dbContext.Orders.Add(order);

            foreach (var item in inputModel.Quantities)
            {
                var article = await _dbContext.Articles.FindAsync(item.Key);
                if (article != null)
                {
                    article.Quantity -= item.Value;
                }
            }

            await _dbContext.SaveChangesAsync();

            return Ok(new { OrderId = order.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while creating the order: " + ex.Message);
        }
    }
}
