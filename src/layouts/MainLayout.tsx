import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import ChatWidget from "../components/ChatWidget";

export default function MainLayout() {
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
