
export default function Select({
  id,
  name,
  label,
  value,
  onChange,
  children,
  error,
  hint,
  ...props
}) {
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

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className="w-full rounded-xl bg-surface-container-lowest text-on-surface border border-surface-container-highest px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      >
        {children}
      </select>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-body-sm text-error"
        >
          {error}
        </p>
      )}

      {!error && hint && (
        <p
          id={`${id}-hint`}
          className="mt-2 text-body-sm text-on-surface-variant"
        >
          {hint}
        </p>
      )}
    </div>
  );
}


