using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class TopicKeywordConfiguration : IEntityTypeConfiguration<TopicKeyword>
{
    public void Configure(EntityTypeBuilder<TopicKeyword> builder)
    {
        builder.ToTable("topic_keywords");

        builder.Property(k => k.CreatedAt).HasDefaultValueSql("now()");
    }
}
