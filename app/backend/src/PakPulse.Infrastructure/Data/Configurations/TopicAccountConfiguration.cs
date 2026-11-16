using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class TopicAccountConfiguration : IEntityTypeConfiguration<TopicAccount>
{
    public void Configure(EntityTypeBuilder<TopicAccount> builder)
    {
        builder.ToTable("topic_accounts");

        builder.Property(a => a.CreatedAt).HasDefaultValueSql("now()");
    }
}
