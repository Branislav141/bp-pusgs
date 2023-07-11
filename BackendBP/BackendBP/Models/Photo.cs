using BackendBP.Areas.Identity.Data;

namespace BackendBP.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsDeleted { get; set; }
        
    }
}
