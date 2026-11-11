using PakPulse.Core.Enums;

namespace PakPulse.Core.Entities;

/// <summary>A search term for a topic. Table: topic_keywords.</summary>
public class TopicKeyword
{
    public long Id { get; set; }
    public long TopicId { get; set; }
    public required string Keyword { get; set; }

    /// <summary>Only En, Ur or RomanUr are allowed here.</summary>
    public Language Language { get; set; }

    public DateTime CreatedAt { get; set; }

    public Topic Topic { get; set; } = null!;
}
