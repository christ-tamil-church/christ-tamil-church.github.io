import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Contact from "./pages/Contact";
import Connect from "./pages/Connect";
import Events from "./pages/Events";
import BibleStudyPrayer from "./pages/BibleStudyPrayer";
import Grow from "./pages/Grow";
import Home from "./pages/Home";
import KidsCircle from "./pages/KidsCircle";
import NotFound from "./pages/NotFound";
import Sermons from "./pages/Sermons";
import Serve from "./pages/Serve";
import SundaySchool from "./pages/SundaySchool";
import Visit from "./pages/Visit";
import Worship from "./pages/Worship";
import { legacyRedirects } from "./seo";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="/worship" element={<Worship />} />
        <Route path="/grow" element={<Grow />} />
        <Route path="/grow/bible-study-prayer" element={<BibleStudyPrayer />} />
        <Route path="/grow/sunday-school" element={<SundaySchool />} />
        <Route path="/grow/kids-circle" element={<KidsCircle />} />
        <Route path="/serve" element={<Serve />} />
        <Route path="/sermons" element={<Sermons />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        {Object.entries(legacyRedirects).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
