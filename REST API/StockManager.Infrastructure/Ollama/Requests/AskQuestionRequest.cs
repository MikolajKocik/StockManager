using System.ComponentModel.DataAnnotations;

namespace StockManager.Infrastructure.Ollama.Requests;

public class AskQuestionRequest
{
    [Required(ErrorMessage = "Question cant be a zero value.")]
    [MaxLength(1000, ErrorMessage = "Question is too long.")]
    public required string Question { get; set; }

    public Guid? ConversationId { get; set; }

    public string? CategoryFilter { get; set; }
}
