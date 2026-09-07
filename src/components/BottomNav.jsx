import { NavLink } from "react-router-dom";
import Icon from "./Icon";

const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: "stacks" },
  { to: "/classes", label: "Classes", icon: "fitness_center" },
  { to: "/schedule", label: "Schedule", icon: "calendar_today" },
  { to: "/bookings", label: "Bookings", icon: "event_available" },
  { to: "/profile", label: "Profile", icon: "person_outline" },
];

export default function BottomNav() {
  return (
    <nav
      className="bg-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-safe h-20 md:hidden border-t border-surface-container-highest shadow-nav-top"
      aria-label="Primary"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-opacity w-16 ${
              isActive
                ? "text-primary font-semibold"
                : "text-on-secondary-container/60 hover:opacity-80"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon name={item.icon} filled={isActive} />
              <span className="font-body text-label-sm">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
