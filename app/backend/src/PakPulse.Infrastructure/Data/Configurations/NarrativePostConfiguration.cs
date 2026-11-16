using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class NarrativePostConfiguration : IEntityTypeConfiguration<NarrativePost>
{
    public void Configure(EntityTypeBuilder<NarrativePost> builder)
    {
        builder.ToTable("narrative_posts");

        builder.HasKey(np => new { np.NarrativeId, np.PostId });
    }
}
