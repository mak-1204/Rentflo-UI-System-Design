import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { TenantSplash } from "./screens/TA1-Splash";
import { TenantPhoneLogin } from "./screens/TA2-PhoneLogin";
import { TenantOTP } from "./screens/TA3-OTP";
import { TenantJoinPG } from "./screens/TA4-JoinPG";
import { TenantMobileLayout } from "./layouts/TenantMobileLayout";
import { TenantHome } from "./screens/TA7-Home";
import { TenantPayScreen } from "./screens/TA8-PayScreen";
import { TenantFoodBooking } from "./screens/TA12-FoodBooking";
import { TenantComplaintsList } from "./screens/TA15-ComplaintsList";
import { TenantComplaintDetail } from "./screens/TA17-ComplaintDetail";
import { TenantMore } from "./screens/TA18-More";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tenant-mobile/splash" replace />} />
        
        <Route path="/tenant-mobile">
          <Route path="splash" element={<TenantSplash />} />
          <Route path="login" element={<TenantPhoneLogin />} />
          <Route path="otp" element={<TenantOTP />} />
          <Route path="join-pg" element={<TenantJoinPG />} />
          
          <Route path="app" element={<TenantMobileLayout />}>
            <Route index element={<TenantHome />} />
            <Route path="pay" element={<TenantPayScreen />} />
            <Route path="food" element={<TenantFoodBooking />} />
            <Route path="complaints" element={<TenantComplaintsList />} />
            <Route path="complaints/:id" element={<TenantComplaintDetail />} />
            <Route path="more" element={<TenantMore />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
