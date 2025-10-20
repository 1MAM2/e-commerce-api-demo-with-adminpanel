using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using productApi.Context;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly productDb _context;

    public CategoryController(productDb context)
    {
        _context = context;
    }

    // GET: api/category
    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _context.Categories
            .AsNoTracking() // read-only sorgular için performans artışı
            .Where(c => !c.IsDeleted)
            .Select(c => new CategoryReadDTO
            {
                Id = c.Id,
                CategoryName = c.CategoryName
            })
            .ToListAsync();

        if (categories == null || categories.Count == 0) return NotFound("Kategori bulunamadı");

        return Ok(categories);
    }

    // GET: api/category/{catid}/products
    [HttpGet("{catid}/products")]
    public async Task<IActionResult> GetProductsByCategory(int catid)
    {
        // Projection kullanarak sadece gerekli alanları alıyoruz
        var products = await _context.Products
            .AsNoTracking()
            .Where(p => p.CategoryId == catid && !p.IsDeleted && p.Stock > 5)
            .Select(p => new ProductReadDTO
            {
                Id = p.Id,
                ProductName = p.ProductName,
                Price = p.Price,
                Stock = p.Stock,
                ImgUrl = p.ImgUrl,
                CategoryId = p.CategoryId,
                CategoryName =p.CategoryName,
            })
            .ToListAsync();

        if (products == null || products.Count == 0)
            return NotFound("Bu kategoriye ait ürün bulunamadı");

        return Ok(products);
    }

    // GET: api/category/{catid}
    [HttpGet("{catid}")]
    public async Task<IActionResult> GetCategoryById(int catid)
    {
        var category = await _context.Categories
            .AsNoTracking()
            .Where(c => c.Id == catid && !c.IsDeleted)
            .Select(c => new CategoryReadDTO
            {
                Id = c.Id,
                CategoryName = c.CategoryName
            })
            .FirstOrDefaultAsync();

        if (category == null) return NotFound("Kategori bulunamadı");

        return Ok(category);
    }
}
