using backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly AppDbContext _db;

    public InventoryController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public ActionResult<IEnumerable<object>> Get()
    {
        var items = _db.InventoryItems
            .Select(i => new
            {
                i.Id,
                i.Type,
                i.Identifier,
                i.Comment,
                i.PurchaseDate,
                i.IsAssigned,
                User = i.User != null ? new { i.User.Id, i.User.FirstName, i.User.LastName, Identifier = i.User.Identifier } : null
            })
            .ToList();

        return Ok(items);
    }
}