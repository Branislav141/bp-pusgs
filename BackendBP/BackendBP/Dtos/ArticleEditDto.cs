using Microsoft.AspNetCore.Http;

namespace BackendBP.Dtos
{
    
        public class ArticleEditDto
        {
            public string Name { get; set; }
            public double Price { get; set; }
            public int Quantity { get; set; }
            public string Description { get; set; }
            public bool IsPhotoDeleted { get; set; } 
            public IFormFile ImageFile { get; set; } 
            public string PhotoUrl { get; set; } 
        }
    

}
