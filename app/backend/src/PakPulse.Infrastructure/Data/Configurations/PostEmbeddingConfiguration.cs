using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pgvector;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class PostEmbeddingConfiguration : IEntityTypeConfiguration<PostEmbedding>
{
    public void Configure(EntityTypeBuilder<PostEmbedding> builder)
    {
        builder.ToTable("post_embeddings");

        // The post's ID is also this table's key: one embedding per post.
        builder.HasKey(e => e.PostId);
        builder.HasOne(e => e.Post)
            .WithOne(p => p.Embedding)
            .HasForeignKey<PostEmbedding>(e => e.PostId);

        // Core keeps a plain float[]; the Pgvector library sends it to the database's vector column as its own Vector type.
        // The comparer tells EF to compare the numbers, not just whether it is the same array.
        builder.Property(e => e.Embedding)
            .HasColumnType("vector")
            .HasConversion(
                values => new Vector(values),
                vector => vector.ToArray(),
                new ValueComparer<float[]>(
                    (a, b) => a.SequenceEqual(b),
                    a => a.Aggregate(0, (hash, value) => HashCode.Combine(hash, value)),
                    a => a.ToArray()));

        builder.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
    }
}
