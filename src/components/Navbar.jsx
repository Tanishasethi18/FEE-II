import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import Avatar from "./Avatar";
import Button from "./Button";
import Icon from "./Icon";

const APP_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/classes", label: "Classes" },
  { to: "/schedule", label: "Schedule" },
  { to: "/bookings", label: "Bookings" },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { clearBookings } = useBookings();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    clearBookings();
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-container-highest">
      <div className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg h-20 flex items-center justify-between">
        <Link
          to={isAuthenticated ? "/home" : "/"}
          className="font-display text-headline-sm text-on-surface tracking-tight"
        >
          Aura Fitness
        </Link>

        {isAuthenticated ? (
          <>
            <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
              {APP_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `font-body text-body-md transition-colors ${
                      isActive
                        ? "text-on-surface font-medium"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-4 relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-3 rounded-full pr-1"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <Avatar username={user?.username} size="sm" />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-14 w-48 bg-surface-container-lowest border border-surface-container-highest rounded-xl shadow-ambient py-2"
                >
                  <div className="px-4 py-2 border-b border-surface-container-highest mb-1">
                    <p className="font-body text-body-sm text-on-surface font-medium truncate">
                      {user?.username}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    role="menuitem"
                    className="block px-4 py-2 font-body text-body-sm text-on-surface hover:bg-surface-container-low"
                    onClick={() => setMenuOpen(false)}
                  >
                    View profile
                  </Link>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 font-body text-body-sm text-error hover:bg-surface-container-low"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
            <Link to="/profile" className="md:hidden" aria-label="Profile">
              <Avatar username={user?.username} size="sm" />
            </Link>
          </>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-3">
              <Button to="/login" variant="ghost" size="md">
                Login
              </Button>
              <Button to="/register" variant="primary" size="md">
                Sign Up
              </Button>
            </nav>
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={26} />
            </button>
          </>
        )}
      </div>

      {!isAuthenticated && menuOpen && (
        <div className="md:hidden border-t border-surface-container-highest px-container-padding py-4 flex flex-col gap-3 bg-surface">
          <Button to="/login" variant="secondary" size="md" onClick={() => setMenuOpen(false)}>
            Login
          </Button>
          <Button to="/register" variant="primary" size="md" onClick={() => setMenuOpen(false)}>
            Sign Up
          </Button>
        </div>
      )}
    </header>
  );
}