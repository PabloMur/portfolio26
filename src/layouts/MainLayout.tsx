import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import { trackVisit, trackClick } from "../services/analyticsTracker";

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    trackVisit(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => trackClick(e, location.pathname);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [location.pathname]);

  return (
    <>
      <Sidebar />
      <main className="min-w-0">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
