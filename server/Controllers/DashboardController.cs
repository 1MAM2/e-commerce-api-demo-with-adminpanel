using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using productApi.Context;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly productDb _context;

    public DashboardController(productDb context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboardData()
    {
        var usersQuery = _context.Users.AsNoTracking().Where(u => !u.IsDeleted);

        var totalUsers = await usersQuery.CountAsync();
        var totalAdmins = await usersQuery.CountAsync(u => u.Role == "Admin");
        var totalCustomers = await usersQuery.CountAsync(u => u.Role == "Customer");

        var recentUsers = await usersQuery
            .OrderByDescending(u => u.CreatedAt)
            .Take(5)
            .Select(u => new { u.Id, u.UserName, u.Email })
            .ToListAsync();

        var ordersQuery = _context.Orders.AsNoTracking();

        var totalOrders = await ordersQuery.CountAsync();
        var completedOrders = await ordersQuery.CountAsync(o => o.Status == Order.OrderStatus.Delivered);
        var pendingOrders = await ordersQuery.CountAsync(o => o.Status == Order.OrderStatus.Pending);
        var canceledOrders = await ordersQuery.CountAsync(o => o.Status == Order.OrderStatus.Cancelled);

        // 🔧 SQLite decimal Sum/Average fix
        // Ortalama sipariş tutarı (client-side)
        var averageOrder = ordersQuery
            .AsEnumerable()
            .Where(o => o.Status == Order.OrderStatus.Delivered)
            .Select(o => (double?)Convert.ToDouble(o.TotalPrice))
            .Average() ?? 0;

        var recentOrders = await ordersQuery
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .Select(o => new { o.Id, o.UserId, o.TotalPrice, o.Status, o.CreatedAt })
            .ToListAsync();

        // Toplam gelir (client-side Sum)
        var totalRevenue = ordersQuery
            .AsEnumerable()
            .Where(o => o.Status == Order.OrderStatus.Delivered)
            .Sum(o => Convert.ToDecimal(o.TotalPrice));

        // Aylık gelir (client-side GroupBy)
        var monthlyRevenue = ordersQuery
            .AsEnumerable()
            .Where(o => o.Status == Order.OrderStatus.Delivered)
            .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Total = g.Sum(o => Convert.ToDecimal(o.TotalPrice))
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToList();

        // En çok satan ürünler
        var topProducts = _context.OrderItems
            .Include(oi => oi.Product)
            .AsEnumerable()
            .Where(oi => oi.Product != null && !oi.Product.IsDeleted)
            .GroupBy(oi => new { oi.ProductId, oi.Product!.ProductName })
            .Select(g => new
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.ProductName,
                Quantity = g.Sum(oi => oi.Quantity)
            })
            .OrderByDescending(x => x.Quantity)
            .Take(5)
            .ToList();

        var lowStockProducts = await _context.Products
            .AsNoTracking()
            .Where(p => p.Stock < 5 && !p.IsDeleted)
            .Select(p => new { p.ProductName, p.Stock })
            .ToListAsync();

        var dashboardData = new
        {
            userStats = new
            {
                totalUsers,
                totalAdmins,
                totalCustomers,
                recentUsers
            },
            orderStats = new
            {
                totalOrders,
                completedOrders,
                pendingOrders,
                canceledOrders,
                averageOrder,
                recentOrders
            },
            revenue = new
            {
                totalRevenue,
                monthlyRevenue
            },
            topProducts,
            lowStockProducts
        };

        return Ok(dashboardData);
    }
}
