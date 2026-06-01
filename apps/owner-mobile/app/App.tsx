import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { OwnerSplash } from "./screens/OA1-Splash";
import { OwnerPhoneLogin } from "./screens/OA2-PhoneLogin";
import { OwnerOTP } from "./screens/OA3-OTP";
import { OwnerSetupStep1 } from "./screens/OA4-SetupStep1";
import { OwnerSetupStep2 } from "./screens/OA5-SetupStep2";
import { OwnerSetupStep3 } from "./screens/OA6-SetupStep3";
import { OwnerMobileLayout } from "./layouts/OwnerMobileLayout";
import { OwnerDashboard } from "./screens/OA7-Dashboard";
import { OwnerTenantsList } from "./screens/OA8-TenantsList";
import { OwnerTenantProfile } from "./screens/OA9-TenantProfile";
import { OwnerPaymentsOverview } from "./screens/OA12-PaymentsOverview";
import { OwnerFoodDashboard } from "./screens/OA14-FoodDashboard";
import { OwnerComplaintsList } from "./screens/OA16-ComplaintsList";
import { OwnerComplaintDetail } from "./screens/OA17-ComplaintDetail";
import { OwnerWebsiteTab } from "./screens/OA25-WebsiteTab";
import { OwnerLeadsList } from "./screens/OA27-LeadsList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/owner-mobile/splash" replace />} />
        
        <Route path="/owner-mobile">
          <Route path="splash" element={<OwnerSplash />} />
          <Route path="login" element={<OwnerPhoneLogin />} />
          <Route path="otp" element={<OwnerOTP />} />
          <Route path="setup-step-1" element={<OwnerSetupStep1 />} />
          <Route path="setup-step-2" element={<OwnerSetupStep2 />} />
          <Route path="setup-step-3" element={<OwnerSetupStep3 />} />
          
          <Route path="app" element={<OwnerMobileLayout />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="tenants" element={<OwnerTenantsList />} />
            <Route path="tenants/:id" element={<OwnerTenantProfile />} />
            <Route path="payments" element={<OwnerPaymentsOverview />} />
            <Route path="food" element={<OwnerFoodDashboard />} />
            <Route path="complaints" element={<OwnerComplaintsList />} />
            <Route path="complaints/:id" element={<OwnerComplaintDetail />} />
            <Route path="website" element={<OwnerWebsiteTab />} />
            <Route path="leads" element={<OwnerLeadsList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
