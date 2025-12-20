import { useEffect, useState } from 'react';
import { Package, Droplet, Warehouse, Radio, ShoppingBag, Truck, Plane, Ship, Home, Clock, Shield, DollarSign, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

// Icon mapping
const iconMap: { [key: string]: any } = {
  Package, Droplet, Warehouse, Radio, ShoppingBag, Truck, Plane, Ship, Home, Clock, Shield, DollarSign, MapPin
};

interface Service {
  id: string | number;
  title: string;
  description: string;
  icon?: string;
  photo?: string;
  gradient?: string;
}

const defaultServices: Service[] = [
  {
    id: 1,
    icon: 'Package',
    title: 'General Cargo Handling',
    description: 'Penanganan kargo umum dengan sistem yang efisien dan aman untuk berbagai jenis barang.',
    gradient: 'from-blue-600 to-blue-400',
  },
  // ... (keep other defaults if needed, or just rely on DB)
];

const gradients = [
  'from-blue-600 to-blue-400',
  'from-orange-600 to-orange-400',
  'from-purple-600 to-purple-400',
  'from-green-600 to-green-400',
];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          setServices(defaultServices);
        }
      })
      .catch(() => setServices(defaultServices));
  }, []);

  const getIcon = (name: string | undefined) => {
    const IconComponent = (name && iconMap[name]) || Package;
    return <IconComponent className="w-12 h-12" />;
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full mb-6">
            <span className="text-sm bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              Layanan Terlengkap
            </span>
          </div>
          <h2 className="mb-6 text-4xl md:text-5xl">Layanan Kami</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Kami menyediakan berbagai layanan logistik dan ekspedisi yang dirancang untuk memenuhi kebutuhan bisnis Anda
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const gradient = service.gradient || gradients[index % gradients.length];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Photo or Icon */}
                <div className="relative z-10 mb-6">
                  {service.photo ? (
                     <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden shadow-md">
                       <img 
                         src={service.photo} 
                         alt={service.title} 
                         className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                       />
                     </div>
                  ) : (
                    <div className={`inline-flex p-4 bg-gradient-to-br ${gradient} rounded-2xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {getIcon(service.icon)}
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="mb-4 text-xl group-hover:text-blue-600 transition-colors">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>

                {/* Decorative gradient orb */}
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}