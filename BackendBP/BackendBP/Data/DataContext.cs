using Microsoft.EntityFrameworkCore;

namespace BackendBP.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    }
}
