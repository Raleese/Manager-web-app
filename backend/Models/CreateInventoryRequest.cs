namespace backend.Models;
public class CreateInventoryRequest
{
    public ItemType Type { get; set; }
    public string Identifier { get; set; } = "";
    public string Comment { get; set; } = "";
    public DateTime? PurchaseDate { get; set; }
    public int? UserId { get; set; }
}