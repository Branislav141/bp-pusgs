using BackendBP.Areas.Identity.Data;
using BackendBP.Dtos;

using BackendBP.Models;
using EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Data;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BackendBP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<BackendUser> _userManager;
        private readonly BackendContext _dbContext;
        private readonly IEmailSender _emailSender;

        public UsersController(UserManager<BackendUser> userManager, BackendContext dbContext, IEmailSender emailSender)
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _emailSender = emailSender;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _dbContext.Users.ToListAsync();

            return Ok(users);
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _userManager.Users
                .Include(u => u.PhotoUser)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound();

            var userModel = new BackendUser
            {
                Name = user.Name,
                Email = user.Email,
                UserName = user.UserName,
                Birthday = user.Birthday,
                Address = user.Address,
                Surname = user.Surname,
                PhotoUser = user.PhotoUser,
                AccountType = user.AccountType,
            };

           

            return Ok(userModel);
        }



        [HttpPut("user/update")]
        public async Task<IActionResult> UpdateUser([FromForm] EditProfileModel updatedUser, IFormFile imageFile)
        {
            var name = User.Identity.Name;
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Name == name);

            if (user == null)
            {
                return NotFound();
            }

           

            user.UserName = updatedUser.UserName;
            user.Name = updatedUser.Name;
            user.Email = updatedUser.Email;
            user.Surname = updatedUser.Surname;
            user.Birthday = updatedUser.Birthday;
            user.Address = updatedUser.Address;



            if (imageFile != null)
            {
                
                var photoUrl = await UploadPhoto(imageFile);
                user.PhotoUser = new Photo { Url = photoUrl };
            }

            
            await _dbContext.SaveChangesAsync();

            return Ok(user);
        }





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








        [HttpPost("approve")]
        public async Task<IActionResult> ApproveUser([FromBody] ApproveDeclineModel model)
        {
            var user = await _dbContext.Users.Where(x => x.Email == model.Email).FirstOrDefaultAsync();
            user.AccountStatus = "Approved";

            await _dbContext.SaveChangesAsync();

            var message = new Message(new string[] { user.Email }, "Your account has been approved!",
                "This is to confirm that your account has been successfully activated. You can log in with your username and password.");
            _emailSender.SendEmail(message);

            return Ok();
        }

        [HttpPost("decline")]
        public async Task<IActionResult> DeclineUser([FromBody] ApproveDeclineModel model)
        {
            var user = await _dbContext.Users.Where(x => x.Email == model.Email).FirstOrDefaultAsync();
            user.AccountStatus = "Declined";

            await _dbContext.SaveChangesAsync();


            var message = new Message(new string[] { user.Email }, "Your account has been declined!",
                "This is to confirm that your account has been declined for access.");
            _emailSender.SendEmail(message);

            return Ok();
        }
    }
}
