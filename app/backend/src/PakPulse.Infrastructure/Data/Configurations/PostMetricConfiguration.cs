using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class PostMetricConfiguration : IEntityTypeConfiguration<PostMetric>
{
    public void Configure(EntityTypeBuilder<PostMetric> builder)
    {
        builder.ToTable("post_metrics");

        // One row per post per round, so the key is both columns together.
        builder.HasKey(m => new { m.PostId, m.CollectionRoundId });

        builder.Property(m => m.RecordedAt).HasDefaultValueSql("now()");
    }
}
