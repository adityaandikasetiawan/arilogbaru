import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster } from 'sonner@2.0.3';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Tag, User } from 'lucide-react';
import blogsData from '../data/blogs.json';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = blogsData as any[];
        const found = data.find((b: any) => String(b.id) === String(id) || b.slug === id);
        setBlog(found || null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!blog) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">Artikel tidak ditemukan</div>;
  }

  const proxify = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/')) return url;
    return `/proxy-image?src=${encodeURIComponent(url)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      <Toaster position="top-right" richColors />
      <Navbar />
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>{blog.category}</span>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/20 shadow-lg mb-8">
            <img src={proxify(blog.imageUrl)} alt={blog.title} className="w-full h-[420px] object-cover" />
          </div>
          <article className="prose max-w-3xl text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </article>
        </div>
      </section>
      <Footer />
    </div>
  );
}
