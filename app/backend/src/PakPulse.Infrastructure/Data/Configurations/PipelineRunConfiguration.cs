using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class PipelineRunConfiguration : IEntityTypeConfiguration<PipelineRun>
{
    public void Configure(EntityTypeBuilder<PipelineRun> builder)
    {
        builder.ToTable("pipeline_runs");

        builder.Property(r => r.StartedAt).HasDefaultValueSql("now()");

        // The topic link is optional, but deleting a topic still deletes its runs.
        builder.HasOne(r => r.Topic).WithMany().OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(r => r.CollectionRound).WithMany().OnDelete(DeleteBehavior.SetNull);
    }
}
