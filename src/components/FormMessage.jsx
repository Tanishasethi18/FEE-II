import Icon from "./Icon";

const TONES = {
  error: "bg-error-container text-on-error-container",
  success: "bg-tertiary-fixed text-on-tertiary-fixed",
  info: "bg-surface-container-low text-on-surface",
};

/** Inline banner for form-level success / error / info messages. */
export default function FormMessage({ tone = "info", children, className = "" }) {
  if (!children) return null;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl px-4 py-3 font-body text-body-sm ${TONES[tone]} ${className}`}
    >
      <span className="w-5 h-5 overflow-hidden inline-flex items-center justify-center shrink-0">
        <Icon
          name={tone === "error" ? "error" : tone === "success" ? "check_circle" : "info"}
          size={18}
        />
      </span>
      <span>{children}</span>
    </div>
  );
}
