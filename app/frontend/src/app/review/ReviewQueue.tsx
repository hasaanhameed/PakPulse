"use client";

import { useMemo, useState } from "react";

import { PostMeta, PostText } from "@/components/PostCard";
import { REVIEW_THRESHOLD } from "@/lib/config";
import { formatConfidence } from "@/lib/format";
import {
  cssVar,
  EMOTION_LABEL,
  EMOTIONS,
  PLATFORM_LABEL,
  SENTIMENT_META,
  SENTIMENTS,
  STANCE_META,
  STANCES,
} from "@/lib/labels";
import { lowestConfidence } from "@/lib/post-utils";
import type { Emotion, LabelKey, Post, Sentiment, Stance } from "@/lib/types";
import styles from "./review.module.css";

type Values = { stance: Stance; sentiment: Sentiment; emotion: Emotion; sarcasm: boolean };
type Outcome = { status: "confirmed" | "corrected" | "skipped"; values: Values };

const LABEL_NAME: Record<LabelKey, string> = {
  stance: "Stance",
  sentiment: "Mood",
  emotion: "Emotion",
  sarcasm: "Sarcasm",
};

function modelValues(post: Post): Values {
  return {
    stance: post.labels.stance.value,
    sentiment: post.labels.sentiment.value,
    emotion: post.labels.emotion.value,
    sarcasm: post.labels.sarcasm.value,
  };
}

function weakestLabel(post: Post): { key: LabelKey; confidence: number } {
  const entries = Object.entries(post.labels) as [LabelKey, { confidence: number }][];
  const [key, label] = entries.reduce((a, b) => (b[1].confidence < a[1].confidence ? b : a));
  return { key, confidence: label.confidence };
}

const STATUS_TEXT: Record<Outcome["status"], string> = {
  confirmed: "Confirmed",
  corrected: "Corrected",
  skipped: "Skipped",
};

interface Option<T> {
  value: T;
  label: string;
  token?: string;
}

function OptionGroup<T extends string | boolean>({
  name,
  options,
  value,
  modelValue,
  onChange,
}: {
  name: string;
  options: Option<T>[];
  value: T;
  modelValue: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className={styles.options} role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <label key={String(o.value)} className={styles.option} data-checked={o.value === value || undefined}>
          <input
            type="radio"
            name={name}
            checked={o.value === value}
            onChange={() => onChange(o.value)}
            className="visually-hidden"
          />
          {o.token && <span className={styles.swatch} style={{ background: cssVar(o.token) }} />}
          {o.label}
          {o.value === modelValue && <span className={styles.modelMark}>AI</span>}
        </label>
      ))}
    </div>
  );
}

