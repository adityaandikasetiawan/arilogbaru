import { useState, useEffect } from 'react';
import { Search, Eye, Mail } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import Sidebar from '../../components/admin/Sidebar';

interface Inquiry {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  date: string;
  status: 'new' | 'reviewed' | 'resolved';
}

export default function ContactInquiryManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      } else {
        toast.error('Failed to fetch inquiries');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700',
      reviewed: 'bg-yellow-100 text-yellow-700',
      resolved: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleUpdateStatus = async (id: string | number, newStatus: 'new' | 'reviewed' | 'resolved') => {
    const previousInquiries = [...inquiries];
    setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq)));

    try {
      const inquiry = inquiries.find(i => i.id === id);
      if (!inquiry) return;

      const updatedInquiry = { ...inquiry, status: newStatus };
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInquiry),
      });

      if (res.ok) {
        toast.success('Inquiry status updated');
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast.error('Failed to update status');
      setInquiries(previousInquiries);
    }
  };

  const filteredInquiries = inquiries.filter(
    (inq) =>
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="mb-2">Contact Inquiry Management</h1>
            <p className="text-gray-600">Manage customer inquiries and contact submissions</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Name</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Phone</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Company</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{inquiry.name}</td>
                      <td className="px-6 py-4 text-gray-900">{inquiry.email}</td>
                      <td className="px-6 py-4 text-gray-900">{inquiry.phone}</td>
                      <td className="px-6 py-4 text-gray-900">{inquiry.company || '-'}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{inquiry.date}</td>
                      <td className="px-6 py-4">
                        <select
                          value={inquiry.status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              inquiry.id,
                              e.target.value as 'new' | 'reviewed' | 'resolved'
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs border-0 ${getStatusColor(
                            inquiry.status
                          )}`}
                        >
                          <option value="new">New</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              window.location.href = `mailto:${inquiry.email}`;
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Reply via Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Modal */}
          {selectedInquiry && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="mb-6">Inquiry Details</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Name</label>
                      <p className="text-gray-900">{selectedInquiry.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <p className="text-gray-900">{selectedInquiry.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedInquiry.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Company</label>
                      <p className="text-gray-900">{selectedInquiry.company || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Date</label>
                      <p className="text-gray-900">{selectedInquiry.date}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Status</label>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(
                          selectedInquiry.status
                        )}`}
                      >
                        {selectedInquiry.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Message</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900">{selectedInquiry.message}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        window.location.href = `mailto:${selectedInquiry.email}`;
                      }}
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      Reply via Email
                    </button>
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
