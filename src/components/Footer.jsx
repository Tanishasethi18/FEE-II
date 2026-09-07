import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="border-t border-surface-container-highest bg-surface">
      <div className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg py-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        <div>
          <p className="font-display text-headline-sm text-on-surface mb-2">
            Aura Fitness
          </p>
          <p className="font-body text-body-sm text-on-surface-variant max-w-xs">
            Boutique classes, curated instructors, and a calmer way to move.
          </p>
        </div>
        <div className="flex gap-12 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <span className="font-body text-label-sm text-on-surface-variant">
              Account
            </span>
            {isAuthenticated ? (
              <>
                <Link to="/home" className="font-body text-body-sm text-on-surface hover:opacity-70">
                  Home
                </Link>
                <Link to="/profile" className="font-body text-body-sm text-on-surface hover:opacity-70">
                  Profile
                </Link>
                <Link to="/bookings" className="font-body text-body-sm text-on-surface hover:opacity-70">
                  My Bookings
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="font-body text-body-sm text-on-surface hover:opacity-70">
                  Login
                </Link>
                <Link to="/register" className="font-body text-body-sm text-on-surface hover:opacity-70">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-surface-container-highest">
        <p className="font-body text-body-sm text-on-surface-variant text-center py-6">
          © {new Date().getFullYear()} Aura Fitness. All rights reserved.
        </p>
      </div>
    </footer>
  );
}