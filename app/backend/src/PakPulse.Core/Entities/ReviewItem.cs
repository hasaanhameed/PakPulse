using PakPulse.Core.Enums;

namespace PakPulse.Core.Entities;

/// <summary>A low-confidence label waiting for a human to check it. Table: review_items.</summary>
public class ReviewItem
{
    public long Id { get; set; }
    public long PostId { get; set; }
    public long LabelId { get; set; }

    /// <summary>Which fields had low confidence.</summary>
    public required string Reason { get; set; }

    public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }

    public Post Post { get; set; } = null!;
    public PostLabel Label { get; set; } = null!;
}
