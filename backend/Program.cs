using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("AppDatabase"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.MapControllers();

// Seed some demo users into the in-memory database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!db.Users.Any())
    {
        db.Users.AddRange(new[] {
            new backend.Models.User { FirstName = "Alice", LastName = "Anderson", Identifier = "A001" },
            new backend.Models.User { FirstName = "Bob", LastName = "Brown", Identifier = "B002" },
            new backend.Models.User { FirstName = "Carol", LastName = "Clark", Identifier = "C003" }
        });
        db.SaveChanges();
    }
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!db.InventoryItems.Any())
    {
        var user1 = db.Users.FirstOrDefault(u => u.Identifier == "A001");
        var user2 = db.Users.FirstOrDefault(u => u.Identifier == "B002");

        db.InventoryItems.AddRange(new[] {
            new backend.Models.InventoryItem { Type = backend.Models.ItemType.Laptop, Identifier = "L001", Comment = "Dell XPS 13", User = user1, PurchaseDate = DateTime.Now.AddMonths(-6) },
            new backend.Models.InventoryItem { Type = backend.Models.ItemType.Phone, Identifier = "P001", Comment = "iPhone 12", User = user2, PurchaseDate = DateTime.Now.AddMonths(-3) },
            new backend.Models.InventoryItem { Type = backend.Models.ItemType.Tablet, Identifier = "T001", Comment = "iPad Pro", User = null, PurchaseDate = DateTime.Now.AddMonths(-1) }
        });
        db.SaveChanges();
    }
}

app.Run();