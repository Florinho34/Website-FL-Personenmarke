import { BrowserRouter, Routes, Route } from "react-router-dom";
import Startseite from "./pages/Startseite";
import Philosophie from "./pages/Philosophie";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import ConsentBanner from "./components/ConsentBanner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/philosophie" element={<Philosophie />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
      </Routes>
      <ConsentBanner />
    </BrowserRouter>
  );
}
