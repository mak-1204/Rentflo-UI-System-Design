import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AdminWebLayout } from "./layouts/AdminWebLayout";
import { AdminOverview } from "./screens/SA1-Overview";
import { AdminPGsList } from "./screens/SA2-PGsList";
import { AdminPGDetail } from "./screens/SA3-PGDetail";
import { AdminOwnersList } from "./screens/SA4-OwnersList";
import { AdminSubscriptions } from "./screens/SA5-Subscriptions";
import { AdminPayments } from "./screens/SA6-Payments";
import { AdminLeads } from "./screens/SA7-Leads";
import { AdminSupportTickets } from "./screens/SA8-SupportTickets";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        <Route path="/admin" element={<AdminWebLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="pgs" element={<AdminPGsList />} />
          <Route path="pgs/:id" element={<AdminPGDetail />} />
          <Route path="owners" element={<AdminOwnersList />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="support" element={<AdminSupportTickets />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
