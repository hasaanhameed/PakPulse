namespace PakPulse.Core.Entities;

/// <summary>Links a post to a narrative it belongs to. Key: NarrativeId + PostId. Table: narrative_posts.</summary>
public class NarrativePost
{
    public long NarrativeId { get; set; }
    public long PostId { get; set; }

    /// <summary>How close the post is to the narrative.</summary>
    public float? Similarity { get; set; }

    /// <summary>True for the posts shown as examples of the narrative.</summary>
    public bool IsRepresentative { get; set; }

    public Narrative Narrative { get; set; } = null!;
    public Post Post { get; set; } = null!;
}
