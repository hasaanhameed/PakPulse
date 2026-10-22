/** Sidebar icons. Drawn for PakPulse on one 24px grid with a 1.8 stroke, in the current text color. */
const PATHS = {
  overview: <path d="M3 13h4l3-8 4 14 3-6h4" />,
  narratives: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <path d="M8.5 6.5 15.5 11M8.5 17.5l7-4.5" />
    </>
  ),
  posts: <path d="M4 6h16M4 12h16M4 18h10" />,
  brief: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M9 11h7M9 15h7" />
    </>
  ),
  review: (
    <>
      <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  topic: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
};

export type NavIconName = keyof typeof PATHS;

export function NavIcon({ name }: { name: NavIconName }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
