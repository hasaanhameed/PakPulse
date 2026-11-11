using PakPulse.Core.Enums;

namespace PakPulse.Core.Entities;

/// <summary>One round of collecting posts for a topic (round 1, round 2...). Table: collection_rounds.</summary>
public class CollectionRound
{
    public long Id { get; set; }
    public long TopicId { get; set; }

    /// <summary>1, 2, 3... Unique within a topic.</summary>
    public int RoundNumber { get; set; }

    /// <summary>A display name, e.g. "Collection round 1".</summary>
    public required string Label { get; set; }

    public RoundStatus Status { get; set; } = RoundStatus.Planned;
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    public Topic Topic { get; set; } = null!;
    public List<RawPost> RawPosts { get; set; } = [];
}
