using backend.Data;
using backend.Models;
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
                i.IsActive,
                User = i.User != null ? new { i.User.Id, i.User.FirstName, i.User.LastName, Identifier = i.User.Identifier } : null
            })
            .ToList();

        return Ok(items);
    }

    [HttpPost]
    public ActionResult Create([FromBody] CreateInventoryRequest request)
    {
        if (request == null)
            return BadRequest();

        User? user = null;

        if (request.UserId.HasValue)
        {
            var userId = request.UserId.Value;
            user = _db.Users.Find(userId);
            if (user == null)
                return BadRequest(new { message = "User not found." });

        }

        var item = new InventoryItem
        {
            Type = request.Type,
            Identifier = request.Identifier.Trim(),
            Comment = request.Comment.Trim(),
            PurchaseDate = request.PurchaseDate,
            User = user,
            IsActive = true,
        };

        _db.InventoryItems.Add(item);
        _db.SaveChanges();

        return NoContent();
    }

    public class CreateInventoryRequest
    {
        public ItemType Type { get; set; }
        public string Identifier { get; set; } = "";
        public string Comment { get; set; } = "";
        public DateTime? PurchaseDate { get; set; }
        public int? UserId { get; set; }
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var item = _db.InventoryItems.Find(id);
        if (item == null)
            return NotFound();

        _db.InventoryItems.Remove(item);
        _db.SaveChanges();

        return Ok();
    }

    [HttpPost("{id}/soft")]
    public ActionResult SoftDelete(int id)
    {
        var item = _db.InventoryItems.Find(id);
        if (item == null)
            return NotFound();

        item.IsActive = !item.IsActive;
        _db.SaveChanges();

        return Ok();
    }
}
