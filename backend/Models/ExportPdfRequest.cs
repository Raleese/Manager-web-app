namespace backend.Models;

public class ExportPdfRequest
{
    public string? Type { get; set; }
    public string? Comment { get; set; }
    public int? UserId { get; set; }
    public string Template { get; set; } = "Summary";
}