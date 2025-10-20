public class OrderItemReadDTO
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string? ProductName { get; set; } 
    public string? ImgUrl { get; set; }   
}