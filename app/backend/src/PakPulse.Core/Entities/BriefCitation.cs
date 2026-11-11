namespace PakPulse.Core.Entities;

/// <summary>A post that a brief uses as evidence. Key: BriefId + PostId. Table: brief_citations.</summary>
public class BriefCitation
{
    public long BriefId { get; set; }
    public long PostId { get; set; }

    public Brief Brief { get; set; } = null!;
    public Post Post { get; set; } = null!;
}
