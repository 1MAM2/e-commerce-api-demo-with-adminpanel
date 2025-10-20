using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using productApi.Context;
using productApi.DTOS.UserDTOs;
using productApi.Models;

namespace productApi.Controllers
{
    [ApiController]
    // [Authorize(Roles = "Customer,Admin")]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly productDb _context;

        public UserController(productDb context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserReadDTO>>> GetAllUsers()
        {
            var users = await _context.Users
                .Where(u => !u.IsDeleted)
                .ToListAsync();

            var userDTOs = users.Select(u => new UserReadDTO
            {
                Id = u.Id!,
                UserName = u.UserName,
                Address = u.Address,
                Email = u.Email,
                Role = u.Role,
                PhoneNumber = u.PhoneNumber,
                IsEmailConfirmed = u.IsEmailConfirmed
            }).ToList();

            return Ok(userDTOs);
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserReadDTO>> GetCurrentUser()
        {
            //var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // if (!int.TryParse(userIdStr, out var userId))
            //     return NotFound("User not found");
            var userId = 1;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound("User not found, please try again later");

            var userDto = new UserReadDTO
            {
                Id = user.Id!,
                UserName = user.UserName,
                Role = user.Role,
                Address = user.Address,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                IsEmailConfirmed = user.IsEmailConfirmed
            };

            return Ok(userDto);
        }



        [HttpPut("soft-delete/{id}")]
        public IActionResult SoftDeleteUser(int id)
        {
            return Ok("Demo: User would be soft deleted here.");
        }
    }
}
