import { MapPin, Calculator, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function TrackingRateCards() {
  const navigate = useNavigate();

  const cards = [
    {
      id: 1,
      icon: <MapPin className="w-12 h-12" />,
      title: 'Lacak Pengiriman',
      description: 'Masukkan nomor resi untuk melacak paket',
      path: '/tracking',
      gradient: 'from-blue-600 to-blue-400',
      bgGradient: 'from-blue-50 to-blue-100/50',
      hoverShadow: 'hover:shadow-blue-500/20',
    },
    {
      id: 2,
      icon: <Calculator className="w-12 h-12" />,
      title: 'Cek Tarif Pengiriman',
      description: 'Cek tarif berdasarkan kota asal & tujuan',
      path: '/shipping-rate',
      gradient: 'from-orange-600 to-orange-400',
      bgGradient: 'from-orange-50 to-orange-100/50',
      hoverShadow: 'hover:shadow-orange-500/20',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => navigate(card.path)}
              className={`group relative bg-gradient-to-br ${card.bgGradient} rounded-3xl p-8 cursor-pointer transition-all hover:shadow-2xl ${card.hoverShadow} hover:-translate-y-2 border border-white/50 backdrop-blur-sm overflow-hidden`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 bg-gradient-to-br ${card.gradient} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  <div className={`p-3 bg-white rounded-full shadow-md group-hover:translate-x-1 transition-transform`}>
                    <ArrowRight className={`w-5 h-5 bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`} />
                  </div>
                </div>
                <h3 className="mb-3 text-2xl">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </div>

              {/* Decorative corner gradient */}
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}