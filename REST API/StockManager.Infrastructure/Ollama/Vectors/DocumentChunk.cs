using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Pgvector;

namespace StockManager.Infrastructure.Ollama.Vectors;

public class DocumentChunk
{
    public int Id { get; set; }
    public int SourceDocumentId { get; set; }
    public string Content { get; set; }

    public Vector Embedding { get; set; }
}
