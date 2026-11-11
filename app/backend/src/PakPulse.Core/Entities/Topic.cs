namespace PakPulse.Core.Entities;

/// <summary>A subject being monitored. Table: topics.</summary>
public class Topic
{
    public long Id { get; set; }
    public required string Name { get; set; }

    /// <summary>Given to the AI so it can judge each post's stance.</summary>
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public List<TopicKeyword> Keywords { get; set; } = [];
    public List<TopicAccount> Accounts { get; set; } = [];
    public List<CollectionRound> CollectionRounds { get; set; } = [];
    public List<Post> Posts { get; set; } = [];
    public List<Narrative> Narratives { get; set; } = [];
    public List<Brief> Briefs { get; set; } = [];
}
