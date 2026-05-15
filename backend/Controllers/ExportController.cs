using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using QuestPDF.Helpers;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExportController : ControllerBase
{
    private readonly AppDbContext _db;

    public ExportController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("pdf")]
    public IActionResult ExportToPdf([FromBody] ExportPdfRequest request)
    {
        // Build the query based on the provided filters
        var query = _db.InventoryItems
            .Include(i => i.User)
            .Where(i => i.IsActive);

        // Check if type filter is provided and apply it to the query
        if (!string.IsNullOrEmpty(request.Type))
        {
            query = query.Where(i => i.Type.ToString() == request.Type);
        }

        // Check if comment filter is provided and apply it to the query
        if (!string.IsNullOrEmpty(request.Comment))
        {
            query = query.Where(i => i.Comment.Contains(request.Comment));
        }

        // Check if user filter is provided and apply it to the query
        if (request.UserId.HasValue)
        {
            query = query.Where(i => i.User != null && i.User.Id == request.UserId.Value);
        }

        var items = query.ToList();

        byte[] pdfBytes;

        if (request.Template == "Summary")
        {
            pdfBytes = CreateSummary(items);
        }
        else
        {
            // The detailed template prints one card per item
            pdfBytes = CreateDetailed(items);
        }

        return File(pdfBytes, "application/pdf", "inventory.pdf");
    }

    private byte[] CreateSummary(List<InventoryItem> items)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.PageColor(Colors.White);
                page.Margin(20);

                page.Header()
                    .Text("Inventory Summary")
                    .FontSize(36)
                    .Bold()
                    .AlignCenter();

                page.Content()
                    .PaddingTop(25)
                    .Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Type").Bold();
                            header.Cell().Text("Identifier").Bold();
                            header.Cell().Text("Assigned User").Bold();
                            header.Cell().Text("Purchase Date").Bold();
                        });

                        foreach (var item in items)
                        {
                            table.Cell().Text(item.Type.ToString());
                            table.Cell().Text(item.Identifier);
                            table.Cell().Text(item.User != null ? $"{item.User.FirstName} {item.User.LastName}" : "N/A");
                            table.Cell().Text(item.PurchaseDate.HasValue ? item.PurchaseDate.Value.ToShortDateString() : "N/A");
                        }
                    });
            });
        }).GeneratePdf();
    }

    private byte[] CreateDetailed(List<InventoryItem> items)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.PageColor(Colors.White);
                page.Margin(20);

                page.Header()
                    .Text("Inventory Details")
                    .FontSize(36)
                    .Bold()
                    .AlignCenter();

                page.Content()
                    .PaddingTop(25)
                    .Column(column =>
                    {
                        foreach (var item in items)
                        {
                            column.Item().Border(1).Padding(10).Column(card =>
                            {
                                card.Item().Text($"Type: {item.Type}");
                                card.Item().Text($"Identifier: {item.Identifier}");
                                card.Item().Text($"Comment: {item.Comment}");

                                if (item.User != null)
                                {
                                    card.Item().Text(
                                        $"Assigned to: {item.User.FirstName} {item.User.LastName}"
                                    );

                                    card.Item().Text(
                                        $"User identifier: {item.User.Identifier}"
                                    );
                                }
                                else
                                {
                                    card.Item().Text("Assigned to: N/A");
                                }
                                card.Item().Text($"Purchase Date: {(item.PurchaseDate.HasValue ? item.PurchaseDate.Value.ToShortDateString() : "N/A")}");
                            });
                            column.Item().PaddingBottom(10);
                        }
                    });
            });
        }).GeneratePdf();
    }
}