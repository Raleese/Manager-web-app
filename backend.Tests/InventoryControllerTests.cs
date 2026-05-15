using backend.Controllers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace backend.Tests;

public class InventoryControllerTests
{
    [Fact]
    public void Create_AddsActiveItem_AndTrimsTextFields()
    {
        using var db = TestDbContextFactory.Create();
        var controller = new InventoryController(db);

        var result = controller.Create(new CreateInventoryRequest
        {
            Type = ItemType.Laptop,
            Identifier = "  LTP-1001  ",
            Comment = "  Dev laptop  ",
            PurchaseDate = new DateTime(2026, 5, 15)
        });

        Assert.IsType<NoContentResult>(result);
        var item = Assert.Single(db.InventoryItems);
        Assert.Equal("LTP-1001", item.Identifier);
        Assert.Equal("Dev laptop", item.Comment);
        Assert.True(item.IsActive);
    }

    [Fact]
    public void Create_ReturnsBadRequest_WhenAssignedUserDoesNotExist()
    {
        using var db = TestDbContextFactory.Create();
        var controller = new InventoryController(db);

        var result = controller.Create(new CreateInventoryRequest
        {
            Type = ItemType.Phone,
            Identifier = "PHN-2002",
            Comment = "Office phone",
            UserId = 404
        });

        Assert.IsType<BadRequestObjectResult>(result);
        Assert.Empty(db.InventoryItems);
    }

    [Fact]
    public void Delete_RemovesExistingItem()
    {
        using var db = TestDbContextFactory.Create();
        var item = new InventoryItem
        {
            Type = ItemType.Tablet,
            Identifier = "TAB-4004",
            Comment = "Testing tablet"
        };
        db.InventoryItems.Add(item);
        db.SaveChanges();
        var controller = new InventoryController(db);

        var result = controller.Delete(item.Id);

        Assert.IsType<OkResult>(result);
        Assert.Empty(db.InventoryItems);
    }

    [Fact]
    public void SoftDelete_TogglesItemActivity()
    {
        using var db = TestDbContextFactory.Create();
        var item = new InventoryItem
        {
            Type = ItemType.SIMCard,
            Identifier = "SIM-3003",
            Comment = "Spare SIM",
            IsActive = true
        };
        db.InventoryItems.Add(item);
        db.SaveChanges();
        var controller = new InventoryController(db);

        var result = controller.SoftDelete(item.Id);

        Assert.IsType<OkResult>(result);
        Assert.False(item.IsActive);
    }
}
