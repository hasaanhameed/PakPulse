using PakPulse.Core.Enums;

namespace PakPulse.Core.Entities;

/// <summary>One real post, stored once and cleaned into a common format for every platform. Table: posts.</summary>
public class Post
{
    public long Id { get; set; }
    public long TopicId { get; set; }
    public Platform Platform { get; set; }

    /// <summary>The post's ID on its platform. Unique together with TopicId and Platform, so a post is never stored twice.</summary>
    public required string PlatformPostId { get; set; }

    public string? Url { get; set; }
    public DateTime? PostedAt { get; set; }

    // Text. Defaults to "" like the database, because some posts are media only.
    public string Text { get; set; } = "";
    public string? TextNormalised { get; set; }

    /// <summary>Used to spot near-duplicate posts.</summary>
    public string? TextHash { get; set; }

    public Language? Language { get; set; }

    // Author: kept only to show evidence and weight reach
    public string? AuthorPlatformId { get; set; }
    public string? AuthorHandle { get; set; }
    public string? AuthorDisplayName { get; set; }
    public long? AuthorFollowers { get; set; }

    // Replies and quotes
    public string? ParentPlatformPostId { get; set; }

    /// <summary>The text of the post being replied to or quoted, given to the AI as context.</summary>
    public string? ParentText { get; set; }

    public bool IsReply { get; set; }
    public bool IsQuote { get; set; }

    public List<string> Hashtags { get; set; } = [];
    public List<string> Mentions { get; set; } = [];

    /// <summary>Links only. Photos and videos are never downloaded.</summary>
    public List<string> MediaUrls { get; set; } = [];

    // Engagement from the latest round. Each round's numbers are in PostMetric.
    public long Likes { get; set; }
    public long Reposts { get; set; }
    public long Replies { get; set; }
    public long Quotes { get; set; }
    public long? Views { get; set; }

    // Cleaning
    public PostStatus Status { get; set; } = PostStatus.New;
    public string? DropReason { get; set; }

    public long? FirstSeenRoundId { get; set; }
    public long? LastSeenRoundId { get; set; }
    public long? LatestRawPostId { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Topic Topic { get; set; } = null!;
    public CollectionRound? FirstSeenRound { get; set; }
    public CollectionRound? LastSeenRound { get; set; }
    public RawPost? LatestRawPost { get; set; }
    public PostEmbedding? Embedding { get; set; }
    public List<PostMetric> Metrics { get; set; } = [];
    public List<PostLabel> Labels { get; set; } = [];
}
