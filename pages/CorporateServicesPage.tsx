import { motion } from 'motion/react';
import { Toaster, toast } from 'sonner@2.0.3';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  BarChart3,
  CheckCircle2,
  Package,
  Clock,
  Shield,
  DollarSign,
  Headphones,
  FileText,
  Globe,
  Zap,
  Award,
  Target
} from 'lucide-react';

export default function CorporateServicesPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessType: '',
    monthlyVolume: '',
    message: ''
  });

  const benefits = [
    {
      icon: DollarSign,
      title: 'Harga Khusus Corporate',
      description: 'Dapatkan tarif spesial dengan volume discount hingga 30%'
    },
    {
      icon: Users,
      title: 'Dedicated Account Manager',
      description: 'Tim khusus yang siap membantu kebutuhan logistik perusahaan Anda'
    },
    {
      icon: FileText,
      title: 'Laporan Berkala',
      description: 'Dashboard dan laporan lengkap untuk monitoring pengiriman'
    },
    {
      icon: Clock,
      title: 'Payment Terms Fleksibel',
      description: 'Sistem pembayaran dengan terms hingga 30 hari'
    },
    {
      icon: Shield,
      title: 'Asuransi Premium',
      description: 'Perlindungan maksimal untuk setiap pengiriman corporate'
    },
    {
      icon: Headphones,
      title: 'Priority Support 24/7',
      description: 'Layanan customer service prioritas yang selalu siap membantu'
    }
  ];

  const solutions = [
    {
      icon: Package,
      title: 'E-Commerce Solution',
      description: 'Solusi lengkap untuk bisnis e-commerce dengan integrasi sistem',
      features: [
        'API Integration',
        'Bulk shipping',
        'Return management',
        'COD service'
      ]
    },
    {
      icon: Building2,
      title: 'Enterprise Logistics',
      description: 'Layanan logistik terintegrasi untuk perusahaan besar',
      features: [
        'Warehouse management',
        'Distribution network',
        'Inventory control',
        'Last-mile delivery'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Supply Chain Management',
      description: 'Manajemen rantai pasok end-to-end untuk efisiensi maksimal',
      features: [
        'Procurement support',
        'Demand forecasting',
        'Route optimization',
        'Performance analytics'
      ]
    },
    {
      icon: Globe,
      title: 'International Shipping',
      description: 'Pengiriman internasional untuk ekspansi bisnis global',
      features: [
        'Customs clearance',
        'Door-to-door service',
        'Multiple carriers',
        'Competitive rates'
      ]
    }
  ];

  const stats = [
    { icon: Building2, value: '200+', label: 'Klien Corporate' },
    { icon: Package, value: '50K+', label: 'Paket/Bulan' },
    { icon: BarChart3, value: '99.5%', label: 'Success Rate' },
    { icon: Award, value: '15+', label: 'Tahun Pengalaman' }
  ];

  const clients = [
    'PT. Mandiri Retail',
    'Tokopedia Store',
    'Shopee Sellers',
    'Bukalapak Partners',
    'Lazada Merchants'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Terima kasih! Tim kami akan segera menghubungi Anda.');
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      businessType: '',
      monthlyVolume: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      <Toaster position="top-right" richColors />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
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
                Layanan Corporate
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent">
              Solusi Logistik untuk Pertumbuhan Bisnis Anda
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Partner terpercaya untuk kebutuhan logistik perusahaan dengan layanan premium,
              teknologi canggih, dan harga kompetitif
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Konsultasi Gratis
              </button>
              <button
                onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-blue-600 border border-white/20 rounded-xl hover:shadow-lg transition-all hover:scale-105"
              >
                Lihat Solusi
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all group text-center"
              >
                <div className="relative mb-4 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-blue-600 to-orange-500 p-3 rounded-xl">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-blue-50/50 to-orange-50/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Keuntungan Bermitra dengan Kami
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Dapatkan berbagai benefit eksklusif untuk mendukung pertumbuhan bisnis Anda
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-blue-600 to-orange-500 p-3 rounded-xl w-fit">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl mb-3 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Solusi Logistik Terintegrasi
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Layanan lengkap yang disesuaikan dengan kebutuhan spesifik industri Anda
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="bg-gradient-to-br from-blue-600 to-orange-500 p-8">
                  <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                    <solution.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl text-white mb-2">{solution.title}</h3>
                  <p className="text-white/90 text-sm">{solution.description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-20 bg-gradient-to-br from-blue-50/50 to-orange-50/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Dipercaya oleh Berbagai Perusahaan
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Bergabunglah dengan ratusan perusahaan yang telah mempercayai layanan kami
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-center"
              >
                <div className="text-gray-700">{client}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Konsultasi Gratis
              </h2>
              <p className="text-gray-600 text-lg">
                Hubungi kami untuk mendapatkan solusi logistik terbaik untuk bisnis Anda
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-lg"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Nama Perusahaan *</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                      placeholder="PT. Nama Perusahaan"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                      placeholder="email@perusahaan.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">No. Telepon *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                      placeholder="08123456789"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Jenis Bisnis</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                    >
                      <option value="">Pilih jenis bisnis</option>
                      <option value="ecommerce">E-Commerce</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="distribution">Distribution</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Volume Pengiriman/Bulan</label>
                    <select
                      value={formData.monthlyVolume}
                      onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                    >
                      <option value="">Pilih volume</option>
                      <option value="<100">Kurang dari 100 paket</option>
                      <option value="100-500">100 - 500 paket</option>
                      <option value="500-1000">500 - 1.000 paket</option>
                      <option value=">1000">Lebih dari 1.000 paket</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Pesan</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all resize-none"
                    placeholder="Ceritakan kebutuhan logistik perusahaan Anda..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  Kirim Permintaan Konsultasi
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
