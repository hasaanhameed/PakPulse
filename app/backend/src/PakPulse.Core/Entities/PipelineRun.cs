using PakPulse.Core.Enums;

namespace PakPulse.Core.Entities;

/// <summary>A log entry for one processing step (collect, clean, label...) and how it went. Table: pipeline_runs.</summary>
public class PipelineRun
{
    public long Id { get; set; }
    public long? TopicId { get; set; }
    public long? CollectionRoundId { get; set; }
    public PipelineStage Stage { get; set; }
    public PipelineStatus Status { get; set; } = PipelineStatus.Running;

    /// <summary>True for a small trial run (about 100 posts).</summary>
    public bool IsTestRun { get; set; }

    public int? ItemsIn { get; set; }
    public int? ItemsOut { get; set; }
    public string? Error { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }

    public Topic? Topic { get; set; }
    public CollectionRound? CollectionRound { get; set; }
    public List<SpendEntry> SpendEntries { get; set; } = [];
}
