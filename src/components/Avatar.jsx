/**
 * Avatar displays the first character of a username, uppercased, inside a
 * circular badge. It never renders a photo — per spec, the profile avatar
 * is always derived dynamically from the logged-in user's name.
 */
export default function Avatar({ username = "", size = "md", className = "" }) {
  const initial = username?.trim()?.charAt(0)?.toUpperCase() || "?";

  const sizes = {
    sm: "w-8 h-8 text-body-sm",
    md: "w-10 h-10 text-body-md",
    lg: "w-16 h-16 text-headline-sm",
    xl: "w-24 h-24 text-headline-md",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary text-on-primary font-display font-medium select-none shrink-0 ${sizes[size]} ${className}`}
      aria-label={username ? `${username}'s profile` : "Profile"}
      title={username || "Profile"}
    >
      {initial}
    </div>
  );
}
