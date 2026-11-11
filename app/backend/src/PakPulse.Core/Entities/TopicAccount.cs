using PakPulse.Core.Enums;

namespace PakPulse.Core.Entities;

/// <summary>A key account to collect posts from. Used as a collection list only, never to profile anyone. Table: topic_accounts.</summary>
public class TopicAccount
{
    public long Id { get; set; }
    public long TopicId { get; set; }
    public Platform Platform { get; set; }
    public required string Handle { get; set; }
    public AccountCategory? Category { get; set; }
    public DateTime CreatedAt { get; set; }

    public Topic Topic { get; set; } = null!;
}
