import { useState } from 'react';
import { Calculator, Package } from 'lucide-react';
import { Toaster, toast } from 'sonner@2.0.3';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ShippingRatePage() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight: '',
    service: 'regular',
  });
  const [rateResult, setRateResult] = useState<{
    cost: number;
    eta: string;
    service: string;
  } | null>(null);

  const cities = [
    'Jakarta',
    'Surabaya',
    'Bandung',
    'Medan',
    'Semarang',
    'Makassar',
    'Palembang',
    'Tangerang',
    'Depok',
    'Bekasi',
  ];

  const services = [
    { value: 'regular', label: 'Regular (3-5 hari)', multiplier: 1 },
    { value: 'express', label: 'Express (1-2 hari)', multiplier: 1.5 },
    { value: 'cargo', label: 'Cargo (5-7 hari)', multiplier: 0.8 },
  ];

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.origin || !formData.destination || !formData.weight) {
      toast.error('Mohon lengkapi semua data');
      return;
    }

    // Mock calculation
    const baseRate = 10000; // per kg
    const weight = parseFloat(formData.weight);
    const service = services.find((s) => s.value === formData.service);
    const cost = baseRate * weight * (service?.multiplier || 1);

    const etaMap: Record<string, string> = {
      regular: '3-5 hari kerja',
      express: '1-2 hari kerja',
      cargo: '5-7 hari kerja',
    };

    setRateResult({
      cost: Math.round(cost),
      eta: etaMap[formData.service],
      service: service?.label || '',
    });

    toast.success('Tarif berhasil dihitung');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-4">Cek Tarif Pengiriman</h1>
            <p className="text-lg text-gray-600">
              Hitung estimasi biaya pengiriman berdasarkan kota asal dan tujuan
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <form onSubmit={handleCalculate}>
                <div className="mb-6">
                  <label htmlFor="origin" className="block text-gray-700 mb-2">
                    Kota Asal
                  </label>
                  <select
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                  >
                    <option value="">Pilih Kota Asal</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="destination" className="block text-gray-700 mb-2">
                    Kota Tujuan
                  </label>
                  <select
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                  >
                    <option value="">Pilih Kota Tujuan</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="weight" className="block text-gray-700 mb-2">
                    Berat Paket (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                    placeholder="Masukkan berat paket"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="service" className="block text-gray-700 mb-2">
                    Jenis Layanan
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                  >
                    {services.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Hitung Tarif
                </button>
              </form>
            </div>

            {/* Result */}
            <div>
              {rateResult ? (
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-lg text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-10 h-10" />
                    <h3 className="text-white">Hasil Perhitungan</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-blue-100 mb-1">Rute Pengiriman</p>
                      <p className="text-xl">
                        {formData.origin} → {formData.destination}
                      </p>
                    </div>

                    <div>
                      <p className="text-blue-100 mb-1">Berat Paket</p>
                      <p className="text-xl">{formData.weight} kg</p>
                    </div>

                    <div>
                      <p className="text-blue-100 mb-1">Jenis Layanan</p>
                      <p className="text-xl">{rateResult.service}</p>
                    </div>

                    <div>
                      <p className="text-blue-100 mb-1">Estimasi Waktu</p>
                      <p className="text-xl">{rateResult.eta}</p>
                    </div>

                    <div className="pt-6 border-t border-blue-500">
                      <p className="text-blue-100 mb-2">Total Biaya</p>
                      <p className="text-orange-400">
                        Rp {rateResult.cost.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-2xl p-8 h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>Isi form untuk menghitung tarif pengiriman</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
