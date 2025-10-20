using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using productApi.Context;

[ApiController]
[Route("api/[controller]")]
// [Authorize(Roles = "Customer,Admin")]
public class OrderController : ControllerBase
{
    private readonly productDb _context;

    public OrderController(productDb context)
    {
        _context = context;
    }

    // GET: api/order
    [HttpGet]
    public async Task<ActionResult<List<OrderReadDTO>>> GetAllOrders()
    {
        var ordersDto = await _context.Orders
            .AsNoTracking()
            .Include(o => o.OrderItems)
            .Include(o => o.User)
            .Select(order => new OrderReadDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                CreatedAt = order.CreatedAt,
                TotalPrice = order.TotalPrice,
                Status = order.Status,
                OrderItems = order.OrderItems.Select(oi => new OrderItemReadDTO
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    ImgUrl = oi.ImgUrl,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            })
            .ToListAsync();

        return Ok(ordersDto);
    }

    // GET: api/order/user-getall-orders
    [HttpGet("user-getall-orders")]
    public async Task<ActionResult<List<OrderReadDTO>>> GetOrdersForUser()
    {
        var user = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userId = int.Parse(user!);
        if (userId == 0) return Unauthorized("User not found");

        var orders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
            .Select(o => new OrderReadDTO
            {
                UserId = o.UserId,
                CreatedAt = o.CreatedAt,
                TotalPrice = o.TotalPrice,
                Status = o.Status,
                OrderItems = o.OrderItems.Select(oi => new OrderItemReadDTO
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    ImgUrl = oi.ImgUrl,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.Quantity * oi.UnitPrice
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<OrderReadDTO>> GetOrderById(int id)
    {
        var order = await _context.Orders
            .AsNoTracking()
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return NotFound();

        return Ok(new OrderReadDTO
        {
            UserId = order.UserId,
            CreatedAt = order.CreatedAt,
            TotalPrice = order.TotalPrice,
            Status = order.Status,
            OrderItems = order.OrderItems.Select(oi => new OrderItemReadDTO
            {
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                ImgUrl = oi.ImgUrl,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice
            }).ToList()
        });
    }

    // PATCH: api/order/{id}/status
    [HttpPatch("{id}/status")]
    public IActionResult UpdateOrderStatus(int id, string status)
    {
    
        return Ok("Demo: Order status would be updated here.");
    }
}
