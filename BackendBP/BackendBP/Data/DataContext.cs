using BackendBP.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendBP.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Article> Articles { get; set; }
        public DbSet<ArticalPhoto> ArticalPhotos { get; set; }
        public DbSet<Order> Orders { get; set; }

    }
}
