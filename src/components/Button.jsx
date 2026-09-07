import { Link } from "react-router-dom";

const VARIANTS = {
  primary:
    "bg-primary text-on-primary hover:opacity-90 active:scale-[0.98]",
  secondary:
    "bg-transparent border border-primary text-primary hover:bg-surface-container-low active:scale-[0.98]",
  ghost:
    "bg-transparent text-on-surface hover:bg-surface-container-low active:scale-[0.98]",
};

const SIZES = {
  sm: "px-4 py-2 text-label-sm",
  md: "px-6 py-3 text-label-sm",
  lg: "px-8 py-4 text-body-md font-semibold",
};

/**
 * Button renders either a <button> or, when `to` is provided, a router
 * <Link> styled identically — so CTAs can navigate without losing the
 * shared visual language.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  className = "",
  disabled = false,
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-body transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
