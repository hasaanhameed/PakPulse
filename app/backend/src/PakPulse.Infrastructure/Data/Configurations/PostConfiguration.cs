using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.ToTable("posts");

        builder.Property(p => p.CreatedAt).HasDefaultValueSql("now()");
        builder.Property(p => p.UpdatedAt).HasDefaultValueSql("now()");

        // These links are optional and become null if the round or raw post is deleted.
        builder.HasOne(p => p.FirstSeenRound).WithMany().OnDelete(DeleteBehavior.SetNull);
        builder.HasOne(p => p.LastSeenRound).WithMany().OnDelete(DeleteBehavior.SetNull);
        builder.HasOne(p => p.LatestRawPost).WithMany().OnDelete(DeleteBehavior.SetNull);
    }
}
