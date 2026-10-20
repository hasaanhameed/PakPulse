// Shapes the dashboard expects from the backend API.
// The real common post format and API schema are still open (PROGRESS open question 10),
// so these types describe the mock data and will be aligned once the API is defined.

export type Platform = "x" | "instagram" | "threads";
/** `ru` is Roman Urdu (Urdu written in Latin script, often mixed with English). */
export type Language = "en" | "ur" | "ru";
export type Stance = "supportive" | "neutral" | "critical";
export type Sentiment = "positive" | "neutral" | "negative";
export type Emotion = "anger" | "worry" | "humour" | "disappointment" | "hope" | "none";

/** Every label carries a confidence score (D-013). */
export interface Scored<T> {
  value: T;
  confidence: number;
}

export interface PostLabels {
  stance: Scored<Stance>;
  sentiment: Scored<Sentiment>;
  emotion: Scored<Emotion>;
  sarcasm: Scored<boolean>;
}

export type LabelKey = keyof PostLabels;

export interface Post {
  id: string;
  platform: Platform;
  language: Language;
  text: string;
  postedAt: string;
  snapshotId: string;
  narrativeId: string | null;
  engagement: { likes: number; reposts: number; replies: number };
  /** Link to the original post. Null for mock posts. */
  sourceUrl: string | null;
  /** True when the labeller saw the parent post or thread as context. */
  usedContext: boolean;
  labels: PostLabels;
}

export type StanceCounts = Record<Stance, number>;

export interface Snapshot {
  id: string;
  label: string;
  collectedAt: string;
  windowStart: string;
  posts: number;
  byStance: StanceCounts;
  byPlatform: Record<Platform, number>;
}

export interface KeyAccount {
  platform: Platform;
  handle: string;
  category: "official" | "news" | "analyst" | "commentator";
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  keywords: Record<Language, string[]>;
  accounts: KeyAccount[];
  snapshots: Snapshot[];
}

export interface KeyTerm {
  text: string;
  language: Language;
}

export type NarrativeTrend = "emerging" | "growing" | "steady" | "fading";

export interface Narrative {
  id: string;
  title: string;
  summary: string;
  keyTerms: KeyTerm[];
  /** Post counts per snapshot, in snapshot order. */
  bySnapshot: number[];
  stance: StanceCounts;
  sarcasmShare: number;
  mainLanguages: Language[];
}

export interface NarrativeWithTrend extends Narrative {
  posts: number;
  change: number | null;
  trend: NarrativeTrend;
}

export interface VolumeBin {
  start: string;
  supportive: number;
  neutral: number;
  critical: number;
}

export interface Overview {
  totals: {
    posts: number;
    stance: StanceCounts;
    sentiment: Record<Sentiment, number>;
    emotion: Record<Emotion, number>;
    sarcasmLikely: number;
    reviewQueue: number;
  };
  stanceByLanguage: Record<Language, StanceCounts>;
  stanceByPlatform: Record<Platform, StanceCounts>;
  volume: VolumeBin[];
}

export interface BriefItem {
  text: string;
  /** Post IDs this claim rests on. Empty only for data notes. */
  cites: string[];
}

export interface BriefSection {
  heading: string;
  items: BriefItem[];
}

export interface Brief {
  id: string;
  date: string;
  snapshotId: string;
  generatedAt: string;
  sections: BriefSection[];
}

export interface PostFilters {
  q?: string;
  stance?: Stance;
  sentiment?: Sentiment;
  emotion?: Emotion;
  language?: Language;
  platform?: Platform;
  sarcasm?: "likely" | "unlikely";
  confidence?: "low";
  narrative?: string;
  sort?: "newest" | "engagement" | "confidence";
  page?: number;
}
