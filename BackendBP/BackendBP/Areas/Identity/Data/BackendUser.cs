using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using BackendBP.Models;
using Microsoft.AspNetCore.Identity;

namespace BackendBP.Areas.Identity.Data
{
    // Add profile data for application users by adding properties to the BackendUser class
    public class BackendUser : IdentityUser
    {
        [Required]
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateTime Birthday { get; set; }
        public string Address { get; set; }
        public string AccountType { get; set; }
        public string AccountStatus { get; set; }

        public Photo PhotoUser { get; set; }
    }
}
