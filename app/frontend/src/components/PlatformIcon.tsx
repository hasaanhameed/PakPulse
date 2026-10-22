import type { Platform } from "@/lib/types";

/** Simple outline marks for each platform, drawn on the same grid as the nav icons. Not the official logos. */
const PATHS: Record<Platform, React.ReactNode> = {
  // X sits in a rounded square so it reads as a platform mark, not a close button.
  x: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  threads: <path d="M16.5 11.5c0-4-2-6-4.5-6S7 7.5 7 12s2.3 6.5 5.2 6.5c3.8 0 5.3-2.6 4.5-5-.7-2-4-2.3-5.2-1-1.3 1.5.2 3.6 2.3 3" />,
};

export function PlatformIcon({ platform, size = 14 }: { platform: Platform; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[platform]}
    </svg>
  );
}
