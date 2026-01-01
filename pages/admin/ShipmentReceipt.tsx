import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package, MapPin, Calendar, User, Phone, Globe, Mail, Share2, Link as LinkIcon } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast, Toaster } from 'sonner@2.0.3';

interface Shipment {
  id: string;
  trackingNumber: string;
  customer: string;
  sender: string;
  origin: string;
  destination: string;
  weight: number;
  coli: number;
  status: string;
  service: string;
  courier?: string;
  vendorId?: string;
  createdDate: string;
  estimatedDelivery: string;
  notes: string;
  description: string;
  insurance: number;
  packing: string;
}

export default function ShipmentReceipt() {
  const { id } = useParams();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<{id:string;name:string;type:string}[]>([]);
  const envAny = (import.meta as any)?.env || {};
  const SITE_BASE =
    (typeof envAny.VITE_SITE_BASE === 'string' && envAny.VITE_SITE_BASE.length > 0)
      ? envAny.VITE_SITE_BASE
      : window.location.origin;

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const res = await fetch('/api/shipments');
        if (res.ok) {
          const data: Shipment[] = await res.json();
          const found = data.find((s) => s.id === id);
          if (found) {
            setShipment(found);
          }
        }
      } catch (error) {
        console.error('Failed to fetch shipment', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchVendors = async () => {
      try {
        const res = await fetch('/api/vendors');
        if (res.ok) {
          const data = await res.json();
          setVendors(data);
        }
      } catch (e) {}
    };
    fetchShipment();
    fetchVendors();
  }, [id]);

  const handleShareWA = () => {
    if (!shipment) return;
    const url = `${SITE_BASE}/tracking?number=${shipment.trackingNumber}`;
    const text = `Halo, ini resi pengiriman Anda.\nNo Resi: ${shipment.trackingNumber}\nCek status di: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    if (!shipment) return;
    const url = `${SITE_BASE}/tracking?number=${shipment.trackingNumber}`;
    navigator.clipboard.writeText(url);
    toast.success('Link tracking berhasil disalin');
  };

  if (loading) return <div className="p-8 text-center">Loading receipt...</div>;
  if (!shipment) return <div className="p-8 text-center text-red-600">Shipment not found</div>;

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900">
      <Toaster position="top-center" richColors />
      
      {/* Print Controls - Hidden when printing */}
      <div className="print:hidden mb-6 flex justify-end gap-3 max-w-3xl mx-auto">
        <button
          onClick={handleCopyLink}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          Copy Link
        </button>
        <button
          onClick={handleShareWA}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share WA
        </button>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          Print Receipt
        </button>
      </div>

      {/* Receipt Container */}
      <div className="max-w-3xl mx-auto border border-gray-200 p-8 rounded-xl shadow-sm print:shadow-none print:border-0 print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-4">
            <img
              src="/logo-main.webp"
              alt="AIRLOG"
              className="h-16 w-auto object-contain"
            />
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-600 mb-1">RESI PENGIRIMAN</h2>
            <p className="text-sm text-gray-500">#{shipment.trackingNumber}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Pengirim (Origin)</h3>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600 print:bg-transparent print:p-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-lg">{shipment.sender || 'N/A'}</p>
                <p className="text-sm text-gray-500 mt-1">{shipment.origin}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Penerima (Destination)</h3>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600 print:bg-transparent print:p-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-lg">{shipment.customer}</p>
                <p className="text-sm text-gray-500 mt-1">{shipment.destination}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Table */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 print:bg-transparent print:border print:border-gray-200">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Tanggal</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {shipment.createdDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Berat</p>
              <p className="font-medium">{shipment.weight} Kg</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Jumlah Koli</p>
              <p className="font-medium">{shipment.coli || 1} Koli</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-gray-200 pt-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Layanan</p>
              <p className="font-medium">{shipment.service || 'Standard'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Packing</p>
              <p className="font-medium">{shipment.packing || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Asuransi</p>
              <p className="font-medium">{shipment.insurance ? `Rp ${shipment.insurance.toLocaleString()}` : '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Vendor</p>
              <p className="font-medium">{vendors.find(v => v.id === shipment.vendorId)?.name || '-'}</p>
            </div>
          </div>

          {shipment.description && (
             <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Deskripsi Barang</p>
                <p className="font-medium">{shipment.description}</p>
             </div>
          )}

          {shipment.estimatedDelivery && (
             <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Estimasi Sampai</p>
                <p className="font-medium">{shipment.estimatedDelivery}</p>
             </div>
          )}
        </div>

        {/* QR Code & Footer */}
        <div className="flex justify-between items-end pt-4">
          <div className="text-sm text-gray-500 space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>airlog.asia</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+628118798168</span>
            </div>
          </div>
          <div className="text-center">
             <div className="bg-white p-2 rounded-lg border border-gray-100 inline-block">
                <QRCode value={`${SITE_BASE}/tracking?number=${encodeURIComponent(shipment.trackingNumber)}`} size={80} />
             </div>
             <p className="text-xs text-gray-400 mt-1">Scan untuk lacak</p>
          </div>
        </div>
        
        {shipment.notes && (
            <div className="mt-8 pt-6 border-t border-dashed border-gray-300">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Catatan</p>
                <p className="text-sm text-gray-700 italic">{shipment.notes}</p>
            </div>
        )}
      </div>
    </div>
  );
}
