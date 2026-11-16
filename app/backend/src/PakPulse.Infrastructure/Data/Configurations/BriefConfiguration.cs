using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class BriefConfiguration : IEntityTypeConfiguration<Brief>
{
    public void Configure(EntityTypeBuilder<Brief> builder)
    {
        builder.ToTable("briefs");

        builder.Property(b => b.CreatedAt).HasDefaultValueSql("now()");

        builder.HasOne(b => b.PipelineRun).WithMany().OnDelete(DeleteBehavior.SetNull);
    }
}
