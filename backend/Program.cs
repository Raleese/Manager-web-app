using backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

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

app.Run();