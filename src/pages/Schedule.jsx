import Layout from "../components/Layout";
import Icon from "../components/Icon";
import Chip from "../components/Chip";
import { useBookings } from "../context/BookingContext";

function groupByDay(list) {
  return list.reduce((acc, c) => {
    acc[c.day] = acc[c.day] || [];
    acc[c.day].push(c);
    return acc;
  }, {});
}

export default function Schedule() {
  const { liveClasses } = useBookings();
  const bookedClasses = liveClasses.filter((classItem) => classItem.bookedByMe);
  const grouped = groupByDay(bookedClasses);
  const days = Object.keys(grouped);

  return (
    <Layout>
      <header className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pt-10 lg:pt-14 pb-8">
        <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-2">
          Your schedule.
        </h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Everything on the calendar this week.
        </p>
      </header>

      <main className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pb-16 flex flex-col gap-10">
        {days.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
              <Icon name="event_busy" size={26} />
            </div>
            <p className="font-display text-headline-sm text-on-surface mb-2">
              No classes scheduled.
            </p>
            <p className="font-body text-body-md text-on-surface-variant">
              Reserve a class to see it on your schedule.
            </p>
          </div>
        ) : (
          days.map((day) => (
            <div key={day}>
              <h2 className="font-display text-headline-sm text-on-surface mb-4">
                {day}
              </h2>
              <div className="flex flex-col gap-3">
                {grouped[day].map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-4 bg-surface-container-lowest border border-surface-container-highest rounded-xl px-5 py-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-surface-container-low flex items-center justify-center shrink-0 overflow-hidden">
                        <Icon name="fitness_center" size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-body-md text-on-surface font-medium truncate">
                          {c.title}
                        </p>
                        <p className="font-body text-body-sm text-on-surface-variant truncate">
                          {c.instructor} · {c.time} · {c.duration}
                        </p>
                      </div>
                    </div>
                    <Chip tone={c.status === "full" ? "error" : "sage"} className="shrink-0">
                      {c.status === "full" ? "FULL" : c.category}
                    </Chip>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </Layout>
  );
}
