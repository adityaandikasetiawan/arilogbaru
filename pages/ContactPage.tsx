import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Toaster } from 'sonner@2.0.3';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function ContactPage() {
  const contactInfo = [
    {
      id: 1,
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: 'Telepon',
      details: ['+62 21 1234 5678', '+62 812 3456 7890'],
    },
    {
      id: 2,
      icon: <Mail className="w-8 h-8 text-orange-600" />,
      title: 'Email',
      details: ['info@logistics.com', 'support@logistics.com'],
    },
    {
      id: 3,
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: 'Alamat',
      details: ['Jl. Logistik Raya No. 123', 'Jakarta 12345, Indonesia'],
    },
    {
      id: 4,
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: 'Jam Operasional',
      details: ['Senin - Jumat: 08:00 - 17:00', 'Sabtu: 08:00 - 13:00'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="mb-4">Hubungi Kami</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami siap membantu Anda. Hubungi kami melalui berbagai channel yang tersedia atau kunjungi kantor kami
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info) => (
            <div
              key={info.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all text-center"
            >
              <div className="flex justify-center mb-4">{info.icon}</div>
              <h3 className="mb-4">{info.title}</h3>
              {info.details.map((detail, index) => (
                <p key={index} className="text-gray-600 text-sm mb-1">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Map and Form */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Map Placeholder */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="w-full h-[400px] bg-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Lokasi Kantor Kami</p>
                <p className="text-sm mt-2">Jl. Logistik Raya No. 123, Jakarta</p>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-lg text-white">
            <h3 className="mb-6 text-white">Mengapa Memilih Kami?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div>
                  <p className="mb-1">Pengalaman 15+ Tahun</p>
                  <p className="text-sm text-blue-100">
                    Berpengalaman melayani berbagai industri
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div>
                  <p className="mb-1">Jangkauan Luas</p>
                  <p className="text-sm text-blue-100">
                    Melayani pengiriman ke 500+ kota di Indonesia
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div>
                  <p className="mb-1">Tracking Real-time</p>
                  <p className="text-sm text-blue-100">
                    Pantau paket Anda kapan saja dimana saja
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div>
                  <p className="mb-1">Customer Support 24/7</p>
                  <p className="text-sm text-blue-100">
                    Tim support siap membantu Anda setiap saat
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div>
                  <p className="mb-1">Harga Kompetitif</p>
                  <p className="text-sm text-blue-100">
                    Tarif terbaik dengan layanan premium
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactForm />
      <Footer />
    </div>
  );
}
