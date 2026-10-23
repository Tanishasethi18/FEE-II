// import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Home from "./pages/Home";
// import Classes from "./pages/Classes";
// import Schedule from "./pages/Schedule";
// import Bookings from "./pages/Bookings";
// import Profile from "./pages/Profile";

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Landing />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route
//         path="/home"
//         element={
//           <ProtectedRoute>
//             <Home />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/classes"
//         element={
//           <ProtectedRoute>
//             <Classes />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/schedule"
//         element={
//           <ProtectedRoute>
//             <Schedule />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/bookings"
//         element={
//           <ProtectedRoute>
//             <Bookings />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feedback from "./pages/Feedback";
import Home from "./pages/Home";
import Classes from "./pages/Classes";
import Schedule from "./pages/Schedule";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";

const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feedback" element={<Feedback />} />

      {/* Members only */}
      <Route path="/home" element={protect(<Home />)} />
      <Route path="/classes" element={protect(<Classes />)} />
      <Route path="/schedule" element={protect(<Schedule />)} />
      <Route path="/bookings" element={protect(<Bookings />)} />
      <Route path="/profile" element={protect(<Profile />)} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}