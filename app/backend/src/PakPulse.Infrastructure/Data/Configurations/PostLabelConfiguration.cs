using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class PostLabelConfiguration : IEntityTypeConfiguration<PostLabel>
{
    public void Configure(EntityTypeBuilder<PostLabel> builder)
    {
        builder.ToTable("post_labels");

        builder.Property(l => l.CreatedAt).HasDefaultValueSql("now()");

        builder.HasOne(l => l.PipelineRun).WithMany().OnDelete(DeleteBehavior.SetNull);
    }
}
