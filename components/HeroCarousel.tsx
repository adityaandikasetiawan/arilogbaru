import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface Slide {
  id: string | number;
  image: string;
  headline: string;
  subheadline: string;
  ctaLink?: string;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1713859326033-f75e04439c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHRydWNrJTIwbG9naXN0aWNzfGVufDF8fHx8MTc2NDE4MDc1OHww&ixlib=rb-4.1.0&q=80&w=1080',
    headline: 'Solusi Logistik Terpercaya',
    subheadline: 'Pengiriman cepat dan aman ke seluruh Indonesia',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1672870152741-e526cfe5419b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGlwcGluZyUyMHBvcnQlMjBjb250YWluZXJzfGVufDF8fHx8MTc2NDIzNjU3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    headline: 'Pengiriman Internasional',
    subheadline: 'Jangkauan global dengan jaringan pelabuhan terluas',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBzdG9yYWdlfGVufDF8fHx8MTc2NDE2NTE4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    headline: 'Gudang & Distribusi',
    subheadline: 'Fasilitas penyimpanan modern dengan sistem terintegrasi',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1571086291540-b137111fa1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMGFpcnBsYW5lfGVufDF8fHx8MTc2NDIzNjU3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    headline: 'Kargo Udara Express',
    subheadline: 'Pengiriman kilat untuk kebutuhan mendesak Anda',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1561702469-c4239ced3f47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGlwcGluZyUyMGNvbnRhaW5lcnMlMjB5YXJkfGVufDF8fHx8MTc2NDE0Mjg0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    headline: 'Kontainer & Kargo Besar',
    subheadline: 'Layanan full container untuk kebutuhan industri',
  },
];

export default function HeroCarousel() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const activeSlides = data
            .filter((b: any) => b.isActive)
            .sort((a: any, b: any) => a.order - b.order)
            .map((b: any) => ({
              id: b.id,
              image: b.imageUrl,
              headline: b.title,
              subheadline: b.subtitle,
              ctaLink: b.ctaLink
            }));
          if (activeSlides.length > 0) {
            setSlides(activeSlides);
          }
        }
      })
      .catch(err => console.error('Failed to fetch banners:', err));
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-orange-900/60 z-[1]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.2),transparent_50%)] z-[1]" />
              <img
                src={slide.image}
                alt={slide.headline}
                className="w-full h-full object-cover scale-105 animate-[scale_20s_ease-in-out_infinite]"
              />
              <div className="absolute inset-0 z-[2] flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                  <motion.div
                    key={`content-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={selectedIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-3xl text-white"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white/90">Terpercaya sejak 2009</span>
                    </div>
                    <h1 className="mb-6 text-white text-5xl md:text-6xl !font-bold !leading-tight">
                      {slide.headline}
                    </h1>
                    <p className="mb-10 text-xl md:text-2xl text-white/90 !leading-relaxed">
                      {slide.subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => navigate('/tracking')}
                        className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Lacak Pengiriman</span>
                      </button>
                      <button
                        onClick={() => navigate('/shipping-rate')}
                        className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-2xl transition-all shadow-2xl hover:shadow-orange-500/50 hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <DollarSign className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Cek Tarif</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl p-4 transition-all hover:scale-110 border border-white/20"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl p-4 transition-all hover:scale-110 border border-white/20"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex gap-3 bg-black/20 backdrop-blur-md px-4 py-3 rounded-full border border-white/20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all rounded-full ${
                index === selectedIndex 
                  ? 'w-10 h-3 bg-gradient-to-r from-blue-500 to-orange-500' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}