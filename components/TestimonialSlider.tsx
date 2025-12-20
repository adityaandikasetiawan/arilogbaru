import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Star, Quote, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  photo: string;
  message: string;
  rating: number;
  isActive: boolean;
}

const defaultTestimonials = [
  {
    id: '1',
    name: 'Budi Santoso',
    company: 'PT. Maju Jaya',
    photo: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGJ1c2luZXNzJTIwY3VzdG9tZXJ8ZW58MXx8fHwxNzY0MjM2NTc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'Layanan yang sangat profesional dan cepat. Pengiriman spare parts kami selalu tepat waktu dan dalam kondisi sempurna. Sangat merekomendasikan!',
    rating: 5,
    isActive: true
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    company: 'CV. Sentosa',
    photo: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGJ1c2luZXNzJTIwY3VzdG9tZXJ8ZW58MXx8fHwxNzY0MjM2NTc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'Sudah 3 tahun kami menggunakan jasa mereka untuk e-commerce fulfillment. Sistem tracking yang real-time sangat membantu bisnis kami.',
    rating: 5,
    isActive: true
  },
  {
    id: '3',
    name: 'Ahmad Wijaya',
    company: 'PT. Global Tech',
    photo: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGJ1c2luZXNzJTIwY3VzdG9tZXJ8ZW58MXx8fHwxNzY0MjM2NTc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'Harga kompetitif dan service excellent. Team customer service sangat responsif dan membantu menyelesaikan setiap kendala dengan cepat.',
    rating: 5,
    isActive: true
  },
  {
    id: '4',
    name: 'Diana Putri',
    company: 'Toko Online Berkah',
    photo: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGJ1c2luZXNzJTIwY3VzdG9tZXJ8ZW58MXx8fHwxNzY0MjM2NTc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'Warehouse mereka sangat rapi dan terorganisir. Barang kami selalu aman dan pengelolaan inventory sangat transparan. Sangat puas!',
    rating: 5,
    isActive: true
  },
];

export default function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          const activeTestimonials = data.filter((t: Testimonial) => t.isActive);
          setTestimonials(activeTestimonials);
        } else {
          setTestimonials(defaultTestimonials);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        setTestimonials(defaultTestimonials);
      }
    };
    fetchTestimonials();
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 1 },
      },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full mb-6">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              Kata Mereka
            </span>
          </div>
          <h2 className="mb-6 text-4xl md:text-5xl">Testimoni Pelanggan</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Apa kata pelanggan kami tentang layanan kami
          </p>
        </motion.div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] px-4"
              >
                <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all h-full border border-gray-100 overflow-hidden">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Quote icon with gradient */}
                  <div className="relative z-10 mb-6">
                    <div className="inline-flex p-3 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <Quote className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <p className="relative z-10 text-gray-700 mb-8 italic leading-relaxed text-lg">
                    "{testimonial.message}"
                  </p>
                  
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-orange-600 rounded-full blur-md opacity-50" />
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className="relative w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-900 mb-1">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 mb-2">{testimonial.company}</p>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decorative gradient orb */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-600 to-orange-600 rounded-full opacity-5 group-hover:opacity-10 blur-2xl transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all rounded-full ${
                index === selectedIndex
                  ? 'w-10 h-3 bg-gradient-to-r from-blue-600 to-orange-600'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
