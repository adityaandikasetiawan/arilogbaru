import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Package, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  const services = [
    'Pengiriman Paket',
    'Pengiriman Kargo',
    'Pengiriman Udara',
    'Pengiriman Laut',
    'Layanan Corporate',
    'Same Day Delivery',
  ];

  const quickLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Tentang Kami', path: '/about' },
    { label: 'Layanan', path: '/services' },
    { label: 'Blog', path: '/blog' },
    { label: 'Lacak Pengiriman', path: '/tracking' },
    { label: 'Cek Tarif', path: '/shipping-rate' },
    { label: 'Kontak', path: '/contact' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white pt-20 pb-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-600 rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="mb-4 text-white text-2xl md:text-3xl">Dapatkan Update Terbaru</h3>
              <p className="text-white/90">
                Berlangganan newsletter kami untuk mendapatkan info promo dan update layanan terbaru
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-4 bg-white text-blue-600 rounded-2xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
                <Send className="w-5 h-5" />
                <span className="hidden md:inline">Kirim</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Company */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/uploads/logo-main.webp" 
                alt="PT Avantie Insyirah Raya" 
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Penyedia layanan logistik dan ekspedisi terpercaya di Indonesia dengan jangkauan domestik dan internasional.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, color: 'hover:bg-blue-600' },
                { Icon: Instagram, color: 'hover:bg-pink-600' },
                { Icon: Twitter, color: 'hover:bg-blue-400' },
                { Icon: Linkedin, color: 'hover:bg-blue-700' },
              ].map(({ Icon, color }, index) => (
                <a
                  key={index}
                  href="#"
                  className={`p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 ${color} transition-all hover:scale-110`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-white">Layanan Kami</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-white">Navigasi</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-orange-400 transition-colors text-left flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 text-white">Kontak Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-white flex-shrink-0" />
                </div>
                <span className="text-gray-400 leading-relaxed">
                  NKL Building, Jl. Raya Bekasi Timur km18 no 46<br />
                  Jatinegara Kaum, Pulogadung, 13250
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4 text-white flex-shrink-0" />
                </div>
                <span className="text-gray-400">+62 811 8798 168</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4 text-white flex-shrink-0" />
                </div>
                <span className="text-gray-400">support@airlog.asia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © 2025 Airlog. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}