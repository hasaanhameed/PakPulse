namespace PakPulse.Core.Enums;

/// <summary>How a pipeline run ended, or that it is still running.</summary>
public enum PipelineStatus
{
    Running,
    Succeeded,
    Failed,
    StoppedBudget
}
