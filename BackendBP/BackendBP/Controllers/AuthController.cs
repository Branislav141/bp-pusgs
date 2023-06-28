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
using System.Security.Cryptography.X509Certificates;
using System.Collections.Generic;

namespace BackendBP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly BackendContext _dbContext;
        private readonly UserManager<BackendUser> _userManager;
        private readonly SignInManager<BackendUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthController(BackendContext dbContext, UserManager<BackendUser> userManager, SignInManager<BackendUser> signInManager, RoleManager<IdentityRole> roleManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            // Find the user by email
            var user = _dbContext.Users.FirstOrDefault(user => user.Email == loginModel.Email);
            if (user != null)
            {
                // Check if the provided password is valid
                var signInResult = await _signInManager.CheckPasswordSignInAsync(user, loginModel.Password, false);

                if (signInResult.Succeeded)
                {
                    // Generate a JWT token for the authenticated user
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.ASCII.GetBytes("MY_BIG_SECRET_KEY_GHJDKGDSNGNDSNJKGNJDS");

                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier,user.Id),
                        new Claim(ClaimTypes.Email, loginModel.Email),
                        new Claim(ClaimTypes.Name, user.Name),
                    };

                    // Assign user.AccountType to the role claim
                    if (!await _roleManager.RoleExistsAsync(user.AccountType))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(user.AccountType));
                    }
                    claims.Add(new Claim(ClaimTypes.Role, user.AccountType));

                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(claims),
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
                UserName = registrationModel.UserName,
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
                // Create a role for the user's account type
                if (!await _roleManager.RoleExistsAsync(backendUser.AccountType))
                {
                    await _roleManager.CreateAsync(new IdentityRole(backendUser.AccountType));
                }

                return Ok(new { Result = "Register Succeeded" });
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
