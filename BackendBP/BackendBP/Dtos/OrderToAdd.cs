using BackendBP.Models;
using System;
using System.Collections.Generic;

namespace BackendBP.Dtos
{
    public class OrderToAdd
    {
        public List<Article> cartItems { get; set; }
        public double TotalPrice { get; set; }
        public Dictionary<int, int> Quantities { get; set; }
        public string Comment { get; set; }
        public string DeliveryAddress { get; set; }
    }
}
