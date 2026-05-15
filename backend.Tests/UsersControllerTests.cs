using backend.Controllers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace backend.Tests;

public class UsersControllerTests
{
    [Fact]
    public async Task Post_CreatesUser_WithTrimmedIdentifier()
    {
        await using var db = TestDbContextFactory.Create();
        var controller = new UsersController(db);
        var user = new User
        {
            FirstName = "Alice",
            LastName = "Johnson",
            Identifier = "  alice.j  "
        };

        var result = await controller.Post(user);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var createdUser = Assert.IsType<User>(created.Value);
        Assert.Equal("alice.j", createdUser.Identifier);
        Assert.Single(db.Users);
    }

    [Fact]
    public async Task Post_ReturnsConflict_WhenIdentifierAlreadyExistsIgnoringCase()
    {
        await using var db = TestDbContextFactory.Create();
        db.Users.Add(new User
        {
            FirstName = "Alice",
            LastName = "Johnson",
            Identifier = "alice.j"
        });
        await db.SaveChangesAsync();
        var controller = new UsersController(db);

        var result = await controller.Post(new User
        {
            FirstName = "Alicia",
            LastName = "Jones",
            Identifier = "ALICE.J"
        });

        Assert.IsType<ConflictObjectResult>(result.Result);
        Assert.Single(db.Users);
    }

    [Fact]
    public async Task Delete_RemovesExistingUser()
    {
        await using var db = TestDbContextFactory.Create();
        var user = new User
        {
            FirstName = "Bob",
            LastName = "Smith",
            Identifier = "bob.s"
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        var controller = new UsersController(db);

        var result = await controller.Delete(user.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.Empty(db.Users);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenUserDoesNotExist()
    {
        await using var db = TestDbContextFactory.Create();
        var controller = new UsersController(db);

        var result = await controller.Delete(999);

        Assert.IsType<NotFoundResult>(result);
    }
}
