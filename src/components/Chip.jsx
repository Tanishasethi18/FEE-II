const TONES = {
  sage: "bg-tertiary-fixed text-on-tertiary-fixed",
  error: "bg-error text-on-error",
  neutral: "bg-surface text-on-surface",
};

export default function Chip({ children, tone = "sage", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm font-body bg-opacity-90 backdrop-blur-sm ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
