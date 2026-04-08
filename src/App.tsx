import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/dashboard/ProtectedRoute";
import Home from "./pages/Home";
import Stack from "./pages/Stack";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Education from "./pages/Education";
import Services from "./pages/Services";
import Login from "./pages/dashboard/Login";
import Overview from "./pages/dashboard/Overview";
import DashboardProjects from "./pages/dashboard/Projects";
import Kanban from "./pages/dashboard/Kanban";
import Ideas from "./pages/dashboard/Ideas";
import Prompts from "./pages/dashboard/Prompts";
import Docs from "./pages/dashboard/Docs";
import Portfolio from "./pages/dashboard/Portfolio";
import Analytics from "./pages/dashboard/Analytics";

function App() {
  return (
    <Routes>
      {/* Portfolio público */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/education" element={<Education />} />
        <Route path="/stack" element={<Stack />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard protegido */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="projects" element={<DashboardProjects />} />
        <Route path="kanban" element={<Kanban />} />
        <Route path="ideas" element={<Ideas />} />
        <Route path="prompts" element={<Prompts />} />
        <Route path="docs" element={<Docs />} />
        <Route path="portfolio" element={<Portfolio />} />
      </Route>
    </Routes>
  );
}

export default App;
