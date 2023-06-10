using BackendBP.Areas.Identity.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System;
using BackendBP.Dtos;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace BackendBP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly BackendContext _dbContext;
        private readonly UserManager<BackendUser> _userManager;
        private readonly SignInManager<BackendUser> _signInManager;

        public AuthController(BackendContext dbContext, UserManager<BackendUser> userManager, SignInManager<BackendUser> signInManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _signInManager = signInManager;
        
        }

        [HttpPost("login")]
        
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var user = _dbContext.Users.FirstOrDefault(user => user.Email == loginModel.Email);
            if (user != null)
            {
                var signInResult = await _signInManager.CheckPasswordSignInAsync(user, loginModel.Password, false);

                if (signInResult.Succeeded)
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.ASCII.GetBytes("MY_BIG_SECRET_KEY_GHJDKGDSNGNDSNJKGNJDS");
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[] {
                        new Claim(ClaimTypes.Name, loginModel.Email) }),
                        Expires = DateTime.UtcNow.AddDays(1),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
                    };
                    var token = tokenHandler.CreateToken(tokenDescriptor);
                    var tokenString = tokenHandler.WriteToken(token);

                    return Ok(new { token = tokenString, user = user });
                }
                else
                {
                    return BadRequest("Password not valid");
                }
            }
            return BadRequest("No user with such credentials");
        }




        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel registrationModel)
        {
            BackendUser backendUser = new BackendUser()
            {
                Email = registrationModel.Email,
                UserName = registrationModel.Email,
                EmailConfirmed = false,
                Name = registrationModel.Name,
                Surname = registrationModel.Surname,
                Birthday = registrationModel.Birthday,
                Address = registrationModel.Address,
                AccountType = registrationModel.AccountType,
                AccountStatus = "Pending"
            };

            var result = await _userManager.CreateAsync(backendUser, registrationModel.Password);

            if (result.Succeeded)
            {
                return Ok(new { Result = "Register Succeded" });
            }
            else
            {
                StringBuilder sb = new StringBuilder();
                foreach (var error in result.Errors)
                {
                    sb.Append(error.Description);
                }

                return BadRequest(new { Result = $"Register Failed: {sb}" });
            }
        }

    }
}
