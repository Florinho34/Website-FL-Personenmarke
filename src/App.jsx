import { BrowserRouter, Routes, Route } from "react-router-dom";
import Startseite from "./pages/Startseite";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Startseite />} />
      </Routes>
    </BrowserRouter>
  );
}