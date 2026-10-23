import Layout from "../components/Layout";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { useBookings } from "../context/BookingContext";

export default function Bookings() {
  const { bookedIds, cancel, liveClasses } = useBookings();
  const booked = liveClasses.filter((classItem) => bookedIds.includes(classItem.id));

  return (
    <Layout>
      <header className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pt-10 lg:pt-14 pb-8">
        <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-2">
          My bookings.
        </h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Classes you've reserved a spot in.
        </p>
      </header>

      <main className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pb-16">
        {booked.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
              <Icon name="event_busy" size={26} />
            </div>
            <p className="font-display text-headline-sm text-on-surface mb-2">
              No bookings yet.
            </p>
            <p className="font-body text-body-md text-on-surface-variant mb-6">
              Reserve a spot in a class to see it here.
            </p>
            <Button to="/classes" variant="primary" size="md">
              Browse classes
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-2xl">
            {booked.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className={`w-20 h-20 rounded-lg object-cover shrink-0 ${
                    c.grayscale ? "grayscale" : ""
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-headline-sm text-on-surface truncate">
                    {c.title}
                  </p>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    {c.day}, {c.time} · {c.duration}
                  </p>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    with {c.instructor}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => cancel(c.id)}
                  className="text-error shrink-0"
                >
                  Cancel
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}
