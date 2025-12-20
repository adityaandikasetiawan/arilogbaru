import { useState, useEffect } from 'react';
import { Edit, Upload, ChevronUp, ChevronDown, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import Sidebar from '../../components/admin/Sidebar';

interface Banner {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  ctaLink: string;
  imageUrl: string;
  isActive: boolean;
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      } else {
        toast.error('Failed to fetch banners');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleEdit = (banner: Banner) => {
    setIsAdding(false);
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingBanner({
      id: '',
      order: banners.length + 1,
      title: '',
      subtitle: '',
      ctaLink: '',
      imageUrl: '',
      isActive: true
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Banner deleted successfully');
        fetchBanners();
      } else {
        toast.error('Failed to delete banner');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const b = banners.find(x => x.id === id);
      if (!b) return;
      const updated = { ...b, isActive: !b.isActive };
      const res = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        toast.success('Banner status updated');
        fetchBanners();
      } else {
        toast.error('Failed to update banner');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        if (editingBanner) {
          setEditingBanner({ ...editingBanner, imageUrl: data.url });
        }
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleMoveUp = async (id: string) => {
    const index = banners.findIndex((b) => b.id === id);
    if (index > 0) {
      const newBanners = [...banners];
      [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
      const orders = newBanners.map((b, i) => ({ id: b.id, order: i + 1 }));
      try {
        const res = await fetch('/api/banners/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders }),
        });
        if (res.ok) {
          toast.success('Banner order updated');
          fetchBanners();
        } else {
          toast.error('Failed to reorder banners');
        }
      } catch (error) {
        toast.error('Error connecting to server');
      }
    }
  };

  const handleMoveDown = async (id: string) => {
    const index = banners.findIndex((b) => b.id === id);
    if (index < banners.length - 1) {
      const newBanners = [...banners];
      [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
      const orders = newBanners.map((b, i) => ({ id: b.id, order: i + 1 }));
      try {
        const res = await fetch('/api/banners/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders }),
        });
        if (res.ok) {
          toast.success('Banner order updated');
          fetchBanners();
        } else {
          toast.error('Failed to reorder banners');
        }
      } catch (error) {
        toast.error('Error connecting to server');
      }
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="mb-2">Banner Management</h1>
              <p className="text-gray-600">Manage the hero carousel banners on the homepage</p>
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Banner
            </button>
          </div>

          {/* Banners List */}
          <div className="space-y-4">
            {banners.map((banner, index) => (
              <div key={banner.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex gap-6">
                  {/* Banner Image */}
                  <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Banner Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3>{banner.title}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              banner.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{banner.subtitle}</p>
                        <p className="text-xs text-gray-500">CTA Link: {banner.ctaLink}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveUp(banner.id)}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-30"
                        >
                          <ChevronUp className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(banner.id)}
                          disabled={index === banners.length - 1}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-30"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(banner.id)}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                          banner.isActive
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {banner.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Activate
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {showModal && editingBanner && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
                <h2 className="mb-6">{isAdding ? 'Add New Banner' : 'Edit Banner'}</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const updated: Banner = {
                      id: isAdding ? Date.now().toString() : editingBanner.id,
                      order: editingBanner.order,
                      title: (fd.get('title') as string) || editingBanner.title,
                      subtitle: (fd.get('subtitle') as string) || editingBanner.subtitle,
                      ctaLink: (fd.get('ctaLink') as string) || editingBanner.ctaLink,
                      imageUrl: (fd.get('imageUrl') as string) || editingBanner.imageUrl,
                      isActive: fd.get('isActive') === 'on',
                    };
                    try {
                      const url = isAdding ? '/api/banners' : `/api/banners/${updated.id}`;
                      const method = isAdding ? 'POST' : 'PUT';
                      
                      const res = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updated),
                      });
                      if (res.ok) {
                        toast.success(`Banner ${isAdding ? 'created' : 'updated'} successfully`);
                        setShowModal(false);
                        fetchBanners();
                      } else {
                        toast.error(`Failed to ${isAdding ? 'create' : 'update'} banner`);
                      }
                    } catch (error) {
                      toast.error('Error connecting to server');
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-gray-700 mb-2">Banner Title</label>
                    <input
                      name="title"
                      type="text"
                      defaultValue={editingBanner.title}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Subtitle</label>
                    <input
                      name="subtitle"
                      type="text"
                      defaultValue={editingBanner.subtitle}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">CTA Link</label>
                    <input
                      name="ctaLink"
                      type="text"
                      defaultValue={editingBanner.ctaLink}
                      placeholder="/tracking"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Image URL</label>
                    <div className="flex gap-2">
                      <input
                        name="imageUrl"
                        type="text"
                        value={editingBanner.imageUrl}
                        onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleUpload}
                          disabled={uploading}
                        />
                        <div className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <Upload className="w-4 h-4" />
                          {uploading ? 'Uploading...' : 'Upload'}
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      {isAdding ? 'Create Banner' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
