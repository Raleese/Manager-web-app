namespace backend.Models;

public class InventoryItem
{
    public int Id { get; set; }
    public ItemType Type { get; set; }
    public string Identifier { get; set; } = "";
    public string Comment { get; set; } = "";
    public User? User { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public bool IsActive { get; set; } = true;
}