using PakPulse.Core.Enums;

namespace PakPulse.Core.Entities;

/// <summary>The estimated cost of one paid service call, checked against the spending caps. Table: spend_entries.</summary>
public class SpendEntry
{
    public long Id { get; set; }
    public long? PipelineRunId { get; set; }
    public SpendService Service { get; set; }

    /// <summary>How many units were used, e.g. 100.</summary>
    public int Units { get; set; }

    /// <summary>What a unit is, e.g. "posts" or "tokens".</summary>
    public required string UnitType { get; set; }

    /// <summary>Cost in US dollars, which is what the services bill in.</summary>
    public decimal CostUsd { get; set; }

    /// <summary>The exchange rate used, so the dashboard can show rupees.</summary>
    public decimal UsdToPkrRate { get; set; }

    public DateTime CreatedAt { get; set; }

    public PipelineRun? PipelineRun { get; set; }
}
