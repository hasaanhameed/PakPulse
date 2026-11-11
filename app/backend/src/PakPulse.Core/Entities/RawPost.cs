using PakPulse.Core.Enums;

namespace PakPulse.Core.Entities;

/// <summary>A post exactly as the scraper or API returned it, one row per post per round. Never edited. Table: raw_posts.</summary>
public class RawPost
{
    public long Id { get; set; }
    public long CollectionRoundId { get; set; }
    public RawSource Source { get; set; }
    public Platform Platform { get; set; }

    /// <summary>The post's ID on its platform.</summary>
    public required string PlatformPostId { get; set; }

    /// <summary>The JSON as received. Stored as jsonb, which keeps the content but not the exact formatting.</summary>
    public required string Payload { get; set; }

    public DateTime FetchedAt { get; set; }

    public CollectionRound CollectionRound { get; set; } = null!;
}
