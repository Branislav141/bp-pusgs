using System;
using BackendBP.Areas.Identity.Data;
using EmailSender;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: HostingStartup(typeof(BackendBP.Areas.Identity.IdentityHostingStartup))]
namespace BackendBP.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) => {
                services.AddDbContext<BackendContext>(options =>
                    options.UseSqlServer(
                        context.Configuration.GetConnectionString("BackendContextConnection")));

               services.AddIdentity<BackendUser, IdentityRole>(options =>
                {
                    options.SignIn.RequireConfirmedAccount = false;
                    options.Password.RequireDigit = false;
                    options.Password.RequiredLength = 5;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = false;



                }).AddDefaultTokenProviders()
                    .AddEntityFrameworkStores<BackendContext>();

                services.ConfigureApplicationCookie(options =>
                {
                    options.Cookie.HttpOnly = true;
                    
                });

                services.AddSingleton<IEmailSender, EmailSenderr>();
            });
        }
    }
}