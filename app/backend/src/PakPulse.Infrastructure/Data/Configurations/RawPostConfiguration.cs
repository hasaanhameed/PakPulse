using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class RawPostConfiguration : IEntityTypeConfiguration<RawPost>
{
    public void Configure(EntityTypeBuilder<RawPost> builder)
    {
        builder.ToTable("raw_posts");

        builder.Property(r => r.Payload).HasColumnType("jsonb");
        builder.Property(r => r.FetchedAt).HasDefaultValueSql("now()");
    }
}
