import { Outlet } from "react-router";

export function PortfolioLayout() {
  return (
    <div className="dark">
      <div className="min-h-screen" style={{ background: '#0D0D0D', fontFamily: 'Inter, sans-serif' }}>
        <Outlet />
      </div>
    </div>
  );
}
