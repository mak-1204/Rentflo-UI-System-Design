import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { PortfolioLayout } from "./layouts/PortfolioLayout";
import { PortfolioHero } from "./screens/PW2-Hero";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/portfolio/sunrise-pg" replace />} />
        
        <Route path="/portfolio/:pgId" element={<PortfolioLayout />}>
          <Route index element={<PortfolioHero />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