export function ReviewQueue({ posts, initialId }: { posts: Post[]; initialId?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(
    posts.find((p) => p.id === initialId)?.id ?? posts[0]?.id ?? null,
  );
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>({});
  const [drafts, setDrafts] = useState<Record<string, Values>>({});

  const selected = posts.find((p) => p.id === selectedId) ?? null;
  const done = Object.keys(outcomes).length;
  const draft = selected ? drafts[selected.id] ?? outcomes[selected.id]?.values ?? modelValues(selected) : null;
  const changed = useMemo(() => {
    if (!selected || !draft) return false;
    const m = modelValues(selected);
    return (Object.keys(m) as LabelKey[]).some((k) => m[k] !== draft[k]);
  }, [selected, draft]);

  if (!posts.length || !selected || !draft) {
    return (
      <div className={styles.emptyQueue}>
        <p className={styles.emptyTitle}>Nothing to review.</p>
        <p className="muted">Every label is at or above the confidence threshold.</p>
      </div>
    );
  }

  const setValue = <K extends keyof Values>(key: K, v: Values[K]) =>
    setDrafts((d) => ({ ...d, [selected.id]: { ...draft, [key]: v } }));

  const goNext = () => {
    const start = posts.findIndex((p) => p.id === selected.id);
    const next =
      posts.slice(start + 1).find((p) => !outcomes[p.id] && p.id !== selected.id) ??
      posts.find((p) => !outcomes[p.id] && p.id !== selected.id);
    if (next) setSelectedId(next.id);
  };

  const record = (status: Outcome["status"]) => {
    setOutcomes((o) => ({ ...o, [selected.id]: { status, values: draft } }));
    goNext();
  };

  const rows: { key: LabelKey; control: React.ReactNode }[] = [
    {
      key: "stance",
      control: (
        <OptionGroup
          name="Stance"
          value={draft.stance}
          modelValue={selected.labels.stance.value}
          onChange={(v) => setValue("stance", v)}
          options={STANCES.map((s) => ({ value: s, label: STANCE_META[s].label, token: STANCE_META[s].token }))}
        />
      ),
    },
    {
      key: "sentiment",
      control: (
        <OptionGroup
          name="Mood"
          value={draft.sentiment}
          modelValue={selected.labels.sentiment.value}
          onChange={(v) => setValue("sentiment", v)}
          options={SENTIMENTS.map((s) => ({ value: s, label: SENTIMENT_META[s].label, token: SENTIMENT_META[s].token }))}
        />
      ),
    },
    {
      key: "emotion",
      control: (
        <OptionGroup
          name="Emotion"
          value={draft.emotion}
          modelValue={selected.labels.emotion.value}
          onChange={(v) => setValue("emotion", v)}
          options={EMOTIONS.map((e) => ({ value: e, label: EMOTION_LABEL[e] }))}
        />
      ),
    },
    {
      key: "sarcasm",
      control: (
        <OptionGroup
          name="Sarcasm"
          value={draft.sarcasm}
          modelValue={selected.labels.sarcasm.value}
          onChange={(v) => setValue("sarcasm", v)}
          options={[
            { value: true, label: "Likely" },
            { value: false, label: "Not likely" },
          ]}
        />
      ),
    },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.queue} aria-label="Posts to review">
        <p className={styles.progress}>
          <span className="tabular">
            {done} of {posts.length}
          </span>{" "}
          mock posts reviewed in this session
        </p>
        <div className={styles.progressTrack} aria-hidden="true">
          <span style={{ width: `${(done / posts.length) * 100}%` }} />
        </div>
        <ul className={styles.items}>
          {posts.map((p) => {
            const weak = weakestLabel(p);
            const outcome = outcomes[p.id];
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={styles.item}
                  aria-current={p.id === selected.id || undefined}
                  onClick={() => setSelectedId(p.id)}
                >
                  <span className={styles.itemTop}>
                    <span>{PLATFORM_LABEL[p.platform]}</span>
                    <span className="tabular">
                      {LABEL_NAME[weak.key]} {formatConfidence(weak.confidence)}
                    </span>
                  </span>
                  <span
                    className={styles.itemText}
                    lang={p.language === "ur" ? "ur" : undefined}
                    dir={p.language === "ur" ? "rtl" : undefined}
                  >
                    {p.text}
                  </span>
                  {outcome && <span className={styles.status}>{STATUS_TEXT[outcome.status]}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className={`panel ${styles.detail}`} aria-label="Review this post">
        <div className={styles.postBlock}>
          <PostMeta post={selected} />
          <PostText post={selected} className={styles.postText} />
          {selected.usedContext && <p className="section-note">The labeller used the parent post as context.</p>}
        </div>

        <div className={styles.labelRows}>
          {rows.map(({ key, control }) => {
            const confidence = selected.labels[key].confidence;
            const low = confidence < REVIEW_THRESHOLD;
            return (
              <div key={key} className={styles.labelRow}>
                <div className={styles.labelHead}>
                  <span className={styles.labelName}>{LABEL_NAME[key]}</span>
                  <span className={`${styles.labelScore} tabular`} data-low={low || undefined}>
                    AI confidence {formatConfidence(confidence)}
                  </span>
                </div>
                {control}
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn btn-primary" onClick={() => record(changed ? "corrected" : "confirmed")}>
            {changed ? "Save correction" : "Confirm AI labels"}
          </button>
          {changed && (
            <button
              type="button"
              className="btn"
              onClick={() => setDrafts((d) => ({ ...d, [selected.id]: modelValues(selected) }))}
            >
              Reset to AI labels
            </button>
          )}
          <button type="button" className="btn btn-quiet" onClick={() => record("skipped")}>
            Skip for now
          </button>
          <p className={styles.saveNote}>
            Lowest score on this post: {formatConfidence(lowestConfidence(selected))}. Decisions stay in this
            tab until the backend can store them.
          </p>
        </div>
      </section>
    </div>
  );
}
