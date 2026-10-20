import type { Emotion, KeyAccount, Language, Platform, Sentiment, Stance } from "./types";

// Display names and color tokens for every label value.
// Colors are CSS variable names from globals.css (see DESIGN.md -> Color palette).

export const STANCES: Stance[] = ["supportive", "neutral", "critical"];
export const SENTIMENTS: Sentiment[] = ["positive", "neutral", "negative"];
export const EMOTIONS: Emotion[] = ["anger", "worry", "disappointment", "humour", "hope", "none"];
export const LANGUAGES: Language[] = ["en", "ur", "ru"];
export const PLATFORMS: Platform[] = ["x", "instagram", "threads"];

export const STANCE_META: Record<Stance, { label: string; token: string }> = {
  supportive: { label: "Supportive", token: "--indus" },
  neutral: { label: "Neutral", token: "--stone" },
  critical: { label: "Critical", token: "--kiln" },
};

export const SENTIMENT_META: Record<Sentiment, { label: string; token: string }> = {
  positive: { label: "Positive", token: "--haldi" },
  neutral: { label: "Neutral", token: "--stone" },
  negative: { label: "Negative", token: "--jamun" },
};

export const EMOTION_LABEL: Record<Emotion, string> = {
  anger: "Anger",
  worry: "Worry",
  disappointment: "Disappointment",
  humour: "Humour",
  hope: "Hope",
  none: "No clear emotion",
};

export const LANGUAGE_LABEL: Record<Language, string> = {
  en: "English",
  ur: "Urdu",
  ru: "Roman Urdu",
};

/** Short tag shown on posts. Urdu is written in its own script. */
export const LANGUAGE_TAG: Record<Language, string> = {
  en: "EN",
  ur: "اردو",
  ru: "Roman Urdu",
};

export const PLATFORM_LABEL: Record<Platform, string> = {
  x: "X",
  instagram: "Instagram",
  threads: "Threads",
};

export const ACCOUNT_CATEGORY_LABEL: Record<KeyAccount["category"], string> = {
  official: "Official",
  news: "News outlet",
  analyst: "Analyst",
  commentator: "Commentator",
};

export const cssVar = (token: string) => `var(${token})`;
