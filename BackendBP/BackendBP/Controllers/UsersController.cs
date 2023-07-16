using BackendBP.Areas.Identity.Data;
using BackendBP.Dtos;
using BackendBP.Models;
using EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
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



        
        [HttpPost("user/update")]
        
        public async Task<IActionResult> UpdateUser([FromBody] EditProfileModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return NotFound();

            user.UserName = model.UserName;
            user.Email = model.Email;
            user.Name = model.Name;
            user.Surname = model.Surname;
            user.Birthday = model.Birthday;
            user.Address = model.Address;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
                return Ok();

            return BadRequest(result.Errors);
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
