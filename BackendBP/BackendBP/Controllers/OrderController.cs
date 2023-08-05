﻿using System;
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

    [HttpGet("GetOrdersByUserCreated")]
    public IActionResult GetOrdersByUserCreated()
    {
        try
        {
            var loggedInUserId = _userManager.GetUserId(User);
            var seller = _userManager.FindByIdAsync(loggedInUserId).Result;

            
            List<Order> orders = _dbContext.Orders
                 .Where(o => o.Sellers.Any(s => s.Email == seller.Email) )
                 .Include(o => o.Articles)
                 .ThenInclude(a => a.APhoto)
                 .ToList();

            return Ok(orders);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while fetching orders: " + ex.Message);
        }
    }





    [HttpGet("GetOrdersByBuyer")]
    public IActionResult GetOrdersByBuyer()
    {
        try
        {
            var loggedInUserId = _userManager.GetUserId(User);
            var buyer = _userManager.FindByIdAsync(loggedInUserId).Result;

            // Find orders where the Seller field contains the logged-in user's email and any of the articles are created by the seller
            List<Order> orders = _dbContext.Orders
                .Where(o => o.Buyer==buyer.Email)
                .Include(o => o.Articles)
                .ThenInclude(a => a.APhoto)
                .ToList();

            return Ok(orders);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while fetching orders: " + ex.Message);
        }
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
                    UserCreated=item.UserCreated,
                    APhoto = new ArticalPhoto 
                    {
                        
                        Url = item.APhoto.Url, 
                        IsDeleted = false 
                    }
                };

                orderArticles.Add(orderArticle);
            }



            var sellerEmails = orderArticles.Select(article => article.UserCreated).Distinct().ToList();

            // Retrieve the list of sellers from the database based on their emails
            var existingSellers = await _dbContext.Sell.Where(s => sellerEmails.Contains(s.Email)).ToListAsync();

            // Check for new sellers (emails that are not already in the database)
            var newSellerEmails = sellerEmails.Except(existingSellers.Select(s => s.Email)).ToList();

            // Create and add new sellers to the database
            foreach (var newSellerEmail in newSellerEmails)
            {
                var newSeller = new Seller { Email = newSellerEmail };
                _dbContext.Sell.Add(newSeller);
                existingSellers.Add(newSeller); // Add the new seller to the existingSellers list for use in the order creation
            }


            var order = new Order
            {
                Articles = orderArticles,
                TotalPrice = inputModel.TotalPrice,
                Comment = inputModel.Comment,
                DeliveryAddress = inputModel.DeliveryAddress,
                OrderDate = currentDateTime,
                DeliveryDate = deliveryDate,
                Buyer= buyerEmail,
                Sellers = existingSellers
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