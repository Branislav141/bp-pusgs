// ArticleController.cs
using BackendBP.Data;
using BackendBP.Dtos;
using BackendBP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;
using System;
using BackendBP.Areas.Identity.Data;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

        [Authorize(Roles = "kupac")]
        [HttpGet]
        public IActionResult GetArticles()
        {
            List<Article> articles = _dbContext.Articles.Where(x=> x.OrderId==null)
                .Include(a => a.APhoto)
                .ToList();

            return Ok(articles);
        }

        [Authorize(Roles = "prodavac")]
        [HttpGet("my/{email}")]
        public IActionResult GetAllArticles(string email)
        {
            List<Article> articles = _dbContext.Articles
                .Where(x => x.UserCreated == email && x.OrderId==null )
                .Include(a => a.APhoto)
                .ToList();

            return Ok(articles);
        }

        [Authorize(Roles = "prodavac")]
        [HttpPost("AddArticle")]
        public IActionResult AddArticle([FromBody] ArticlesToAdd artToAdd)
        {
            string userName = User.Identity.Name;
            var user = _userManager.FindByNameAsync(userName).Result;

            // Check if an article with the same name already exists
            if (_dbContext.Articles.Any(a => a.Name == artToAdd.Name && a.OrderId == null))
            {
                return Conflict("An article with the same name already exists.");
            }

            Article article = new Article()
            {
                Name = artToAdd.Name,
                Quantity = artToAdd.Quantity,
                Description = artToAdd.Description,
                Price = artToAdd.Price,
                UserCreated = user.Email,
            };

            if (!string.IsNullOrEmpty(artToAdd.PhotoUrl))
            {
                article.APhoto = new ArticalPhoto { Url = artToAdd.PhotoUrl, IsDeleted = false };
            }

            _dbContext.Articles.Add(article);
            _dbContext.SaveChanges();
            return Ok("Add article succeeded");
        }

        [Authorize(Roles = "prodavac")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticle(int id)
        {
            var article = await _dbContext.Articles
                .Include(a => a.APhoto)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
            {
                return NotFound();
            }

            var art = new Article()
            {
                Name = article.Name,
                Description = article.Description,
                Quantity = article.Quantity,
                Price = article.Price,
                APhoto = article.APhoto,
            };

            return Ok(art);
        }

        [Authorize(Roles = "prodavac")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditArticle(int id, [FromForm] ArticleEditDto editedArticleDto)
        {



            var article = await _dbContext.Articles
                            .Include(a => a.APhoto)
                            .FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
            {
                return NotFound();
            }

            if (_dbContext.Articles.Any(a => a.Name == editedArticleDto.Name && a.OrderId == null && a.Id != id))
            {
                return Conflict("An article with the same name already exists.");
            }

            article.Name = editedArticleDto.Name;
            article.Price = editedArticleDto.Price;
            article.Quantity = editedArticleDto.Quantity;
            article.Description = editedArticleDto.Description;

            if (editedArticleDto.ImageFile != null)
            {
                if (article.APhoto == null)
                {
                    article.APhoto = new ArticalPhoto();
                }

                article.APhoto.Url = await UploadPhoto(editedArticleDto.ImageFile);
                article.APhoto.IsDeleted = false;
            }

            if (editedArticleDto.IsPhotoDeleted)
            {
                if (article.APhoto != null)
                {
                    article.APhoto.IsDeleted = true;
                }
            }

            await _dbContext.SaveChangesAsync();

            return Ok(article);
        }


        [Authorize(Roles = "prodavac")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _dbContext.Articles.Include(a => a.APhoto).FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
            {
                return NotFound();
            }

            if (article.APhoto != null)
            {
                
                _dbContext.ArticalPhotos.Remove(article.APhoto);
            }

            _dbContext.Articles.Remove(article);
            await _dbContext.SaveChangesAsync();

            return Ok("Article and associated photo deleted successfully!");
        }

        [Authorize(Roles = "prodavac")]
        [HttpPost("uploadPhoto")]
        public async Task<string> UploadPhoto(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("Invalid file.");
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
                return photoUrl;
            }
            catch (Exception e)
            {
                throw new Exception("Error uploading photo.", e);
            }
        }

    }
}
