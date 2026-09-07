import Chip from "./Chip";
import Icon from "./Icon";
import Button from "./Button";

/**
 * ClassCard mirrors the reference "Classes" screen exactly: image with
 * category chip, title + schedule, instructor, spots remaining, and a
 * primary "Reserve" action that becomes a waitlist action when full, or a
 * "View Booking" action once the user has already reserved a spot.
 */
export default function ClassCard({ classItem, onReserve, isBooked = false }) {
  const {
    title,
    category,
    instructor,
    day,
    time,
    duration,
    spotsBooked,
    spotsTotal,
    status,
    image,
    grayscale,
  } = classItem;

  const isFull = status === "full";

  return (
    <article className="bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-highest">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
            grayscale ? "grayscale" : ""
          }`}
          src={image}
          alt={`${title} class`}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {isFull && <Chip tone="error">FULL</Chip>}
          <Chip tone={isFull ? "neutral" : "sage"}>{category}</Chip>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-display text-headline-md text-on-surface">
            {title}
          </h2>
          <div className="text-right shrink-0 pl-4">
            <span className="block font-body text-label-sm text-on-surface-variant">
              {day}, {time}
            </span>
            <span className="block font-body text-label-sm text-on-surface-variant">
              {duration}
            </span>
          </div>
        </div>
        <p className="font-body text-body-md text-on-surface-variant mb-4 flex items-center gap-2">
          <Icon name="person" size={20} />
          {instructor}
        </p>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-container-highest">
          <span
            className={`font-body text-label-sm ${
              isFull ? "text-error" : "text-on-surface-variant"
            }`}
          >
            {spotsBooked}/{spotsTotal} spots
          </span>
          {isBooked ? (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => onReserve?.(classItem)}
            >
              View Booking
            </Button>
          ) : isFull ? (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => onReserve?.(classItem)}
            >
              Join Waitlist
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => onReserve?.(classItem)}
            >
              Reserve My Spot
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}