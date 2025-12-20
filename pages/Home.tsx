import { Toaster } from 'sonner@2.0.3';
import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import TrackingRateCards from '../components/TrackingRateCards';
import ContactSection from '../components/ContactSection';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import TestimonialSlider from '../components/TestimonialSlider';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      <Toaster position="top-right" richColors />
      <Navbar />
      <HeroCarousel />
      <TrackingRateCards />
      <ServicesSection />
      <AboutSection />
      <TestimonialSlider />
      <ContactSection />
      <ContactForm />
      <Footer />
    </div>
  );
}