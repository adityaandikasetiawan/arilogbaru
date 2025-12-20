import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Package, Sparkles, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const navigate = useNavigate();

  const mainMenuItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Tentang Kami', path: '/about' },
  ];

  const servicesMenuItems = [
    { label: 'Semua Layanan', path: '/services' },
    { label: 'Layanan Corporate', path: '/corporate' },
  ];

  const otherMenuItems = [
    { label: 'Blog', path: '/blog' },
    { label: 'Lacak Pengiriman', path: '/tracking' },
    { label: 'Cek Tarif', path: '/shipping-rate' },
    { label: 'Kontak', path: '/contact' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setShowServicesDropdown(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => handleNavigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-500 p-2 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent text-xl">
              LogisticsXpress
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {mainMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowServicesDropdown(true)}
              onMouseLeave={() => setShowServicesDropdown(false)}
            >
              <button className="text-gray-700 hover:text-blue-600 transition-colors relative group flex items-center gap-1">
                Layanan
                <ChevronDown className={`w-4 h-4 transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300" />
              </button>
              {showServicesDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
                  {servicesMenuItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {otherMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Admin
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 backdrop-blur-lg">
            {mainMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent rounded-lg transition-all"
              >
                {item.label}
              </button>
            ))}
            <div className="px-4 py-2 text-sm text-gray-500">Layanan</div>
            {servicesMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent rounded-lg transition-all"
              >
                {item.label}
              </button>
            ))}
            {otherMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent rounded-lg transition-all"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavigate('/admin')}
              className="w-full text-left px-4 py-3 text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent rounded-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Admin
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}