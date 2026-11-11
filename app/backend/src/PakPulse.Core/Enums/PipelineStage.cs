namespace PakPulse.Core.Enums;

/// <summary>Which processing step a pipeline run did.</summary>
public enum PipelineStage
{
    Collect,
    Normalise,
    Clean,
    LanguageTag,
    Label,
    Embed,
    Narratives,
    Brief
}
