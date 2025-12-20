import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message,
        })
      });

      if (res.ok) {
        toast.success('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', {
          duration: 4000,
        });
        
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          message: '',
        });
      } else {
        toast.error('Gagal mengirim pesan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Terjadi kesalahan koneksi.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Hubungi Kami</h2>
            <p className="text-lg text-gray-600">
              Ada pertanyaan? Kirim pesan kepada kami dan tim kami akan segera membantu Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <label htmlFor="fullName" className="block text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-gray-700 mb-2">
                Nomor Telepon *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                placeholder="08xx xxxx xxxx"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="company" className="block text-gray-700 mb-2">
                Nama Perusahaan (Opsional)
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                placeholder="PT. Nama Perusahaan"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 mb-2">
                Pesan *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all resize-none"
                placeholder="Tulis pesan Anda di sini..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
