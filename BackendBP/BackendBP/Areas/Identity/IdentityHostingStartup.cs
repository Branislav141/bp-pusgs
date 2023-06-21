using System;
using BackendBP.Areas.Identity.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
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

                services.AddDefaultIdentity<BackendUser>()//options => options.SignIn.RequireConfirmedAccount = true)
                    .AddEntityFrameworkStores<BackendContext>();
            });
        }
    }
}