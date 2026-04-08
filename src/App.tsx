import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Stack from "./pages/Stack";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Education from "./pages/Education";
import Services from "./pages/Services";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/education" element={<Education />} />
          <Route path="/stack" element={<Stack />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
