namespace backend.Models;

public class InventoryItem
{
    public int Id { get; set; }
    public ItemType Type { get; set; }
    public string Identifier { get; set; } = "";
    public int Quantity { get; set; }
    public string Comment { get; set; } = "";
    public DateTime PurchaseDate { get; set; }
    public bool IsAssigned { get; set; } = true;
    public int? UserId { get; set; }
    public User? User { get; set; }
}