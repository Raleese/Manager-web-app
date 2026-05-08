using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public ActionResult<IEnumerable<object>> Get()
    {
        var users = _db.Users
            .Select(u => new { u.Id, u.FirstName, u.LastName, Identifier = u.Identifier })
            .ToList();

        return Ok(users);
    }
}
