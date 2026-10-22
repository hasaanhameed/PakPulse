"use client";

import { useState } from "react";

import { PlatformIcon } from "@/components/PlatformIcon";
import { formatDateTime, formatNumber } from "@/lib/format";
import { ACCOUNT_CATEGORY_LABEL, LANGUAGE_LABEL, LANGUAGES, PLATFORM_LABEL, PLATFORMS } from "@/lib/labels";
import type { KeyAccount, Language, Platform, Topic } from "@/lib/types";
import styles from "./topic.module.css";

const KEYWORD_HINT: Record<Language, string> = {
  en: "e.g. fuel levy",
  ur: "مثلاً پیٹرول",
  ru: "e.g. petrol mehnga",
};

function KeywordColumn({
  language,
  words,
  onChange,
}: {
  language: Language;
  words: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const isUrdu = language === "ur";

  const add = () => {
    const w = draft.trim();
    if (w && !words.includes(w)) onChange([...words, w]);
    setDraft("");
  };

  return (
    <div className={styles.keywordColumn}>
      <h3 className={styles.columnTitle}>
        {LANGUAGE_LABEL[language]} <span className="muted tabular">{words.length}</span>
      </h3>
      <ul className={styles.keywords} dir={isUrdu ? "rtl" : undefined}>
        {words.map((w) => (
          <li key={w} className={styles.keyword} lang={isUrdu ? "ur" : undefined}>
            <span>{w}</span>
            <button
              type="button"
              className={styles.remove}
              aria-label={`Remove ${w}`}
              onClick={() => onChange(words.filter((x) => x !== w))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.addRow}>
        <input
          className="input"
          value={draft}
          dir={isUrdu ? "rtl" : undefined}
          lang={isUrdu ? "ur" : undefined}
          placeholder={KEYWORD_HINT[language]}
          aria-label={`Add ${LANGUAGE_LABEL[language]} keyword`}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className="btn" onClick={add} disabled={!draft.trim()}>
          Add
        </button>
      </div>
    </div>
  );
}

type CollectState = "idle" | "confirm" | "unavailable";

export function TopicForm({ topic }: { topic: Topic }) {
  const [name, setName] = useState(topic.name);
  const [description, setDescription] = useState(topic.description);
  const [keywords, setKeywords] = useState(topic.keywords);
  const [accounts, setAccounts] = useState<KeyAccount[]>(topic.accounts);
  const [newAccount, setNewAccount] = useState<KeyAccount>({ platform: "x", handle: "", category: "news" });
  const [saved, setSaved] = useState(false);
  const [collect, setCollect] = useState<CollectState>("idle");

  const keywordCount = LANGUAGES.reduce((a, l) => a + keywords[l].length, 0);
  const touch = () => setSaved(false);

  const addAccount = () => {
    const handle = newAccount.handle.trim();
    if (!handle) return;
    const normalised = handle.startsWith("@") ? handle : `@${handle}`;
    if (accounts.some((a) => a.platform === newAccount.platform && a.handle === normalised)) return;
    setAccounts([...accounts, { ...newAccount, handle: normalised }]);
    setNewAccount({ ...newAccount, handle: "" });
    touch();
  };

  return (
    <div className={styles.layout}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
        }}
      >
        <section className={`panel ${styles.section}`} aria-labelledby="details-title">
          <h2 id="details-title" className="section-title">
            Topic
          </h2>
          <label>
            <span className="field-label">Name</span>
            <input
              className="input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                touch();
              }}
              required
            />
          </label>
          <label>
            <span className="field-label">What analysts should know about it</span>
            <textarea
              className="textarea"
              rows={2}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                touch();
              }}
            />
          </label>
        </section>

        <section className={`panel ${styles.section}`} aria-labelledby="keywords-title">
          <div className={styles.sectionHead}>
            <h2 id="keywords-title" className="section-title">
              Keywords
            </h2>
            <p className="section-note">
              <span className="tabular">{keywordCount}</span> keywords. The prototype plan is about 10.
            </p>
          </div>
          <div className={styles.keywordGrid}>
            {LANGUAGES.map((l) => (
              <KeywordColumn
                key={l}
                language={l}
                words={keywords[l]}
                onChange={(next) => {
                  setKeywords({ ...keywords, [l]: next });
                  touch();
                }}
              />
            ))}
          </div>
        </section>

        <section className={`panel ${styles.section}`} aria-labelledby="accounts-title">
          <div className={styles.sectionHead}>
            <h2 id="accounts-title" className="section-title">
              Key accounts
            </h2>
            <p className="section-note">
              Official handles, news outlets and analysts whose posts are collected. Accounts are a
              collection source only. PakPulse reports on narratives, never on individual people.
            </p>
          </div>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Platform</th>
                  <th scope="col">Handle</th>
                  <th scope="col">Type</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={`${a.platform}${a.handle}`}>
                    <td>
                      <span className={styles.platform}>
                        <PlatformIcon platform={a.platform} />
                        {PLATFORM_LABEL[a.platform]}
                      </span>
                    </td>
                    <td className={styles.handle}>{a.handle}</td>
                    <td>{ACCOUNT_CATEGORY_LABEL[a.category]}</td>
                    <td className={styles.rowAction}>
                      <button
                        type="button"
                        className="btn btn-quiet"
                        onClick={() => {
                          setAccounts(accounts.filter((x) => x !== a));
                          touch();
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.accountAdd}>
            <label>
              <span className="field-label">Platform</span>
              <select
                className="select"
                value={newAccount.platform}
                onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value as Platform })}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_LABEL[p]}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.grow}>
              <span className="field-label">Handle</span>
              <input
                className="input"
                placeholder="@handle"
                value={newAccount.handle}
                onChange={(e) => setNewAccount({ ...newAccount, handle: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAccount();
                  }
                }}
              />
            </label>
            <label>
              <span className="field-label">Type</span>
              <select
                className="select"
                value={newAccount.category}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, category: e.target.value as KeyAccount["category"] })
                }
              >
                {(Object.keys(ACCOUNT_CATEGORY_LABEL) as KeyAccount["category"][]).map((c) => (
                  <option key={c} value={c}>
                    {ACCOUNT_CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="btn" onClick={addAccount} disabled={!newAccount.handle.trim()}>
              Add account
            </button>
          </div>
        </section>

        <div className={styles.saveBar}>
          <button type="submit" className="btn btn-primary">
            Save topic
          </button>
          <p className="section-note" role="status">
            {saved
              ? "Saved in this tab only. Saving for real needs the backend API."
              : "Changes are not saved yet."}
          </p>
        </div>
      </form>

      <aside className={`panel ${styles.collection}`} aria-labelledby="collection-title">
        <h2 id="collection-title" className="section-title">
          Collection
        </h2>
        <p className="section-note">
          The prototype collects in a few rounds, then reuses the saved data for every demo.
        </p>
        <ol className={styles.snapshots}>
          {topic.snapshots.map((s) => (
            <li key={s.id} className={styles.snapshot}>
              <div className={styles.snapshotHead}>
                <span className={styles.snapshotName}>{s.label}</span>
                <span className="tabular">{formatNumber(s.posts)} posts</span>
              </div>
              <p className="section-note tabular">
                {formatDateTime(s.collectedAt)} ·{" "}
                {PLATFORMS.map((p) => `${PLATFORM_LABEL[p]} ${formatNumber(s.byPlatform[p])}`).join(", ")}
              </p>
            </li>
          ))}
        </ol>

        {collect === "idle" && (
          <button type="button" className="btn" onClick={() => setCollect("confirm")}>
            Collect now
          </button>
        )}
        {collect === "confirm" && (
          <div className={styles.confirm}>
            <p>
              <strong>Run a new collection round?</strong> It uses paid data and AI credits. Demos should
              reuse the saved rounds instead.
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className="btn btn-primary" onClick={() => setCollect("unavailable")}>
                Yes, collect
              </button>
              <button type="button" className="btn btn-quiet" onClick={() => setCollect("idle")}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {collect === "unavailable" && (
          <div className={styles.error} role="alert">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className={styles.errorIcon}>
              <path d="M8 1.5 15 14H1L8 1.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M8 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="12" r="0.9" fill="currentColor" />
            </svg>
            <div>
              <p className={styles.errorTitle}>Collection did not start</p>
              <p>The backend API is not built yet, so nothing was collected and nothing was spent.</p>
              <button type="button" className="btn btn-quiet" onClick={() => setCollect("idle")}>
                Dismiss
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
