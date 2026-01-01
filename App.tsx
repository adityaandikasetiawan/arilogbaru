import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUsPage from './pages/AboutUsPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CorporateServicesPage from './pages/CorporateServicesPage';
import TrackingPage from './pages/TrackingPage';
import ShippingRatePage from './pages/ShippingRatePage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/admin/Dashboard';
import ShipmentManagement from './pages/admin/ShipmentManagement';
import VendorManagement from './pages/admin/VendorManagement';
import RateManagement from './pages/admin/RateManagement';
import ServicesManagement from './pages/admin/ServicesManagement';
import BannerManagement from './pages/admin/BannerManagement';
import TestimonialManagement from './pages/admin/TestimonialManagement';
import ContactInquiryManagement from './pages/admin/ContactInquiryManagement';
import UserManagement from './pages/admin/UserManagement';
import BlogManagement from './pages/admin/BlogManagement';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';

import ShipmentReceipt from './pages/admin/ShipmentReceipt';

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/corporate" element={<CorporateServicesPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/shipping-rate" element={<ShippingRatePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/shipments" element={<RequireAuth><ShipmentManagement /></RequireAuth>} />
        <Route path="/admin/shipments/:id/print" element={<RequireAuth><ShipmentReceipt /></RequireAuth>} />
        <Route path="/admin/rates" element={<RequireAuth><RateManagement /></RequireAuth>} />
        <Route path="/admin/vendors" element={<RequireAuth><VendorManagement /></RequireAuth>} />
        <Route path="/admin/services" element={<RequireAuth><ServicesManagement /></RequireAuth>} />
        <Route path="/admin/banners" element={<RequireAuth><BannerManagement /></RequireAuth>} />
        <Route path="/admin/testimonials" element={<RequireAuth><TestimonialManagement /></RequireAuth>} />
        <Route path="/admin/inquiries" element={<RequireAuth><ContactInquiryManagement /></RequireAuth>} />
        <Route path="/admin/users" element={<RequireAuth><UserManagement /></RequireAuth>} />
        <Route path="/admin/blog" element={<RequireAuth><BlogManagement /></RequireAuth>} />
      </Routes>
    </Router>
  );
}
