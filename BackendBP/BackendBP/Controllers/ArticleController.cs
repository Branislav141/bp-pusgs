using BackendBP.Data;
using BackendBP.Dtos;
using BackendBP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;
using System;
using System.Xml.Linq;
using BackendBP.Areas.Identity.Data;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace BackendBP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ArticleController : Controller
    {


        private readonly DataContext _dbContext;
        private readonly UserManager<BackendUser> _userManager;

        public ArticleController(DataContext dbContext, UserManager<BackendUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }


        [HttpGet("my/{email}")]
        public IActionResult GetAllArticles(string email)
        {
            List<Article> artikal = _dbContext.Articles.Where(x => x.UserCreated == email).ToList();

            return Ok(artikal);
        }


        [HttpPost("AddArticle")]
        
        public IActionResult AddArticle([FromBody] ArticlesToAdd artToAdd)
        {
            string userName = User.Identity.Name;

            var user = _userManager.FindByNameAsync(userName).Result;



            Article article = new Article()
            {
                Id = artToAdd.Id,
                Name = artToAdd.Name,
                Quantity = artToAdd.Quantity,
                Description = artToAdd.Description,
                Price = artToAdd.Price,
                UserCreated = user.Email, 
            };

            if (!string.IsNullOrEmpty(artToAdd.ArticlePhotoUrl))
            {
                article.APhoto = new ArticalPhoto { Url = artToAdd.ArticlePhotoUrl, IsDeleted = false };
            }

            _dbContext.Articles.Add(article);
            _dbContext.SaveChanges();
            return Ok("Add article succeeded");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticle(int id)
        {
            var article = await _dbContext.Articles.FindAsync(id);

            if (article == null)
            {
                return NotFound();
            }

            return Ok(article);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditArticle(int id, [FromBody] Article editedArticle)
        {
            var article = await _dbContext.Articles.FindAsync(id);

            if (article == null)
            {
                return NotFound();
            }

            // Update properties of the article with edited values
            article.Name = editedArticle.Name;
            article.Price = editedArticle.Price;
            article.Quantity = editedArticle.Quantity;
            article.Description = editedArticle.Description;

            // Save changes to the database
            await _dbContext.SaveChangesAsync();

            return Ok(article);
        }



        [HttpPost("uploadPhoto")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            try
            {
                
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

                
                string imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Resources", "Images", fileName);

                
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                
                string photoUrl = $"{Request.Scheme}://{Request.Host}/Resources/Images/{fileName}";

                return Ok(new { photoUrl });
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }


    }
}
