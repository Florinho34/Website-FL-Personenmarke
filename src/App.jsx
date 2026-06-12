import { BrowserRouter, Routes, Route } from "react-router-dom";
import Startseite from "./pages/Startseite";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import ConsentBanner from "./components/ConsentBanner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
      </Routes>
      <ConsentBanner />
    </BrowserRouter>
  );
}
