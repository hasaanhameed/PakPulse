using Microsoft.EntityFrameworkCore;
using PakPulse.Core.Entities;
using PakPulse.Core.Enums;
using PakPulse.Infrastructure.Data.Converters;

namespace PakPulse.Infrastructure.Data;

/// <summary>
/// The app's connection to the database: one DbSet per table.
/// The tables already exist (the SQL scripts in app/database/migrations are the master copy),
/// so this class only maps to them. It never creates or changes tables.
/// </summary>
public class PakPulseDbContext(DbContextOptions<PakPulseDbContext> options) : DbContext(options)
{
    // A. Topic setup
    public DbSet<Topic> Topics => Set<Topic>();
    public DbSet<TopicKeyword> TopicKeywords => Set<TopicKeyword>();
    public DbSet<TopicAccount> TopicAccounts => Set<TopicAccount>();

    // B. Collection
    public DbSet<CollectionRound> CollectionRounds => Set<CollectionRound>();
    public DbSet<RawPost> RawPosts => Set<RawPost>();

    // C. Cleaned posts
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<PostMetric> PostMetrics => Set<PostMetric>();

    // D. Analysis
    public DbSet<PostLabel> PostLabels => Set<PostLabel>();
    public DbSet<ReviewItem> ReviewItems => Set<ReviewItem>();
    public DbSet<PostEmbedding> PostEmbeddings => Set<PostEmbedding>();

    // E. Insights
    public DbSet<Narrative> Narratives => Set<Narrative>();
    public DbSet<NarrativePost> NarrativePosts => Set<NarrativePost>();
    public DbSet<Brief> Briefs => Set<Brief>();
    public DbSet<BriefCitation> BriefCitations => Set<BriefCitation>();

    // F. Operations
    public DbSet<PipelineRun> PipelineRuns => Set<PipelineRun>();
    public DbSet<SpendEntry> SpendEntries => Set<SpendEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("pakpulse");

        // Picks up every IEntityTypeConfiguration class in this project (they live in Data/Configurations).
        // Note: HasDefaultValueSql("now()") in those files is needed, not just documentation.
        // It makes EF leave the column out of an insert while it is unset, so the database fills in now().
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PakPulseDbContext).Assembly);
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        // Every enum is stored as snake_case text, e.g. Stance.OffTopic -> "off_topic".
        // Add every new enum here, or EF will try to save it as a number.
        configurationBuilder.Properties<Platform>().HaveConversion<SnakeCaseEnumConverter<Platform>>();
        configurationBuilder.Properties<Language>().HaveConversion<SnakeCaseEnumConverter<Language>>();
        configurationBuilder.Properties<AccountCategory>().HaveConversion<SnakeCaseEnumConverter<AccountCategory>>();
        configurationBuilder.Properties<RoundStatus>().HaveConversion<SnakeCaseEnumConverter<RoundStatus>>();
        configurationBuilder.Properties<RawSource>().HaveConversion<SnakeCaseEnumConverter<RawSource>>();
        configurationBuilder.Properties<PostStatus>().HaveConversion<SnakeCaseEnumConverter<PostStatus>>();
        configurationBuilder.Properties<Sentiment>().HaveConversion<SnakeCaseEnumConverter<Sentiment>>();
        configurationBuilder.Properties<Emotion>().HaveConversion<SnakeCaseEnumConverter<Emotion>>();
        configurationBuilder.Properties<Stance>().HaveConversion<SnakeCaseEnumConverter<Stance>>();
        configurationBuilder.Properties<LabelSource>().HaveConversion<SnakeCaseEnumConverter<LabelSource>>();
        configurationBuilder.Properties<ReviewStatus>().HaveConversion<SnakeCaseEnumConverter<ReviewStatus>>();
        configurationBuilder.Properties<PipelineStage>().HaveConversion<SnakeCaseEnumConverter<PipelineStage>>();
        configurationBuilder.Properties<PipelineStatus>().HaveConversion<SnakeCaseEnumConverter<PipelineStatus>>();
        configurationBuilder.Properties<SpendService>().HaveConversion<SnakeCaseEnumConverter<SpendService>>();
    }

    // Every SaveChanges / SaveChangesAsync call ends up in one of these two.
    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        SetUpdatedAt();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
    {
        SetUpdatedAt();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    // The database has no trigger for updated_at, so set it here on every edit.
    // Bulk ExecuteUpdate calls skip SaveChanges, so they must set UpdatedAt themselves.
    private void SetUpdatedAt()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<Topic>().Where(e => e.State == EntityState.Modified))
            entry.Entity.UpdatedAt = now;

        foreach (var entry in ChangeTracker.Entries<Post>().Where(e => e.State == EntityState.Modified))
            entry.Entity.UpdatedAt = now;
    }
}
