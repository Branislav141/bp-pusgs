using Microsoft.AspNetCore.Http;
using System;

namespace BackendBP.Dtos
{
    public class EditProfileModel
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateTime Birthday { get; set; }
        public string Address { get; set; }
        public bool IsPhotoDeleted { get; set; }
        public IFormFile ImageFile { get; set; }
        public string PhotoUrl { get; set; }
    }
}
