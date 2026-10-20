-- PakPulse 003: switch the emotion list to the dashboard's set
-- Applied to Supabase on 2026-10-20. Matches Emotion in app/frontend/src/lib/types.ts.

alter table pakpulse.post_labels drop constraint if exists post_labels_emotion_check;
alter table pakpulse.post_labels add constraint post_labels_emotion_check
  check (emotion in ('anger','worry','humour','disappointment','hope','none'));
