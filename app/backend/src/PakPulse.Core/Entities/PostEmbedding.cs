namespace PakPulse.Core.Entities;

/// <summary>A post's meaning as a list of numbers, used to find similar posts. One per post. Table: post_embeddings.</summary>
public class PostEmbedding
{
    /// <summary>Also the key: each post has at most one embedding.</summary>
    public long PostId { get; set; }

    /// <summary>The embedding model that made the vector.</summary>
    public required string Model { get; set; }

    /// <summary>Stored as a pgvector vector. Its length depends on the model.</summary>
    public required float[] Embedding { get; set; }

    public DateTime CreatedAt { get; set; }

    public Post Post { get; set; } = null!;
}
