
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import ClassCard from "../components/ClassCard";
import { categories, instructors, days, times } from "../data/classes";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";

const FILTER_DEFS = [
  { key: "category", label: "Category", options: categories },
  { key: "instructor", label: "Instructor", options: instructors },
  { key: "date", label: "Day", options: days },
  { key: "time", label: "Time", options: times },
];

export default function Classes() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const [activeFilters, setActiveFilters] = useState({
    category: null,
    instructor: null,
    date: null,
    time: null,
  });

  const { isAuthenticated } = useAuth();
  const { reserve, isBooked, liveClasses } = useBookings();
  const navigate = useNavigate();

  const setFilter = (key, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value || null,
    }));
  };

  // Search and filter classes
  const filtered = useMemo(() => {
    return liveClasses.filter((c) => {
      const q = query.trim().toLowerCase();

      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);

      const matchesCategory =
        !activeFilters.category ||
        c.category === activeFilters.category;

      const matchesInstructor =
        !activeFilters.instructor ||
        c.instructor === activeFilters.instructor;

      const matchesDate =
        !activeFilters.date ||
        c.day === activeFilters.date;

      const matchesTime =
        !activeFilters.time ||
        c.time === activeFilters.time;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesInstructor &&
        matchesDate &&
        matchesTime
      );
    });
  }, [liveClasses, query, activeFilters]);

  // Sort the filtered classes
  const sortedClasses = useMemo(() => {
    const result = [...filtered];

    if (sortBy === "earliest") {
      const dayOrder = ["Thu", "Fri", "Sat"];

      const getMinutes = (time) => {
        const [clock, period] = time.split(" ");
        let [hours, minutes] = clock.split(":").map(Number);

        if (period === "PM" && hours !== 12) {
          hours += 12;
        }

        if (period === "AM" && hours === 12) {
          hours = 0;
        }

        return hours * 60 + minutes;
      };

      result.sort((a, b) => {
        const dayDifference =
          dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);

        if (dayDifference !== 0) {
          return dayDifference;
        }

        return getMinutes(a.time) - getMinutes(b.time);
      });
    }

    if (sortBy === "available") {
      result.sort((a, b) => {
        const availableA = a.spotsTotal - a.spotsBooked;
        const availableB = b.spotsTotal - b.spotsBooked;

        return availableB - availableA;
      });
    }

    return result;
  }, [filtered, sortBy]);

  // Handle class booking
  const handleReserve = (classItem) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isBooked(classItem.id)) {
      navigate("/bookings");
      return;
    }

    if (classItem.status === "full") {
      alert(
        "Sorry, this class is full. Waitlist is not available yet."
      );
      return;
    }

    reserve(classItem.id);
    navigate("/bookings");
  };

  return (
    <Layout>
      <header className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pt-10 lg:pt-14 pb-6">
        <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-2">
          Find your next class.
        </h1>
      </header>

      {/* Search and filters */}
      <div className="sticky top-20 z-40 bg-background/90 backdrop-blur-md py-4">
        <div className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg">
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 overflow-hidden inline-flex items-center justify-center">
              <Icon name="search" />
            </span>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search classes or instructors..."
              className="w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-full py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-outline placeholder:text-outline-variant transition-all border-none"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {FILTER_DEFS.map((filter) => {
              const activeValue = activeFilters[filter.key];

              return (
                <label
                  key={filter.key}
                  className={`relative flex-shrink-0 flex items-center gap-1 pl-4 pr-3 py-2 rounded-full cursor-pointer ${
                    activeValue
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-low text-on-surface border border-surface-container-highest"
                  }`}
                >
                  <span className="font-body text-label-sm whitespace-nowrap">
                    {activeValue || filter.label}
                  </span>

                  <Icon name="arrow_drop_down" size={16} />

                  <select
                    aria-label={`Filter by ${filter.label.toLowerCase()}`}
                    value={activeValue || ""}
                    onChange={(e) =>
                      setFilter(filter.key, e.target.value)
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer !text-on-surface"
                    style={{ color: "#1a1c1b" }}
                  >
                    <option value="">{filter.label}</option>

                    {filter.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
          </div>

          
          {/* Sorting dropdown */}
          <div className="flex justify-end mt-2">
            <label className="flex items-center gap-2 text-on-surface-variant font-body text-label-sm">
              <Icon name="sort" size={16} />

              <span>Sort by:</span>

              <select
                aria-label="Sort classes"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-container-lowest text-on-surface rounded-lg border border-surface-container-highest px-3 py-2"
              >
                <option value="recommended">Recommended</option>
                <option value="earliest">Earliest class</option>
                <option value="available">Most available spots</option>
              </select>
            </label>
          </div>
          </div>
          </div>
          

      {/* Class list */}
      <div className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg py-6">
        {sortedClasses.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-headline-sm text-on-surface mb-2">
              No classes match your search.
            </p>

            <p className="font-body text-body-md text-on-surface-variant">
              Try a different keyword or clear your filters.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {sortedClasses.map((c) => (
              <ClassCard
                key={c.id}
                classItem={c}
                onReserve={handleReserve}
                isBooked={c.bookedByMe}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

