import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { OwnerWebLayout } from "./layouts/OwnerWebLayout";
import { OwnerWebDashboard } from "./screens/OW1-Dashboard";
import { OwnerWebTenants } from "./screens/OW2-Tenants";
import { OwnerWebRentCollection } from "./screens/OW3-RentCollection";
import { OwnerWebFood } from "./screens/OW4-Food";
import { OwnerWebsiteBuilder } from "./screens/OW5-WebsiteBuilder";
import { OwnerWebLeads } from "./screens/OW6-Leads";
import { OwnerWebOperations } from "./screens/OW7-Operations";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect from base path to /owner-web */}
        <Route path="/" element={<Navigate to="/owner-web" replace />} />
        
        {/* Main Dashboard Layout */}
        <Route path="/owner-web" element={<OwnerWebLayout />}>
          <Route index element={<OwnerWebDashboard />} />
          <Route path="tenants" element={<OwnerWebTenants />} />
          <Route path="rent-collection" element={<OwnerWebRentCollection />} />
          <Route path="food" element={<OwnerWebFood />} />
          <Route path="website-builder" element={<OwnerWebsiteBuilder />} />
          <Route path="leads" element={<OwnerWebLeads />} />
          <Route path="operations" element={<OwnerWebOperations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
