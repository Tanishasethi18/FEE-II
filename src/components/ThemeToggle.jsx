import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";

/** Round icon button that flips between light and dark mode. */
export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-on-surface overflow-hidden hover:bg-surface-container-low active:scale-95 transition-all duration-200 ${className}`}
    >
      <Icon name={isDark ? "light_mode" : "dark_mode"} size={22} />
    </button>
  );
}
