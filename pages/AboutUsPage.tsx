import { motion } from 'motion/react';
import { Toaster } from 'sonner@2.0.3';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Award, Users, Target, Globe, TrendingUp, Shield, Package, Heart } from 'lucide-react';

export default function AboutUsPage() {
  const stats = [
    { icon: Package, value: '10,000+', label: 'Pengiriman/Bulan' },
    { icon: Users, value: '500+', label: 'Klien Aktif' },
    { icon: Globe, value: '50+', label: 'Kota Terjangkau' },
    { icon: Award, value: '15+', label: 'Tahun Pengalaman' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Keamanan Terjamin',
      description: 'Setiap paket dijamin keamanannya dengan sistem tracking real-time dan asuransi pengiriman.'
    },
    {
      icon: TrendingUp,
      title: 'Efisiensi Maksimal',
      description: 'Proses pengiriman yang teroptimasi untuk memastikan barang sampai tepat waktu.'
    },
    {
      icon: Heart,
      title: 'Pelayanan Prima',
      description: 'Tim customer service kami siap membantu Anda 24/7 dengan respon cepat dan solusi terbaik.'
    },
    {
      icon: Target,
      title: 'Komitmen Kualitas',
      description: 'Kami berkomitmen memberikan layanan terbaik dengan standar kualitas internasional.'
    }
  ];

  const timeline = [
    { year: '2009', title: 'Berdiri', description: 'PT Avantie Insyirah Raya didirikan dengan visi menjadi solusi logistik terpercaya' },
    { year: '2012', title: 'Ekspansi Nasional', description: 'Membuka cabang di 10 kota besar Indonesia' },
    { year: '2016', title: 'Teknologi Digital', description: 'Meluncurkan sistem tracking digital dan aplikasi mobile' },
    { year: '2020', title: 'ISO Certification', description: 'Mendapatkan sertifikasi ISO 9001:2015 untuk sistem manajemen mutu' },
    { year: '2024', title: 'Leader Industri', description: 'Menjadi salah satu perusahaan logistik terpercaya di Indonesia' }
  ];

  const team = [
    {
      name: 'Budi Santoso',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1748346918817-0b1b6b2f9bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB0ZWFtfGVufDF8fHx8MTc2NTgxNTU1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      name: 'Siti Nurhaliza',
      position: 'COO',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB3YXJlaG91c2V8ZW58MXx8fHwxNzY1ODM0OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      name: 'Ahmad Wijaya',
      position: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZXxlbnwxfHx8fDE3NjU4MDc1MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      name: 'Dewi Lestari',
      position: 'Head of Customer Service',
      image: 'https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nfGVufDF8fHx8MTc2NTgxNjI1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

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
                Tentang Kami
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent">
              Partner Logistik Terpercaya Anda
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              At PT Avantie Insyirah Raya, our key capabilities revolve around delivering exceptional logistics solutions that prioritize customer satisfaction and long-term partnerships. We are committed to seamless logistics and boundless integrity, ensuring that our clients can rely on our services to streamline their supply chain operations.
            </p>
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
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-blue-600 to-orange-500 p-3 rounded-xl">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl blur-sm opacity-70" />
                  <div className="relative bg-gradient-to-br from-blue-600 to-blue-500 p-3 rounded-xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Visi Kami
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Menjadi perusahaan logistik terkemuka di Indonesia yang memberikan solusi pengiriman
                inovatif, aman, dan terpercaya dengan standar pelayanan kelas dunia, mendukung pertumbuhan
                ekonomi nasional melalui jaringan distribusi yang luas dan efisien.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-400 rounded-xl blur-sm opacity-70" />
                  <div className="relative bg-gradient-to-br from-orange-600 to-orange-500 p-3 rounded-xl">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  Misi Kami
                </h2>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Memberikan layanan logistik berkualitas tinggi dengan harga kompetitif</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Mengembangkan teknologi untuk meningkatkan efisiensi operasional</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Membangun kepercayaan melalui pelayanan yang konsisten dan profesional</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-blue-50/50 to-orange-50/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Nilai-Nilai Kami
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Prinsip yang menjadi fondasi dalam setiap layanan yang kami berikan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
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
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl mb-3 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Perjalanan Kami
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Milestone penting dalam sejarah PT Avantie Insyirah Raya
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 pb-12 border-l-2 border-gradient-to-b from-blue-600 to-orange-500 last:pb-0"
              >
                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full shadow-lg" />
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all ml-4">
                  <div className="text-sm text-orange-600 mb-2">{item.year}</div>
                  <h3 className="text-xl mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-br from-blue-50/50 to-orange-50/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Tim Kami
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Profesional berpengalaman yang siap melayani Anda
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl mb-1 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{member.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
