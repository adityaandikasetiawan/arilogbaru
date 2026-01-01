import { motion } from 'motion/react';
import { Toaster } from 'sonner@2.0.3';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Package, 
  Plane, 
  Ship, 
  Building2, 
  Home,
  Clock,
  Shield,
  DollarSign,
  MapPin,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ServicesPage() {
  const navigate = useNavigate();

  const mainServices = [
    {
      icon: Package,
      title: 'Pengiriman Paket',
      description: 'Layanan pengiriman paket reguler dengan jangkauan seluruh Indonesia',
      features: [
        'Tracking real-time',
        'Asuransi pengiriman',
        'Pickup gratis',
        'Pengiriman door-to-door'
      ],
      gradient: 'from-blue-600 to-blue-500',
      price: 'Mulai dari Rp 15.000'
    },
    {
      icon: Package,
      title: 'Pengiriman Kargo',
      description: 'Solusi pengiriman untuk barang dalam jumlah besar',
      features: [
        'Kapasitas hingga 10 ton',
        'Armada lengkap',
        'Sistem bongkar muat profesional',
        'Harga kompetitif'
      ],
      gradient: 'from-orange-600 to-orange-500',
      price: 'Mulai dari Rp 500.000'
    },
    {
      icon: Plane,
      title: 'Pengiriman Udara',
      description: 'Pengiriman cepat via jalur udara untuk pengiriman mendesak',
      features: [
        'Pengiriman 1-2 hari',
        'Jangkauan nasional',
        'Prioritas handling',
        'Tracking update berkala'
      ],
      gradient: 'from-purple-600 to-purple-500',
      price: 'Mulai dari Rp 50.000'
    },
    {
      icon: Ship,
      title: 'Pengiriman Laut',
      description: 'Solusi ekonomis untuk pengiriman antar pulau',
      features: [
        'Harga terjangkau',
        'Kapasitas besar',
        'Container tersedia',
        'Asuransi lengkap'
      ],
      gradient: 'from-cyan-600 to-cyan-500',
      price: 'Mulai dari Rp 200.000'
    },
    {
      icon: Building2,
      title: 'Layanan Corporate',
      description: 'Solusi logistik terintegrasi untuk kebutuhan perusahaan',
      features: [
        'Dedicated account manager',
        'Laporan rutin',
        'Sistem payment terms',
        'Volume discount'
      ],
      gradient: 'from-indigo-600 to-indigo-500',
      price: 'Custom pricing'
    },
    {
      icon: Home,
      title: 'Same Day Delivery',
      description: 'Pengiriman di hari yang sama untuk area tertentu',
      features: [
        'Pengiriman 4-8 jam',
        'Area Jakarta & sekitarnya',
        'Real-time tracking',
        'Prioritas tinggi'
      ],
      gradient: 'from-pink-600 to-pink-500',
      price: 'Mulai dari Rp 25.000'
    }
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: 'Layanan 24/7',
      description: 'Customer service siap membantu kapan saja'
    },
    {
      icon: Shield,
      title: 'Asuransi Lengkap',
      description: 'Perlindungan maksimal untuk setiap pengiriman'
    },
    {
      icon: DollarSign,
      title: 'Harga Kompetitif',
      description: 'Tarif terbaik dengan kualitas terjamin'
    },
    {
      icon: MapPin,
      title: 'Jangkauan Luas',
      description: 'Melayani pengiriman ke seluruh Indonesia'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Pilih Layanan',
      description: 'Pilih jenis layanan pengiriman sesuai kebutuhan Anda'
    },
    {
      step: '02',
      title: 'Isi Data',
      description: 'Lengkapi informasi pengirim dan penerima'
    },
    {
      step: '03',
      title: 'Pembayaran',
      description: 'Bayar dengan berbagai metode yang tersedia'
    },
    {
      step: '04',
      title: 'Tracking',
      description: 'Pantau status pengiriman secara real-time'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      <Toaster position="top-right" richColors />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-orange-500/10" />
        <div className="container mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600/10 to-orange-500/10 backdrop-blur-sm rounded-full border border-blue-600/20 mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Layanan Kami
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent">
              Solusi Lengkap Kebutuhan Logistik Anda
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              Kami menyediakan berbagai layanan pengiriman yang dapat disesuaikan dengan kebutuhan bisnis
              maupun personal Anda
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className={`bg-gradient-to-br ${service.gradient} p-8 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                  <div className="relative">
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl text-white mb-2">{service.title}</h3>
                    <p className="text-white/90 text-sm">{service.description}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className={`bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-4`}>
                      {service.price}
                    </div>
                    <button
                      onClick={() => navigate('/shipping-rate')}
                      className={`w-full bg-gradient-to-r ${service.gradient} text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-105`}
                    >
                      Cek Tarif
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-gradient-to-br from-blue-50/50 to-orange-50/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Keunggulan Layanan
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Fasilitas tambahan yang membuat pengalaman pengiriman Anda lebih baik
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all text-center group"
              >
                <div className="relative mb-4 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-blue-600 to-orange-500 p-4 rounded-xl">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Cara Menggunakan Layanan
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Proses pengiriman yang mudah dan cepat
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-orange-500 opacity-30 -translate-x-1/2" />
                )}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all relative z-10">
                  <div className="text-6xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-4 opacity-20">
                    {step.step}
                  </div>
                  <h3 className="text-xl mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        <div className="container mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl mb-6 text-white">
              Siap Memulai Pengiriman?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Dapatkan penawaran terbaik untuk kebutuhan logistik Anda hari ini
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/shipping-rate')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-xl transition-all hover:scale-105"
              >
                Cek Tarif Sekarang
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all hover:scale-105"
              >
                Hubungi Kami
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
