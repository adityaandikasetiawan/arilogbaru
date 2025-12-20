import { Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ContactSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            onClick={() => navigate('/contact')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 cursor-pointer transition-all hover:shadow-2xl transform hover:scale-[1.02]"
          >
            <div className="flex flex-col items-center text-center text-white">
              <div className="flex gap-4 mb-6">
                <Phone className="w-10 h-10" />
                <Mail className="w-10 h-10" />
                <MapPin className="w-10 h-10" />
              </div>
              <h2 className="mb-4 text-white">Hubungi Kami</h2>
              <p className="text-lg text-blue-100 mb-8">
                Klik untuk melihat informasi kontak lengkap
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/contact');
                }}
                className="px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                Buka Halaman Kontak
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
