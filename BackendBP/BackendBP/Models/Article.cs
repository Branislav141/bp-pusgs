using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendBP.Models
{
    public class Article
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }   
        public int Quantity { get; set; }
        public string Description { get; set; }
        public ArticalPhoto APhoto { get; set; }
        public string UserCreated { get; set; }

    }
}
