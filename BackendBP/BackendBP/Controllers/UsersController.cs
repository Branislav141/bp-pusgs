using BackendBP.Areas.Identity.Data;
using BackendBP.Dtos;
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

        public UsersController(UserManager<BackendUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.Identity.Name; // If you have set the username claim

            // Fetch the user data based on the userId or userName from the database
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound();

            var userModel = new BackendUser
            {
                Name = user.Name,
                Email = user.Email,
                UserName= user.UserName,
                Address=user.Address,
                Surname=user.Surname,
                Birthday=user.Birthday,
                // Set other user properties
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
    }
}
