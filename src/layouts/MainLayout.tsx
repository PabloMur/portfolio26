import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import { trackVisit, trackClick, trackHover } from "../services/analyticsTracker";

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    trackVisit(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => trackClick(e, location.pathname);
    document.addEventListener("click", clickHandler);

    let lastHover = 0;
    const hoverHandler = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastHover < 2000) return;
      lastHover = now;
      trackHover(e, location.pathname);
    };
    document.addEventListener("mousemove", hoverHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
      document.removeEventListener("mousemove", hoverHandler);
    };
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
