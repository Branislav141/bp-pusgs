using Microsoft.AspNetCore.Http;

namespace BackendBP.Dtos
{
    
        public class ArticleEditDto
        {
            public string Name { get; set; }
            public double Price { get; set; }
            public int Quantity { get; set; }
            public string Description { get; set; }
            public bool IsPhotoDeleted { get; set; } // Dodajemo polje za proveru da li korisnik želi da obriše postojeću sliku
            public IFormFile ImageFile { get; set; } // Dodajemo polje za novu sliku
            public string PhotoUrl { get; set; } // Dodajemo polje za URL postojeće slike
        }
    

}
