﻿using System;

namespace BackendBP.Dtos
{
    public class RegistrationModel
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateTime Birthday { get; set; }
        public string Address { get; set; }
        public string AccountType { get; set; }
        public string PhotoUrl { get; set; }
    }
}
