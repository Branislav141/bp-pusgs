using BackendBP.Models;

namespace BackendBP.Dtos
{
    public class ArticlesToAdd
    {
   
        public string Name { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public string PhotoUrl { get; set; }
        
    }
}
