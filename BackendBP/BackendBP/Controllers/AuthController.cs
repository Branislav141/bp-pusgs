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
using Microsoft.AspNetCore.Http;
using BackendBP.Models;
using System.IO;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication;
using System.Net.Http.Json;
using System.Text.Json;

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
        private readonly IConfiguration _configuration;


        public AuthController(IConfiguration configuration,BackendContext dbContext, UserManager<BackendUser> userManager, SignInManager<BackendUser> signInManager, RoleManager<IdentityRole> roleManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
           
        }



        [HttpPost("login-with-google")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginModel request)
        {
          
            var httpClient = new HttpClient();
            var googleResponse = await httpClient.GetAsync($"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={request.Token}");


            if (!googleResponse.IsSuccessStatusCode)
            {
                return BadRequest("Failed to validate with Google");
            }


            var googleResponseContent = await googleResponse.Content.ReadAsStringAsync();
            var googleTokenInfo = JsonSerializer.Deserialize<GoogleTokenInfo>(googleResponseContent);

            var email = googleTokenInfo.email;

         
            var existingUser = _dbContext.Users.FirstOrDefault(user => user.Email == email);

            if (existingUser != null)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("MY_BIG_SECRET_KEY_GHJDKGDSNGNDSNJKGNJDS");

                var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier,existingUser.Id),
                        new Claim(ClaimTypes.Email, existingUser.Email),
                        new Claim(ClaimTypes.Name, existingUser.Name),
                        new Claim(ClaimTypes.Role, existingUser.AccountType)
                    };


                if (!await _roleManager.RoleExistsAsync(existingUser.AccountType))
                {
                    await _roleManager.CreateAsync(new IdentityRole(existingUser.AccountType));
                }
                claims.Add(new Claim(ClaimTypes.Role, existingUser.AccountType));

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new { token = tokenString, user = existingUser });
            }
            else
            {
               
                var newUser = new BackendUser
                {
                    Email = googleTokenInfo.email,
                    EmailConfirmed = false,
                    Name = googleTokenInfo.name,
                    AccountType = "kupac",
                    UserName = googleTokenInfo.name,
                    PhotoUser=new Photo
                    {
                        Url=googleTokenInfo.picture,
                        IsDeleted=false,
                    }
                };


                _dbContext.Users.Add(newUser);
                await _dbContext.SaveChangesAsync();

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("MY_BIG_SECRET_KEY_GHJDKGDSNGNDSNJKGNJDS");

                var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier,newUser.Id),
                        new Claim(ClaimTypes.Email, newUser.Email),
                        new Claim(ClaimTypes.Name, newUser.Name),
                        new Claim(ClaimTypes.Role, newUser.AccountType)
                    };


                if (!await _roleManager.RoleExistsAsync(newUser.AccountType))
                {
                    await _roleManager.CreateAsync(new IdentityRole(newUser.AccountType));
                }
                claims.Add(new Claim(ClaimTypes.Role, newUser.AccountType));

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new { token = tokenString, user = newUser });


            }

        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
           
            var user = _dbContext.Users.FirstOrDefault(user => user.Email == loginModel.Email);
            if (user != null)
            {
                if(user.AccountType == "prodavac" && (user.AccountStatus== "Declined" || user.AccountStatus == "Pending"))
                {
                    return BadRequest("Your account is not active. Please wait for approval or contact support.");

                }
                
                var signInResult = await _signInManager.CheckPasswordSignInAsync(user, loginModel.Password, false);

                if (signInResult.Succeeded)
                {

                  
                   
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.ASCII.GetBytes("MY_BIG_SECRET_KEY_GHJDKGDSNGNDSNJKGNJDS");

                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier,user.Id),
                        new Claim(ClaimTypes.Email, loginModel.Email),
                        new Claim(ClaimTypes.Name, user.Name),
                        new Claim(ClaimTypes.Role, user.AccountType)
                    };

                    
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

            if (!string.IsNullOrEmpty(registrationModel.PhotoUrl))
            {
                backendUser.PhotoUser = new Photo { Url = registrationModel.PhotoUrl, IsDeleted = false };
            }

            var result = await _userManager.CreateAsync(backendUser, registrationModel.Password);

            if (result.Succeeded)
            {
                // Create a role for the user's account type
                if (!await _roleManager.RoleExistsAsync(backendUser.AccountType))
                {
                    await _roleManager.CreateAsync(new IdentityRole(backendUser.AccountType));
                }

                return Ok(new { Result = "Registration succeeded" });
            }
            else
            {
                var errors = result.Errors.Select(error => error.Description);
                return BadRequest(new { Result = "Registration failed", Errors = errors });
            }
        }

        [HttpPost("uploadPhoto")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            // Check if a file is uploaded
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            try
            {
                // Generate a unique file name
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

                // Determine the path where you want to save the image on the server
                string imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Resources", "Images", fileName);

                // Save the image to the specified path
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Generate the URL of the uploaded photo
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
