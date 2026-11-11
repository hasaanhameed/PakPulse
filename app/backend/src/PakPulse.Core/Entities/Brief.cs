namespace PakPulse.Core.Entities;

/// <summary>The AI-written daily summary for a topic. Table: briefs.</summary>
public class Brief
{
    public long Id { get; set; }
    public long TopicId { get; set; }
    public long? PipelineRunId { get; set; }
    public DateOnly BriefDate { get; set; }

    /// <summary>The AI model that wrote the brief.</summary>
    public string? Model { get; set; }

    public required string ContentMarkdown { get; set; }
    public DateTime CreatedAt { get; set; }

    public Topic Topic { get; set; } = null!;
    public PipelineRun? PipelineRun { get; set; }
    public List<BriefCitation> Citations { get; set; } = [];
}
