using System;
using System.Collections.Generic;

namespace BackendBP.Models
{
    public class Order
    {
        public int Id { get; set; }
        public List<Article> Articles { get; set; }    
        public double TotalPrice { get; set; }
        public string Comment { get; set; }

        public List<Seller> Sellers { get; set; }
        public string Buyer { get; set; }   
        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string DeliveryAddress { get; set; }
        public string OrdersStatus { get; set; }
    }
}
