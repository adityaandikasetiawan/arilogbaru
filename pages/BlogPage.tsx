import { motion } from 'motion/react';
import { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, User, Tag, ArrowRight, Search, TrendingUp } from 'lucide-react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Semua', 'Tips & Trik', 'Teknologi', 'Industri', 'Berita'];

  const blogPosts = [
    {
      id: 1,
      title: 'Teknologi AI dalam Dunia Logistik Modern',
      excerpt: 'Bagaimana kecerdasan buatan mengubah cara kerja industri logistik dan meningkatkan efisiensi operasional.',
      image: 'https://images.unsplash.com/photo-1761195696590-3490ea770aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2NTgxMTcyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Teknologi',
      author: 'Ahmad Wijaya',
      date: '15 Des 2024',
      readTime: '5 menit',
      featured: true
    },
    {
      id: 2,
      title: 'Tips Mengemas Paket agar Aman Saat Pengiriman',
      excerpt: 'Panduan lengkap cara mengemas barang dengan benar untuk memastikan paket sampai dengan aman.',
      image: 'https://images.unsplash.com/photo-1755606396356-bdd7cd95df75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBwYWNrYWdpbmd8ZW58MXx8fHwxNzY1ODYyOTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Tips & Trik',
      author: 'Siti Nurhaliza',
      date: '12 Des 2024',
      readTime: '4 menit',
      featured: true
    },
    {
      id: 3,
      title: 'Tren E-Commerce dan Dampaknya pada Logistik',
      excerpt: 'Analisis mendalam tentang pertumbuhan e-commerce di Indonesia dan tantangan logistik yang menyertainya.',
      image: 'https://images.unsplash.com/photo-1627309366653-2dedc084cdf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBwbHklMjBjaGFpbnxlbnwxfHx8fDE3NjU4NjI5NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Industri',
      author: 'Budi Santoso',
      date: '10 Des 2024',
      readTime: '6 menit',
      featured: false
    },
    {
      id: 4,
      title: 'Memilih Layanan Pengiriman yang Tepat untuk Bisnis',
      excerpt: 'Faktor-faktor penting yang perlu dipertimbangkan saat memilih jasa pengiriman untuk bisnis Anda.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB3YXJlaG91c2V8ZW58MXx8fHwxNzY1ODM0OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Tips & Trik',
      author: 'Dewi Lestari',
      date: '8 Des 2024',
      readTime: '5 menit',
      featured: false
    },
    {
      id: 5,
      title: 'Inovasi Sistem Tracking Real-Time di LogisticsXpress',
      excerpt: 'Mengenal lebih dalam teknologi tracking terbaru yang memudahkan Anda memantau pengiriman.',
      image: 'https://images.unsplash.com/photo-1748346918817-0b1b6b2f9bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB0ZWFtfGVufDF8fHx8MTc2NTgxNTU1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Teknologi',
      author: 'Ahmad Wijaya',
      date: '5 Des 2024',
      readTime: '4 menit',
      featured: false
    },
    {
      id: 6,
      title: 'Strategi Mengurangi Biaya Pengiriman untuk UMKM',
      excerpt: 'Tips hemat untuk pelaku UMKM dalam mengelola biaya logistik tanpa mengorbankan kualitas.',
      image: 'https://images.unsplash.com/photo-1724770388461-58567b88f395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGlwcGluZyUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NTg2MjgzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Tips & Trik',
      author: 'Siti Nurhaliza',
      date: '1 Des 2024',
      readTime: '5 menit',
      featured: false
    },
    {
      id: 7,
      title: 'Regulasi Baru Pengiriman Barang Berbahaya',
      excerpt: 'Update terbaru peraturan pengiriman barang berbahaya dan cara mematuhinya.',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZXxlbnwxfHx8fDE3NjU4MDc1MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Berita',
      author: 'Budi Santoso',
      date: '28 Nov 2024',
      readTime: '6 menit',
      featured: false
    },
    {
      id: 8,
      title: 'Keberlanjutan dalam Industri Logistik',
      excerpt: 'Langkah-langkah menuju logistik ramah lingkungan dan berkelanjutan.',
      image: 'https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nfGVufDF8fHx8MTc2NTgxNjI1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Industri',
      author: 'Dewi Lestari',
      date: '25 Nov 2024',
      readTime: '7 menit',
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Semua' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      <Toaster position="top-right" richColors />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
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
                Blog & Artikel
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent">
              Insight & Informasi Logistik
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              Artikel, tips, dan berita terbaru seputar dunia logistik dan pengiriman
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mt-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 sticky top-20 z-40 bg-gradient-to-br from-slate-50/95 via-blue-50/30 to-orange-50/20 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white/80 text-gray-600 hover:bg-white border border-white/20 hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === 'Semua' && searchQuery === '' && (
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-3xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Artikel Pilihan
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white text-sm rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl mb-3 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:to-blue-600 transition-all">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-orange-500 transition-colors group">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl mb-8 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            {selectedCategory === 'Semua' ? 'Semua Artikel' : `Artikel ${selectedCategory}`}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Tidak ada artikel yang ditemukan</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs rounded-full text-gray-700 border border-white/20">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent line-clamp-2 group-hover:from-orange-500 group-hover:to-blue-600 transition-all">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-orange-500 transition-colors group">
                      Baca
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        <div className="container mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-white">
              Dapatkan Update Terbaru
            </h2>
            <p className="text-white/90 mb-8">
              Subscribe untuk mendapatkan artikel dan tips terbaru langsung ke email Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-8 py-3 bg-white text-blue-600 rounded-xl hover:shadow-xl transition-all hover:scale-105">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
