using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using productApi.Context;
using productApi.Models;

namespace productApi.SeedUser
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<productDb>();

            // DB'yi oluştur ve foreign key kontrolünü aç
            context.Database.EnsureCreated();
            context.Database.OpenConnection();
            context.Database.ExecuteSqlRaw("PRAGMA foreign_keys = ON;");

            var passwordHasher = new PasswordHasher<User>();

            // Kullanıcılar
            if (!context.Users.Any())
            {
                var adminUser = new User
                {
                    UserName = "admin",
                    IsEmailConfirmed = true,
                    Role = "Admin"
                };
                adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, "Admin123!");

                var customerUser = new User
                {
                    UserName = "customer",
                    IsEmailConfirmed = true,
                    Role = "Customer"
                };
                customerUser.PasswordHash = passwordHasher.HashPassword(customerUser, "Customer123!");

                context.Users.AddRange(adminUser, customerUser);
                await context.SaveChangesAsync();
            }

            // Kategoriler
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new Category { CategoryName = "Electronics" },
                    new Category { CategoryName = "Books" },
                    new Category { CategoryName = "Clothing" }
                };
                context.Categories.AddRange(categories);
                await context.SaveChangesAsync();
            }

            // Ürünler
            if (!context.Products.Any())
            {
                var categories = context.Categories.ToList();
                var products = new List<Product>
                {
                    new Product
                    {
                        ProductName = "Wireless Headphones",
                        Description = "Noise cancelling over-ear headphones",
                        Price = 499.99M,
                        Stock = 25,
                        ImgUrl = "https://via.placeholder.com/300x200?text=Headphones",
                        CategoryId = categories.First(c => c.CategoryName == "Electronics").Id
                    },
                    new Product
                    {
                        ProductName = "Smartphone",
                        Description = "Latest model with AMOLED display",
                        Price = 1299.00M,
                        Stock = 15,
                        ImgUrl = "https://via.placeholder.com/300x200?text=Smartphone",
                        CategoryId = categories.First(c => c.CategoryName == "Electronics").Id
                    },
                    new Product
                    {
                        ProductName = "Novel Book",
                        Description = "A best-selling fiction novel",
                        Price = 59.90M,
                        Stock = 100,
                        ImgUrl = "https://via.placeholder.com/300x200?text=Book",
                        CategoryId = categories.First(c => c.CategoryName == "Books").Id
                    },
                    new Product
                    {
                        ProductName = "T-Shirt",
                        Description = "Cotton unisex t-shirt",
                        Price = 149.90M,
                        Stock = 60,
                        ImgUrl = "https://via.placeholder.com/300x200?text=T-Shirt",
                        CategoryId = categories.First(c => c.CategoryName == "Clothing").Id
                    }
                };
                context.Products.AddRange(products);
                await context.SaveChangesAsync();
            }

            // Örnek sipariş
            if (!context.Orders.Any())
            {
                var customerUser = context.Users.First(u => u.UserName == "customer");
                var products = context.Products.ToList();

                var sampleOrder = new Order
                {
                    UserId = customerUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    Status = Order.OrderStatus.Delivered,
                    TotalPrice = products[0].Price + products[2].Price,
                    OrderItems = new List<OrderItem>
                    {
                        new OrderItem
                        {
                            ProductId = products[0].Id,
                            ProductName = products[0].ProductName,
                            ImgUrl = products[0].ImgUrl,
                            Quantity = 1,
                            UnitPrice = products[0].Price,
                            TotalPrice = products[0].Price
                        },
                        new OrderItem
                        {
                            ProductId = products[2].Id,
                            ProductName = products[2].ProductName,
                            ImgUrl = products[2].ImgUrl,
                            Quantity = 1,
                            UnitPrice = products[2].Price,
                            TotalPrice = products[2].Price
                        }
                    }
                };

                context.Orders.Add(sampleOrder);
                await context.SaveChangesAsync();
            }
        }
    }
}
