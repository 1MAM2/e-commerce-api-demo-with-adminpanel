using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using productApi.Context;
using System.Linq;
using System.Threading.Tasks;

namespace productApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly productDb _context;

        public ProductController(productDb context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Where(p => !p.IsDeleted && p.Stock > 5)
                .Include(p => p.Category)
                .Include(p => p.GalleryImages)
                .ToListAsync();

            var productDto = products.Select(p => new ProductReadDTO
            {
                Id = p.Id,
                ProductName = p.ProductName,
                ImgUrl = p.ImgUrl,
                CategoryName = p.Category?.CategoryName,
                Price = p.Price,
                Discount = p.Discount,
                FinalPrice = p.Price * (1 - p.Discount),
                Description = p.Description,
                CategoryId = p.CategoryId,
                GalleryImages = p.GalleryImages?.Select(img => img.ImageUrl).ToList() ?? new List<string>()!,
                Stock = p.Stock,
            });

            return Ok(productDto);
        }
        [HttpGet("adminGetAll")]
        public async Task<IActionResult> adminGetAll()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.GalleryImages)
                .ToListAsync();

            var productDto = products.Select(p => new ProductReadDTO
            {
                Id = p.Id,
                ProductName = p.ProductName,
                ImgUrl = p.ImgUrl,
                CategoryName = p.Category?.CategoryName,
                Price = p.Price,
                Discount = p.Discount,
                FinalPrice = p.Price * (1 - p.Discount),
                Description = p.Description,
                CategoryId = p.CategoryId,
                GalleryImages = p.GalleryImages?.Select(img => img.ImageUrl).ToList() ?? new List<string>()!,
                Stock = p.Stock,
            });

            return Ok(productDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products
                .Where(p => !p.IsDeleted && p.Stock > 5 && p.Id == id)
                .Include(p => p.Category)
                .Include(p => p.GalleryImages)
                .FirstOrDefaultAsync();

            if (product == null) return NotFound();

            var productReadDTO = new ProductReadDTO
            {
                Id = product.Id,
                ProductName = product.ProductName,
                Price = product.Price,
                Discount = product.Discount,
                FinalPrice = product.Price * (1 - product.Discount),
                ImgUrl = product.ImgUrl,
                CategoryName = product.Category?.CategoryName,
                Description = product.Description,
                CategoryId = product.CategoryId,
                GalleryImages = product.GalleryImages?.Select(img => img.ImageUrl).ToList() ?? new List<string>()!,
                Stock = product.Stock,
            };

            return Ok(productReadDTO);
        }

    }
}
