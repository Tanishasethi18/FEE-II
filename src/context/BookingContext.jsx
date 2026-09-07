import { createContext, useContext, useMemo } from "react";
import { usePersistentState } from "../hooks/usePersistentState";
import { classes as classCatalog } from "../data/classes";

const BookingsContext = createContext(null);
const STORAGE_KEY = "aura_fitness_bookings";

/**
 * BookingsProvider is the single source of truth for the logged-in user's
 * reserved classes. It persists to localStorage via usePersistentState (so
 * refreshing the page loads the latest saved data instead of resetting),
 * and every page reads from this same context — so Home, Classes,
 * Schedule, and Bookings can never drift out of sync with each other.
 *
 * IMPORTANT: bookedIds must default to an empty array here, not a
 * hardcoded seed list — any hardcoded seed will reappear on every refresh
 * regardless of what the user cancels, since it becomes the fallback the
 * moment localStorage is empty/cleared.
 */
export function BookingsProvider({ children }) {
  const [bookedIds, setBookedIds] = usePersistentState(STORAGE_KEY, []);

  const reserve = (classId) => {
    setBookedIds((ids) => (ids.includes(classId) ? ids : [...ids, classId]));
  };

  const cancel = (classId) => {
    setBookedIds((ids) => ids.filter((id) => id !== classId));
  };

  const isBooked = (classId) => bookedIds.includes(classId);

  const clearBookings = () => setBookedIds([]);

  // Merge a class with this user's live booking state: bump the booked
  // count by 1 (capped at capacity) when the current user holds the spot,
  // and re-derive "full" from that live count. Every page should render
  // classes through this so seat counts / FULL badges always agree with
  // what's actually in `bookedIds`.
  const getLiveClass = (classItem) => {
    const bookedByMe = bookedIds.includes(classItem.id);
    const spotsBooked = Math.min(
      classItem.spotsBooked + (bookedByMe ? 1 : 0),
      classItem.spotsTotal
    );
    const status = spotsBooked >= classItem.spotsTotal ? "full" : "open";
    return { ...classItem, spotsBooked, status, bookedByMe };
  };

  // The full catalog, pre-merged with live booking state — the canonical
  // list every page (Home, Classes, Schedule) should render from.
  const liveClasses = useMemo(
    () => classCatalog.map(getLiveClass),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookedIds]
  );

  const value = useMemo(
    () => ({
      bookedIds,
      reserve,
      cancel,
      isBooked,
      clearBookings,
      getLiveClass,
      liveClasses,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookedIds, liveClasses]
  );

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) {
    throw new Error("useBookings must be used within a BookingsProvider");
  }
  return ctx;
}
