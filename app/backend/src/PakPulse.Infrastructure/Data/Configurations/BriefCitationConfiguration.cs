using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PakPulse.Core.Entities;

namespace PakPulse.Infrastructure.Data.Configurations;

public class BriefCitationConfiguration : IEntityTypeConfiguration<BriefCitation>
{
    public void Configure(EntityTypeBuilder<BriefCitation> builder)
    {
        builder.ToTable("brief_citations");

        builder.HasKey(c => new { c.BriefId, c.PostId });
    }
}
