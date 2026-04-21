using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Infrastructure.Services;

public class PdfDocumentService : IPdfService
{
    public PdfDocumentService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public Task<Stream> GenerateOperationDocumentAsync(WarehouseOperation operation, List<(string ProductName, decimal Quantity)> items)
    {
        var stream = new MemoryStream();

        QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12));

                page.Header().Text($"{operation.Type} Document - {operation.Id}")
                    .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                page.Content().PaddingVertical(1, Unit.Centimetre).Column(x =>
                {
                    x.Spacing(20);

                    x.Item().Text($"Date: {operation.Date:yyyy-MM-dd}");
                    x.Item().Text($"Description: {operation.Description}");

                    x.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.ConstantColumn(100);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Element(CellStyle).Text("Product Name");
                            header.Cell().Element(CellStyle).Text("Quantity");

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                            }
                        });

                        foreach (var item in items)
                        {
                            table.Cell().Element(CellStyle).Text(item.ProductName);
                            table.Cell().Element(CellStyle).Text(item.Quantity.ToString());

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.PaddingVertical(5);
                            }
                        }
                    });
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Page ");
                    x.CurrentPageNumber();
                });
            });
        }).GeneratePdf(stream);

        stream.Position = 0;
        return Task.FromResult<Stream>(stream);
    }
}
