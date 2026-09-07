import { Link, Navigate, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Chip from "../components/Chip";
import Icon from "../components/Icon";
import ClassCard from "../components/ClassCard";
import { classes } from "../data/classes";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: "self_improvement",
    title: "Curated instructors",
    body: "Every class is led by an instructor chosen for craft, not just credentials.",
  },
  {
    icon: "calendar_month",
    title: "Book in seconds",
    body: "Reserve your spot, join a waitlist, or reschedule — all from one calm view.",
  },
  {
    icon: "spa",
    title: "Studio quality, always",
    body: "Small class sizes and considered spaces designed for focus, not noise.",
  },
];

const PREVIEW_CLASSES = classes.slice(0, 3);

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Logged-in visitors should never see the marketing Landing Page —
  // send them straight to their Home Page instead.
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Unauthenticated visitors trying to reserve a spot must log in first.
  const handleReserve = () => {
    navigate("/login");
  };

  return (
    <Layout showFooter>
      {/* Hero */}
      <section className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pt-16 pb-section-gap lg:pt-24 lg:pb-section-gap-lg grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-body text-label-sm uppercase tracking-[0.05em] text-on-surface-variant mb-6">
            Boutique fitness, reimagined
          </p>
          <h1 className="font-display text-display-lg-mobile lg:text-display-lg text-on-surface mb-6">
            Move with intention.
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant max-w-md mb-10">
            Aura Fitness brings together considered studios, premium instructors,
            and effortless booking — so you can spend less time planning and more
            time practicing.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button to="/register" variant="primary" size="lg">
              Get started
            </Button>
            <Button to="/login" variant="secondary" size="lg">
              Login
            </Button>
          </div>
        </div>
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface-container">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU4OTW44b8MrAHsSJpSHT6KN0E1U9-Vn_XqM_iyVr__W_Rv7ULM9-rdN_Laoy227ooHq8Q1L9sJ-Z4sYLUMFzj7_hMM72sr4tM5WpYISUq-y1rtEuzVlS-_viO9LQ4IHzoZdHtrLvbqZwJUmLgz9ojveu1eeAsjWPWM77tz3990SMWbB6X8w-IhVeBrIc_5ca29F5SrXe6S4kqllYAnrzHSox_JmdEUCIB9JSSrYwu8avddbtp01wb"
            alt="A calm, sunlit yoga studio with mats laid out on wood flooring"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface-container-low border-y border-surface-container-highest">
        <div className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg py-section-gap grid md:grid-cols-3 gap-10">
          {FEATURES.map((feature) => (
            <div key={feature.title}>
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest border border-surface-container-highest flex items-center justify-center mb-5 overflow-hidden">
                <Icon name={feature.icon} size={22} />
              </div>
              <h3 className="font-display text-headline-sm text-on-surface mb-2">
                {feature.title}
              </h3>
              <p className="font-body text-body-md text-on-surface-variant">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured classes */}
      <section className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg py-section-gap">
        <div className="flex items-end justify-between mb-10">
          <div>
            <Chip tone="sage" className="mb-4">
              This week
            </Chip>
            <h2 className="font-display text-headline-lg-mobile lg:text-headline-lg text-on-surface">
              A few classes to explore
            </h2>
          </div>
          <Link
            to="/register"
            className="hidden md:block font-body text-body-md text-on-surface underline underline-offset-4 hover:opacity-70"
          >
            View full schedule
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PREVIEW_CLASSES.map((c) => (
            <ClassCard key={c.id} classItem={c} onReserve={handleReserve} />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pb-section-gap">
        <div className="bg-primary text-on-primary rounded-3xl px-8 py-16 lg:py-20 text-center">
          <h2 className="font-display text-headline-lg-mobile lg:text-headline-lg mb-4">
            Your first class is waiting.
          </h2>
          <p className="font-body text-body-lg text-inverse-on-surface/80 max-w-lg mx-auto mb-8">
            Create your free account and reserve a spot in under a minute.
          </p>
          <Button to="/register" variant="secondary" size="lg" className="!border-on-primary !text-on-primary hover:!bg-white/10">
            Sign up free
          </Button>
        </div>
      </section>
    </Layout>
  );
}