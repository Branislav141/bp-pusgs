using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackendBP.Models
{
    public class User
    {
        public String KorisnickoIme { get; set; }
        public String Email { get; set; }
        public String Lozinka { get; set; }
        public String Ime { get; set; }
        public String Prezime { get; set; }
        public DateTime DatumRodjenja { get; set; }
        public String Adresa { get; set; }
        public String Slika { get; set; }
      

    }
}
