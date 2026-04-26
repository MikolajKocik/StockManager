using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockManager.Infrastructure.Ollama.Vectors;

namespace StockManager.Infrastructure.Persistence.Data;

public sealed class VectorDbContext : DbContext
{
    public VectorDbContext(DbContextOptions<VectorDbContext> options) : base(options)
    {
    }

    public DbSet<DocumentChunk> DocumentChunks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("StockManager_Embeddings");
        modelBuilder.HasPostgresExtension("vector");

        modelBuilder.Entity<DocumentChunk>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.HasIndex(d => d.SourceDocumentId);

            entity.Property(e => e.Embedding)
                .HasColumnType("vector(768)")
                .IsRequired();
        });
    }
}
