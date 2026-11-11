namespace PakPulse.Core.Entities;

/// <summary>A post's engagement numbers in one collection round, used to spot fast growth. Key: PostId + CollectionRoundId. Table: post_metrics.</summary>
public class PostMetric
{
    public long PostId { get; set; }
    public long CollectionRoundId { get; set; }
    public long Likes { get; set; }
    public long Reposts { get; set; }
    public long Replies { get; set; }
    public long Quotes { get; set; }
    public long? Views { get; set; }
    public DateTime RecordedAt { get; set; }

    public Post Post { get; set; } = null!;
    public CollectionRound CollectionRound { get; set; } = null!;
}
