using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using productApi.Models;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
     public User? User { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaymentDate { get; set; } = null;
    public decimal TotalPrice { get; set; }

    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public OrderStatus Status { get; set; } = OrderStatus.Pending;


    public enum OrderStatus
    {
        Cancelled = 0,    // İptal edildi
        Paid = 1,
        Pending = 2,     // Sipariş alındı ama işleme başlanmadı
        Processing = 3,  // Hazırlanıyor
        Shipped = 4,     // Kargoya verildi
        Delivered = 5,   // Teslim edildi
    }
}