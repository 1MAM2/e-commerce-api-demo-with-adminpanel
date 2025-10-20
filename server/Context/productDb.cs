using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using productApi.Models;

namespace productApi.Context
{

    public class productDb : DbContext
    {


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Product>().ToTable("products"); // küçük harf
            modelBuilder.Entity<Category>().ToTable("categories"); // küçük harf
            modelBuilder.Entity<ProductImage>().ToTable("productimages"); // küçük harf
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<User>()
            .Property(u => u.Id)
            .ValueGeneratedOnAdd();
        }

        public productDb(DbContextOptions<productDb> options) : base(options) { }

        public DbSet<Product> Products => Set<Product>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<ProductImage> ProductImages => Set<ProductImage>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems { get; set; }




    }
}