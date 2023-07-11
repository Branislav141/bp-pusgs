using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendBP.Areas.Identity.Data;
using BackendBP.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BackendBP.Areas.Identity.Data
{
    public class BackendContext : IdentityDbContext<BackendUser>
    {
        public BackendContext(DbContextOptions<BackendContext> options)
            : base(options)
        {
        }

        public DbSet<BackendUser> BackendUsers { get; set; }
        public DbSet<Photo> Photos { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
    }
}
