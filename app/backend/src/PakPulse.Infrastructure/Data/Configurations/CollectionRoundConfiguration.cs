using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class CollectionRoundConfiguration : IEntityTypeConfiguration<CollectionRound>
{
    public void Configure(EntityTypeBuilder<CollectionRound> builder)
    {
        builder.ToTable("collection_rounds");

        builder.Property(r => r.CreatedAt).HasDefaultValueSql("now()");
    }
}
