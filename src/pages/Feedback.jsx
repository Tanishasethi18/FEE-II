import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Chip from "../components/Chip";
import Icon from "../components/Icon";
import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";
import { useAuth } from "../context/AuthContext";
import { usePersistentState } from "../hooks/usePersistentState";
import { isValidEmail } from "../utils/auth";

const STORAGE_KEY = "aura_fitness_feedback";
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 500;

const CATEGORIES = [
  "Class experience",
  "Instructor",
  "Booking & schedule",
  "Website / app",
  "Suggestion",
  "Other",
];

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function newId() {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** 1–5 star picker. Buttons (not just icons) so it works with keyboard + screen readers. */
function StarRating({ value, onChange, error }) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div>
      <p id="rating-label" className="block font-body text-label-sm text-on-surface-variant mb-2">
        How would you rate your experience?
      </p>
      <div
        role="radiogroup"
        aria-labelledby="rating-label"
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""} — ${RATING_LABELS[star]}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            className={`w-11 h-11 rounded-full flex items-center justify-center overflow-hidden transition-all duration-150 hover:bg-surface-container-low active:scale-90 ${
              star <= shown ? "text-on-surface" : "text-outline-variant"
            }`}
          >
            <Icon name="star" size={30} filled={star <= shown} />
          </button>
        ))}
        <span className="ml-2 font-body text-body-sm text-on-surface-variant min-w-[72px]">
          {RATING_LABELS[shown]}
        </span>
      </div>
      {error && <p className="mt-2 text-body-sm text-error font-body">{error}</p>}
    </div>
  );
}

export default function Feedback() {
  const { user, isAuthenticated } = useAuth();
  const [entries, setEntries] = usePersistentState(STORAGE_KEY, []);

  const emptyForm = { name: "", email: "", category: CATEGORIES[0], rating: 0, message: "" };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Logged-in members see their own past feedback.
  const myEntries = useMemo(() => {
    if (!isAuthenticated) return [];
    return entries.filter((entry) => entry.email === user.email).slice(0, 5);
  }, [entries, isAuthenticated, user]);

  const validate = () => {
    const next = {};
    if (!form.rating) next.rating = "Please choose a star rating.";
    const length = form.message.trim().length;
    if (length < MESSAGE_MIN) next.message = `Please write at least ${MESSAGE_MIN} characters.`;
    if (length > MESSAGE_MAX) next.message = `Please keep it under ${MESSAGE_MAX} characters.`;
    if (!isAuthenticated && form.email.trim() && !isValidEmail(form.email)) {
      next.email = "Enter a valid email address.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const entry = {
      id: newId(),
      name: isAuthenticated ? user.username : form.name.trim(),
      email: isAuthenticated ? user.email : form.email.trim().toLowerCase(),
      category: form.category,
      rating: form.rating,
      message: form.message.trim(),
      createdAt: new Date().toISOString(),
    };
    setEntries((list) => [entry, ...list]);
    setSubmitted(true);
  };

  const handleSendAnother = () => {
    setForm(emptyForm);
    setErrors({});
    setSubmitted(false);
  };

  const remaining = MESSAGE_MAX - form.message.length;

  return (
    <Layout>
      <div className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg py-12 lg:py-20 flex justify-center">
        <div className="w-full max-w-xl">
          {submitted ? (
            <div className="text-center py-10" role="status">
              <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mx-auto mb-6 overflow-hidden">
                <Icon name="check" size={32} />
              </div>
              <h1 className="font-display text-headline-lg-mobile text-on-surface mb-2">
                Thank you.
              </h1>
              <p className="font-body text-body-md text-on-surface-variant mb-8 max-w-sm mx-auto">
                Your feedback helps us make Aura Fitness better for everyone.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button type="button" variant="secondary" size="md" onClick={handleSendAnother}>
                  Send more feedback
                </Button>
                <Button to={isAuthenticated ? "/home" : "/"} variant="primary" size="md">
                  {isAuthenticated ? "Back to home" : "Back to start"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-display text-headline-lg-mobile text-on-surface mb-2 text-center">
                Share your feedback.
              </h1>
              <p className="font-body text-body-md text-on-surface-variant text-center mb-10">
                Tell us what's working and what could be better.
              </p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                {isAuthenticated ? (
                  <p className="font-body text-body-sm text-on-surface-variant bg-surface-container-low rounded-xl px-4 py-3 break-words [overflow-wrap:anywhere]">
                    Sending as <span className="text-on-surface font-medium">{user.username}</span>{" "}
                    ({user.email})
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      id="name"
                      name="name"
                      label="Name (optional)"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      label="Email (optional)"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      error={errors.email}
                      autoComplete="email"
                    />
                  </div>
                )}

                <Select
                  id="category"
                  name="category"
                  label="What's this about?"
                  value={form.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>

                <StarRating
                  value={form.rating}
                  onChange={(rating) => setForm((f) => ({ ...f, rating }))}
                  error={errors.rating}
                />

                <Textarea
                  id="message"
                  name="message"
                  label="Your feedback"
                  placeholder="Tell us more…"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  error={errors.message}
                  hint={`${remaining} left`}
                />

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Submit feedback
                </Button>
              </form>

              {myEntries.length > 0 && (
                <section className="mt-14" aria-labelledby="history-heading">
                  <h2 id="history-heading" className="font-display text-headline-sm text-on-surface mb-4">
                    Your recent feedback
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {myEntries.map((entry) => (
                      <li
                        key={entry.id}
                        className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <Chip tone="sage">{entry.category}</Chip>
                          <span className="font-body text-body-sm text-on-surface-variant shrink-0">
                            {formatDate(entry.createdAt)}
                          </span>
                        </div>
                        <div
                          className="flex items-center text-on-surface mb-2"
                          role="img"
                          aria-label={`${entry.rating} out of 5 stars`}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="w-5 h-5 overflow-hidden inline-flex items-center justify-center">
                              <Icon name="star" size={18} filled={star <= entry.rating} />
                            </span>
                          ))}
                        </div>
                        <p className="font-body text-body-sm text-on-surface-variant break-words">
                          {entry.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
