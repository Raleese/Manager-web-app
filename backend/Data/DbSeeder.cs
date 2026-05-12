using backend.Models;

namespace backend.Data;

public static class DbSeeder
{
    public static void Initialize(AppDbContext context)
    {
        // If there are any users or items, assume DB has been seeded
        if (context.Users.Any() || context.InventoryItems.Any())
        {
            return;
        }

        var users = new List<User>
        {
            new User { FirstName = "Alice", LastName = "Johnson", Identifier = "alice.j" },
            new User { FirstName = "Bob", LastName = "Smith", Identifier = "bob.s" },
            new User { FirstName = "Carol", LastName = "Lee", Identifier = "carol.l" },
        };

        context.Users.AddRange(users);

        var items = new List<InventoryItem>
        {
            new InventoryItem { Type = ItemType.Laptop, Identifier = "LTP-1001", Comment = "Dev laptop", User = users[0], PurchaseDate = DateTime.UtcNow.AddYears(-2), IsActive = true },
            new InventoryItem { Type = ItemType.Phone, Identifier = "PHN-2002", Comment = "Office phone", User = users[1], PurchaseDate = DateTime.UtcNow.AddYears(-1), IsActive = true },
            new InventoryItem { Type = ItemType.SIMCard, Identifier = "SIM-3003", Comment = "Spare SIM", User = null, PurchaseDate = DateTime.UtcNow.AddMonths(-6), IsActive = true },
            new InventoryItem { Type = ItemType.Tablet, Identifier = "TAB-4004", Comment = "Testing tablet", User = users[2], PurchaseDate = DateTime.UtcNow.AddMonths(-3), IsActive = false },
        };

        context.InventoryItems.AddRange(items);

        context.SaveChanges();
    }
}
