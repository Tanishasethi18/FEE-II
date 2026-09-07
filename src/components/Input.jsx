import { forwardRef } from "react";

/**
 * Input follows the design system's field style: soft-gray background,
 * no border, deep-charcoal text, muted placeholder.
 */
const Input = forwardRef(function Input(
  { label, id, error, className = "", ...rest },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block font-body text-label-sm text-on-surface-variant mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-4 py-4 focus:outline-none focus:ring-1 focus:ring-outline placeholder:text-outline-variant transition-all border-none ${className}`}
        {...rest}
      />
      {error && (
        <p className="mt-2 text-body-sm text-error font-body">{error}</p>
      )}
    </div>
  );
});

export default Input;
