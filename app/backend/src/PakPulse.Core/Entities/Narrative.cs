namespace PakPulse.Core.Entities;

/// <summary>A group of posts telling the same story, with its size and growth. Table: narratives.</summary>
public class Narrative
{
    public long Id { get; set; }
    public long TopicId { get; set; }
    public long? PipelineRunId { get; set; }
    public required string Title { get; set; }
    public string? Summary { get; set; }
    public int PostCount { get; set; }

    /// <summary>The narrative's share of posts in the latest round.</summary>
    public float? ShareLatestRound { get; set; }

    /// <summary>The narrative's share of posts in the round before.</summary>
    public float? SharePreviousRound { get; set; }

    public float? GrowthScore { get; set; }
    public bool IsEmerging { get; set; }
    public DateTime CreatedAt { get; set; }

    public Topic Topic { get; set; } = null!;
    public PipelineRun? PipelineRun { get; set; }
    public List<NarrativePost> NarrativePosts { get; set; } = [];
}
