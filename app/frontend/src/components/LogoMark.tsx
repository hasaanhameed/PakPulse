/** The PakPulse mark: a heartbeat line that runs in from the left and becomes the P. Draws in the current text color. */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 28h5l3-7 4 16 3.5-9H29a11 11 0 0 0 0-22H21v37"
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
