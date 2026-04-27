using System.ComponentModel.DataAnnotations;

namespace StockManager.Infrastructure.Ollama.Requests;

public sealed record AskQuestionRequest
{
    [Required(ErrorMessage = "Question cant be a zero value.")]
    [MaxLength(1000, ErrorMessage = "Question is too long.")]
    public required string Question { get; init; }

    public Guid? ConversationId { get; init; }

    public string? CategoryFilter { get; init; }
    public string? WarehouseFilter { get; init; }
}
