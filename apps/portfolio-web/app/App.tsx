import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { PortfolioLayout } from "./layouts/PortfolioLayout";
import { PortfolioLeadCapture } from "./screens/PW1-LeadCapture";
import { PortfolioHero } from "./screens/PW2-Hero";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/portfolio/sunrise-pg" replace />} />
        
        <Route path="/portfolio/:pgId" element={<PortfolioLayout />}>
          <Route index element={<PortfolioLeadCapture />} />
          <Route path="explore" element={<PortfolioHero />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
