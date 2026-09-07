// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useBookings } from "../context/BookingContext";
// import Layout from "../components/Layout";
// import Avatar from "../components/Avatar";
// import Button from "../components/Button";
// import Icon from "../components/Icon";
// import ClassCard from "../components/ClassCard";
// import { classes } from "../data/classes";

// const QUICK_LINKS = [
//   { to: "/classes", label: "Browse Classes", icon: "fitness_center" },
//   { to: "/schedule", label: "My Schedule", icon: "calendar_today" },
//   { to: "/bookings", label: "My Bookings", icon: "event_available" },
// ];

// export default function Home() {
//   const { user, isAuthenticated } = useAuth();
//   const { reserve, isBooked } = useBookings();
//   const navigate = useNavigate();

//   const nextClass = classes.find((c) => c.status !== "full") || classes[0];
//   const upcoming = classes.slice(0, 3);

//   // Reserve a spot (or jump into an existing booking) and land the user on
//   // My Bookings so they can see the result immediately. Home is a
//   // protected route, but guard anyway in case auth expires mid-session.
//   const handleReserve = (classItem) => {
//     if (!isAuthenticated) {
//       navigate("/login");
//       return;
//     }
//     if (!isBooked(classItem.id)) {
//       reserve(classItem.id);
//     }
//     navigate("/bookings");
//   };

//   return (
//     <Layout>
//       <section className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pt-12 pb-6">
//         <div className="flex items-center gap-4 mb-10">
//           <Avatar username={user?.username} size="lg" />
//           <div>
//             <p className="font-body text-label-sm text-on-surface-variant mb-1">
//               Welcome back
//             </p>
//             <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-on-surface">
//               {user?.username}
//             </h1>
//           </div>
//         </div>

//         {/* Quick links */}
//         <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-12">
//           {QUICK_LINKS.map((link) => (
//             <Button
//               key={link.to}
//               to={link.to}
//               variant="secondary"
//               className="!flex-col !gap-2 h-24 md:h-28 !px-2 !whitespace-normal"
//             >
//               <Icon name={link.icon} size={22} />
//               <span className="text-center leading-tight text-[11px] sm:text-label-sm px-1">
//                 {link.label}
//               </span>
//             </Button>
//           ))}
//         </div>

//         {/* Next class */}
//         {nextClass && (
//           <div className="mb-12">
//             <h2 className="font-display text-headline-md text-on-surface mb-4">
//               Your next class
//             </h2>
//             <div className="max-w-md">
//               <ClassCard
//                 classItem={nextClass}
//                 onReserve={handleReserve}
//                 isBooked={isBooked(nextClass.id)}
//               />
//             </div>
//           </div>
//         )}

//         {/* Recommended */}
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-display text-headline-md text-on-surface">
//               Recommended for you
//             </h2>
//             <Button to="/classes" variant="ghost" size="sm">
//               See all
//             </Button>
//           </div>
//           <div className="grid md:grid-cols-3 gap-6">
//             {upcoming.map((c) => (
//               <ClassCard
//                 key={c.id}
//                 classItem={c}
//                 onReserve={handleReserve}
//                 isBooked={isBooked(c.id)}
//               />
//             ))}
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// }


import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import Layout from "../components/Layout";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Icon from "../components/Icon";
import ClassCard from "../components/ClassCard";

const QUICK_LINKS = [
  { to: "/classes", label: "Browse Classes", icon: "fitness_center" },
  { to: "/schedule", label: "My Schedule", icon: "calendar_today" },
  { to: "/bookings", label: "My Bookings", icon: "event_available" },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { reserve, isBooked, liveClasses } = useBookings();
  const navigate = useNavigate();

  // Read from liveClasses (catalog merged with this user's bookings) so
  // seat counts and FULL badges here always match Classes/Schedule/Bookings.
  const nextClass =
    liveClasses.find((c) => c.status !== "full") || liveClasses[0];
  const upcoming = liveClasses.slice(0, 3);

  const handleReserve = (classItem) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isBooked(classItem.id)) {
      reserve(classItem.id);
    }
    navigate("/bookings");
  };

  return (
    <Layout>
      <section className="max-w-content mx-auto px-container-padding lg:px-container-padding-lg pt-12 pb-6">
        <div className="flex items-center gap-4 mb-10">
          <Avatar username={user?.username} size="lg" />
          <div>
            <p className="font-body text-label-sm text-on-surface-variant mb-1">
              Welcome back
            </p>
            <h1 className="font-display text-headline-lg-mobile lg:text-headline-lg text-on-surface">
              {user?.username}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-12">
          {QUICK_LINKS.map((link) => (
            <Button
              key={link.to}
              to={link.to}
              variant="secondary"
              className="!flex-col !gap-2 h-24 md:h-28 !px-2 !whitespace-normal"
            >
              <Icon name={link.icon} size={22} />
              <span className="text-center leading-tight text-[11px] sm:text-label-sm px-1">
                {link.label}
              </span>
            </Button>
          ))}
        </div>

        {nextClass && (
          <div className="mb-12">
            <h2 className="font-display text-headline-md text-on-surface mb-4">
              Your next class
            </h2>
            <div className="max-w-md">
              <ClassCard
                classItem={nextClass}
                onReserve={handleReserve}
                isBooked={nextClass.bookedByMe}
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-headline-md text-on-surface">
              Recommended for you
            </h2>
            <Button to="/classes" variant="ghost" size="sm">
              See all
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcoming.map((c) => (
              <ClassCard
                key={c.id}
                classItem={c}
                onReserve={handleReserve}
                isBooked={c.bookedByMe}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}