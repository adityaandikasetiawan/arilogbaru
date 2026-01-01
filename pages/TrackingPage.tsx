import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, MapPin, CheckCircle2 } from 'lucide-react';
import { Toaster, toast } from 'sonner@2.0.3';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface TrackingHistory {
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  customer: string;
  origin: string;
  destination: string;
  weight: number;
  status: string;
  courier: string;
  createdDate: string;
  estimatedDelivery: string;
  notes: string;
}

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<{
    number: string;
    status: string;
    origin: string;
    destination: string;
    estimatedDelivery: string;
    history: TrackingHistory[];
  } | null>(null);

  useEffect(() => {
    const number = searchParams.get('number');
    if (number) {
      setTrackingNumber(number);
      fetchTrackingData(number);
    }
  }, [searchParams]);

  const fetchTrackingData = async (number: string) => {
    try {
      const res = await fetch('/api/shipments');
      if (res.ok) {
        const data: Shipment[] = await res.json();
        const found = data.find(s => s.trackingNumber === number);
        
        if (found) {
          setTrackingData({
            number: found.trackingNumber,
            status: found.status,
            origin: found.origin,
            destination: found.destination,
            estimatedDelivery: found.estimatedDelivery,
            history: [
              {
                date: found.createdDate,
                time: '08:00', // Mock time
                location: found.origin,
                status: 'Created',
                description: 'Pesanan pengiriman telah dibuat',
              },
              // We could add more history if we had a history table, 
              // but for now we only have current status.
              // We can infer some history based on status.
              ...(found.status !== 'Created' ? [{
                date: found.createdDate, // Should ideally be updated date
                time: '12:00',
                location: found.origin,
                status: found.status,
                description: `Status terkini: ${found.status}`,
              }] : [])
            ],
          });
          toast.success('Data pengiriman ditemukan');
        } else {
          toast.error('Nomor resi tidak ditemukan');
          setTrackingData(null);
        }
      } else {
        toast.error('Gagal mengambil data pengiriman');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan koneksi');
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber) {
      toast.error('Mohon masukkan nomor resi');
      return;
    }
    fetchTrackingData(trackingNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-4">Lacak Pengiriman</h1>
            <p className="text-lg text-gray-600">
              Masukkan nomor resi untuk melacak status pengiriman Anda
            </p>
          </div>

          <form onSubmit={handleTrack} className="mb-12">
            <div className="flex gap-4">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Masukkan nomor resi (contoh: LGX123456789)"
                className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Lacak
              </button>
            </div>
          </form>

          {trackingData && (
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nomor Resi</p>
                    <p className="text-gray-900">{trackingData.number}</p>
                  </div>
                  <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                    {trackingData.status}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Asal</p>
                    <p className="text-gray-900">{trackingData.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tujuan</p>
                    <p className="text-gray-900">{trackingData.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estimasi Tiba</p>
                    <p className="text-gray-900">{trackingData.estimatedDelivery}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              {/* Tracking History */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="mb-6">Riwayat Pengiriman</h3>
                <div className="space-y-6">
                  {trackingData.history.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                        }`}>
                          {index === 0 ? (
                            <MapPin className="w-5 h-5 text-white" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          )}
                        </div>
                        {index !== trackingData.history.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300 my-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-gray-900">{item.status}</p>
                            <p className="text-sm text-gray-600">{item.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{item.date}</p>
                            <p className="text-sm text-gray-600">{item.time}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
