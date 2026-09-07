import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

export default function Layout({ children, showFooter = false }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className={`flex-1 ${isAuthenticated ? "pb-24 md:pb-0" : ""}`}>
        {children}
      </main>
      {showFooter && <Footer />}
      {isAuthenticated && <BottomNav />}
    </div>
  );
}
