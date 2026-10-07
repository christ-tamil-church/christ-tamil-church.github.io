import type { ReactElement } from "react";
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
import { legacyRedirects, type PagePath } from "./seo";

// One entry per page in pageMeta (src/seo.ts). A page missing from either
// side is a compile error, so every route gets metadata, prerendering, and a
// sitemap entry.
const pages: Record<PagePath, ReactElement> = {
  "/": <Home />,
  "/visit": <Visit />,
  "/worship": <Worship />,
  "/grow": <Grow />,
  "/grow/bible-study-prayer": <BibleStudyPrayer />,
  "/grow/sunday-school": <SundaySchool />,
  "/grow/kids-circle": <KidsCircle />,
  "/serve": <Serve />,
  "/sermons": <Sermons />,
  "/connect": <Connect />,
  "/events": <Events />,
  "/contact": <Contact />
};

export default function App() {
  return (
    <Layout>
      <Routes>
        {Object.entries(pages).map(([path, element]) => (
          <Route key={path} path={path} element={element} />
        ))}
        {Object.entries(legacyRedirects).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
