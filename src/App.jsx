import { BrowserRouter, Routes, Route } from "react-router-dom";
import Startseite from "./pages/Startseite";
import ConsentBanner from "./components/ConsentBanner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Startseite />} />
      </Routes>
      <ConsentBanner />
    </BrowserRouter>
  );
}