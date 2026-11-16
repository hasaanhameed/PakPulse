using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class NarrativeConfiguration : IEntityTypeConfiguration<Narrative>
{
    public void Configure(EntityTypeBuilder<Narrative> builder)
    {
        builder.ToTable("narratives");

        builder.Property(n => n.CreatedAt).HasDefaultValueSql("now()");

        builder.HasOne(n => n.PipelineRun).WithMany().OnDelete(DeleteBehavior.SetNull);
    }
}
