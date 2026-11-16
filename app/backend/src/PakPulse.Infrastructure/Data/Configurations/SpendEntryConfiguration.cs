using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class SpendEntryConfiguration : IEntityTypeConfiguration<SpendEntry>
{
    public void Configure(EntityTypeBuilder<SpendEntry> builder)
    {
        builder.ToTable("spend_entries");

        builder.Property(s => s.CostUsd).HasPrecision(10, 4);
        builder.Property(s => s.UsdToPkrRate).HasPrecision(8, 2);
        builder.Property(s => s.CreatedAt).HasDefaultValueSql("now()");

        builder.HasOne(s => s.PipelineRun)
            .WithMany(r => r.SpendEntries)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
