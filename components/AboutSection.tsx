import { Award, MapPin, Package, Users, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const proxify = (url: string) => `/proxy-image?src=${encodeURIComponent(url)}`;

export default function AboutSection() {
  const stats = [
    {
      id: 1,
      icon: <Award className="w-8 h-8" />,
      value: '15+',
      label: 'Tahun Pengalaman',
      gradient: 'from-blue-600 to-blue-400',
    },
    {
      id: 2,
      icon: <MapPin className="w-8 h-8" />,
      value: '500+',
      label: 'Kota Terjangkau',
      gradient: 'from-orange-600 to-orange-400',
    },
    {
      id: 3,
      icon: <Package className="w-8 h-8" />,
      value: '1M+',
      label: 'Paket Terkirim',
      gradient: 'from-blue-600 to-blue-400',
    },
    {
      id: 4,
      icon: <Users className="w-8 h-8" />,
      value: '10K+',
      label: 'Mitra Terpercaya',
      gradient: 'from-orange-600 to-orange-400',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-orange-50/50" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                Tumbuh Bersama Indonesia
              </span>
            </div>
            <h2 className="mb-6 text-4xl md:text-5xl">Tentang Kami</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              At Airlog, our key capabilities revolve around delivering exceptional logistics solutions that prioritize customer satisfaction and long-term partnerships. We are committed to seamless logistics and boundless integrity, ensuring that our clients can rely on our services to streamline their supply chain operations.
            </p>
            
            <div className="space-y-6">
              <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-blue-600 before:to-blue-400 before:rounded-full">
                <h3 className="mb-3 text-xl">Misi Kami</h3>
                <p className="text-gray-600 leading-relaxed">
                  Memberikan solusi logistik yang inovatif, efisien, dan terpercaya untuk mendukung kesuksesan bisnis
                  pelanggan kami melalui teknologi terkini dan jaringan distribusi yang luas.
                </p>
              </div>

              <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-orange-600 before:to-orange-400 before:rounded-full">
                <h3 className="mb-3 text-xl">Visi Kami</h3>
                <p className="text-gray-600 leading-relaxed">
                  Menjadi penyedia layanan logistik terdepan di Asia Tenggara yang dikenal dengan keunggulan operasional,
                  inovasi berkelanjutan, dan kepuasan pelanggan yang tinggi.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src={proxify('https://images.unsplash.com/photo-1553413077-190dd305871c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBzdG9yYWdlfGVufDF8fHx8MTc2NDE2NTE4M3ww&ixlib=rb-4.1.0&q=80&w=1080')}
                  alt="Warehouse"
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group mt-8">
                <img
                  src={proxify('https://images.unsplash.com/photo-1664382953403-fc1ac77073a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjB3b3JrZXJzfGVufDF8fHx8MTc2NDIzNjU3Nnww&ixlib=rb-4.1.0&q=80&w=1080')}
                  alt="Workers"
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="space-y-6 mt-8">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src={proxify('https://images.unsplash.com/photo-1762629027416-8e85a008b0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwZmxlZXR8ZW58MXx8fHwxNzY0MjI4MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080')}
                  alt="Delivery Trucks"
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group mt-8">
                <img
                  src={proxify('https://images.unsplash.com/photo-1713859326033-f75e04439c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHRydWNrJTIwbG9naXN0aWNzfGVufDF8fHx8MTc2NDE4MDc1OHww&ixlib=rb-4.1.0&q=80&w=1080')}
                  alt="Logistics"
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 bg-gradient-to-br ${stat.gradient} rounded-2xl text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className="text-3xl mb-2 bg-gradient-to-br bg-clip-text text-transparent" style={{
                  backgroundImage: `linear-gradient(to bottom right, ${stat.gradient.includes('blue') ? '#2563eb, #60a5fa' : '#ea580c, #fb923c'})`
                }}>
                  {stat.value}
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}