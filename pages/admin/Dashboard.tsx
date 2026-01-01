import { useState, useEffect } from 'react';
import { Package, CheckCircle, RotateCcw, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

interface Shipment {
  id: string;
  trackingNumber: string;
  customer: string;
  origin: string;
  destination: string;
  status: string;
  createdDate: string;
}

interface Inquiry {
  id: string | number;
  name: string;
  email: string;
  message: string;
  date: string;
  status: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('auth_user');
  const user = userStr ? JSON.parse(userStr) : {};
  const permissions = user.permissions || [];
  const role = user.role;

  const hasPermission = (perm: string) => {
    if (role === 'Super Admin') return true;
    if (permissions.includes('All Access')) return true;
    return permissions.includes(perm);
  };

  const canManageShipments = hasPermission('Shipments Management');
  const canManageRates = hasPermission('Rates Management');
  const canManageBanners = hasPermission('Banner Management');
  const canManageInquiries = hasPermission('Inquiries Management');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [];
        
        if (canManageShipments) {
          promises.push(fetch('/api/shipments').then(res => res.ok ? res.json() : []));
        } else {
          promises.push(Promise.resolve([]));
        }

        if (canManageInquiries) {
          promises.push(fetch('/api/inquiries').then(res => res.ok ? res.json() : []));
        } else {
          promises.push(Promise.resolve([]));
        }

        const [shipData, inqData] = await Promise.all(promises);
        
        setShipments(shipData);
        setInquiries(inqData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canManageShipments, canManageInquiries]);

  const today = new Date().toISOString().split('T')[0];
  
  const shipmentsToday = shipments.filter(s => s.createdDate === today).length;
  const inTransit = shipments.filter(s => s.status === 'In Transit').length;
  const delivered = shipments.filter(s => s.status === 'Delivered').length;
  const returned = shipments.filter(s => s.status === 'Returned').length;

  const stats = [
    {
      id: 1,
      title: 'Total Shipments Today',
      value: shipmentsToday.toString(),
      icon: <Package className="w-8 h-8 text-blue-600" />,
      bgColor: 'bg-blue-50',
      change: 'Daily',
    },
    {
      id: 2,
      title: 'In Transit',
      value: inTransit.toString(),
      icon: <Package className="w-8 h-8 text-orange-600" />,
      bgColor: 'bg-orange-50',
      change: 'Active',
    },
    {
      id: 3,
      title: 'Delivered',
      value: delivered.toString(),
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      bgColor: 'bg-green-50',
      change: 'Completed',
    },
    {
      id: 4,
      title: 'Returned',
      value: returned.toString(),
      icon: <RotateCcw className="w-8 h-8 text-red-600" />,
      bgColor: 'bg-red-50',
      change: 'Alert',
    },
  ];

  const recentShipments = shipments.slice(0, 3).map(s => ({
    id: s.trackingNumber, // Display tracking number
    customer: s.customer,
    origin: s.origin,
    destination: s.destination,
    status: s.status,
    date: s.createdDate,
  }));

  const recentInquiries = inquiries.slice(0, 3).map(i => ({
    id: i.id,
    name: i.name,
    email: i.email,
    subject: i.message.substring(0, 30) + (i.message.length > 30 ? '...' : ''), // Preview message
    date: i.date,
    status: i.status,
  }));

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'In Transit': 'bg-blue-100 text-blue-700',
      Delivered: 'bg-green-100 text-green-700',
      'Picked Up': 'bg-orange-100 text-orange-700',
      Returned: 'bg-red-100 text-red-700',
      new: 'bg-blue-100 text-blue-700',
      reviewed: 'bg-yellow-100 text-yellow-700',
      resolved: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome to the logistics management system</p>
          </div>

          {/* Stats Cards */}
          {canManageShipments && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div key={stat.id} className={`${stat.bgColor} rounded-xl p-6 shadow-sm`}>
                  <div className="flex items-start justify-between mb-4">
                    {stat.icon}
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {(canManageShipments || canManageRates || canManageBanners) && (
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h3 className="mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                {canManageShipments && (
                  <button
                    onClick={() => navigate('/admin/shipments')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Shipment
                  </button>
                )}
                {canManageRates && (
                  <button
                    onClick={() => navigate('/admin/rates')}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Manage Rates
                  </button>
                )}
                {canManageBanners && (
                  <button
                    onClick={() => navigate('/admin/banners')}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Banner
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Shipments */}
            {canManageShipments && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="mb-4">Latest Tracking Updates</h3>
                <div className="space-y-4">
                  {loading ? <p>Loading...</p> : recentShipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-gray-900">{shipment.id}</p>
                          <p className="text-sm text-gray-600">{shipment.customer}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(shipment.status)}`}>
                          {shipment.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          {shipment.origin} → {shipment.destination}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{shipment.date}</p>
                      </div>
                    </div>
                  ))}
                  {!loading && recentShipments.length === 0 && <p className="text-gray-500">No shipments found.</p>}
                </div>
                <button
                  onClick={() => navigate('/admin/shipments')}
                  className="w-full mt-4 text-blue-600 hover:text-blue-700 py-2 transition-colors"
                >
                  View All Shipments →
                </button>
              </div>
            )}

            {/* Recent Inquiries */}
            {canManageInquiries && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="mb-4">Latest Customer Inquiries</h3>
                <div className="space-y-4">
                  {loading ? <p>Loading...</p> : recentInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-gray-900">{inquiry.name}</p>
                          <p className="text-sm text-gray-600">{inquiry.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{inquiry.subject}</p>
                      <p className="text-xs text-gray-500">{inquiry.date}</p>
                    </div>
                  ))}
                  {!loading && recentInquiries.length === 0 && <p className="text-gray-500">No inquiries found.</p>}
                </div>
                <button
                  onClick={() => navigate('/admin/inquiries')}
                  className="w-full mt-4 text-blue-600 hover:text-blue-700 py-2 transition-colors"
                >
                  View All Inquiries →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
