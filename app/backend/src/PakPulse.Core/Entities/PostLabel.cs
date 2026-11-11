using PakPulse.Core.Enums;

namespace PakPulse.Core.Entities;

/// <summary>
/// Mood, emotion, stance and sarcasm labels for a post, from the AI or a human. Table: post_labels.
/// A human correction adds a new label and keeps the AI one. Only one label per post is current.
/// Every confidence and probability is between 0 and 1.
/// </summary>
public class PostLabel
{
    public long Id { get; set; }
    public long PostId { get; set; }
    public long? PipelineRunId { get; set; }

    public Sentiment? Sentiment { get; set; }
    public float? SentimentConfidence { get; set; }

    public Emotion? Emotion { get; set; }
    public float? EmotionConfidence { get; set; }

    public Stance? Stance { get; set; }
    public float? StanceConfidence { get; set; }

    public float? SarcasmProbability { get; set; }
    public float? SarcasmConfidence { get; set; }

    public Language? LanguageDetected { get; set; }

    /// <summary>A short reason for the labels, shown in the review queue.</summary>
    public string? Rationale { get; set; }

    public LabelSource Source { get; set; }

    /// <summary>The AI model that made the label. Null for human labels.</summary>
    public string? Model { get; set; }

    public string? PromptVersion { get; set; }
    public bool IsCurrent { get; set; } = true;
    public DateTime CreatedAt { get; set; }

    public Post Post { get; set; } = null!;
    public PipelineRun? PipelineRun { get; set; }
}
