import Layout from "../components/Layout";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";

const MENU_ITEMS = [
  { icon: "event_available", label: "My Bookings", to: "/bookings" },
  { icon: "calendar_today", label: "My Schedule", to: "/schedule" },
  { icon: "fitness_center", label: "Browse Classes", to: "/classes" },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const { clearBookings } = useBookings();

  const handleLogout = () => {
    logout();
    clearBookings();
  };

  return (
    <Layout>
      <section className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pt-12 pb-16 flex flex-col items-center">
        <Avatar username={user?.username} size="xl" className="mb-6" />
        <h1 className="font-display text-headline-lg-mobile text-on-surface mb-1">
          {user?.username}
        </h1>
        {user?.email && (
          <p className="font-body text-body-md text-on-surface-variant mb-10">
            {user.email}
          </p>
        )}

        <div className="w-full max-w-md flex flex-col gap-3 mb-10">
          {MENU_ITEMS.map((item) => (
            <Button
              key={item.to}
              to={item.to}
              variant="secondary"
              size="lg"
              className="!justify-start w-full"
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="md"
          onClick={handleLogout}
          className="text-error"
        >
          Log out
        </Button>
      </section>
    </Layout>
  );
}