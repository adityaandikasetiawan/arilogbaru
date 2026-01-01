import { Toaster } from 'sonner@2.0.3';
import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import TrackingRateCards from '../components/TrackingRateCards';
import ContactSection from '../components/ContactSection';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import TestimonialSlider from '../components/TestimonialSlider';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import blogsData from '../data/blogs.json';

export default function Home() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const data = blogsData as any[];
    const featured = (data || []).filter((d: any) => d.featured);
    const list = (featured.length ? featured : data).slice(0, 3);
    setBlogs(list);
  }, []);

  const proxify = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/')) return url;
    return `/proxy-image?src=${encodeURIComponent(url)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      <Toaster position="top-right" richColors />
      <Navbar />
      <HeroCarousel />
      <TrackingRateCards />
      <ServicesSection />
      <AboutSection />
      {blogs.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Artikel Terbaru
              </h2>
              <Link to="/blog" className="text-blue-600 hover:text-orange-500 transition-colors flex items-center gap-2">
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post, index) => (
                <Link to={`/blog/${post.slug || post.id || index}`} key={post.id || index} className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={proxify(post.imageUrl)} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent line-clamp-2 group-hover:from-orange-500 group-hover:to-blue-600 transition-all">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.slug}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <TestimonialSlider />
      <ContactSection />
      <ContactForm />
      <Footer />
    </div>
  );
}
