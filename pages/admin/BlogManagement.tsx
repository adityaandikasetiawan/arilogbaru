import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Edit, Upload, Plus, Trash2, Star } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import Sidebar from '../../components/admin/Sidebar';

interface Blog {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  date: string;
  featured: boolean;
  content: string;
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const uniqueCategories = Array.from(new Set(blogs.map((b) => b.category))).filter(Boolean);

 
  const cloudKey = import.meta.env.VITE_TINYMCE_API_KEY as string | undefined;
  const cdnSrc = `https://cdn.tiny.cloud/1/${cloudKey || 'no-api-key'}/tinymce/6/tinymce.min.js`;
  const getApiBase = () => {
    const envBase = import.meta.env.VITE_API_BASE as string | undefined;
    if (envBase) return envBase;
    return window.location.port === '4173' ? 'http://localhost:4003' : '';
  };
  const DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\\s+(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)\\s+\\d{4}$/;
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const mapMonth: Record<string,string> = {jan:'Jan',feb:'Feb',mar:'Mar',apr:'Apr',mei:'Mei',jun:'Jun',jul:'Jul',agu:'Agu',sep:'Sep',okt:'Okt',nov:'Nov',des:'Des'};
  const formatDateIsoToIndo = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2,'0');
    const m = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd} ${m} ${yyyy}`;
  };
  const normalizeDateText = (str: string) => {
    const t = str.trim().replace(/\s+/g,' ');
    const m = t.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (!m) return t;
    let dd = String(parseInt(m[1],10)).padStart(2,'0');
    const monKey = m[2].toLowerCase();
    const mon = mapMonth[monKey] || m[2];
    return `${dd} ${mon} ${m[3]}`;
  };

  const fetchBlogs = async () => {
    setFetchError(null);
    try {
      const res = await fetch(`${getApiBase()}/api/blogs`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      } else {
        setFetchError('Gagal mengambil data blog.');
        console.error('Failed to fetch blogs:', res.statusText);
      }
    } catch (e) {
      setFetchError('Tidak dapat terhubung ke server.');
      console.error('Error connecting to server:', e);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blog: Blog) => {
    setIsAdding(false);
    setEditingBlog(blog);
    setHtmlContent(blog.content || '');
    setIsNewCategory(false);
    setShowModal(true);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingBlog({
      id: '',
      title: '',
      imageUrl: '',
      category: '',
      date: '',
      featured: false,
      content: '',
    });
    setHtmlContent('');
    setIsNewCategory(false);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog?')) return;
    try {
      const res = await fetch(`${getApiBase()}/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Blog deleted');
        fetchBlogs();
      } else {
        toast.error('Failed to delete blog');
      }
    } catch {
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
      const res = await fetch(`${getApiBase()}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (editingBlog) {
          setEditingBlog({ ...editingBlog, imageUrl: data.url });
        }
        toast.success('Image uploaded');
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
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
              <h1 className="mb-2">Blog Management</h1>
              <p className="text-gray-600">Kelola artikel yang tampil di halaman utama dan blog</p>
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Blog
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fetchError && (
              <div className="col-span-full bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                {fetchError}
                <button 
                  onClick={() => fetchBlogs()}
                  className="ml-4 underline hover:no-underline font-medium"
                >
                  Coba lagi
                </button>
              </div>
            )}
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="mb-4 h-40 bg-gray-200 rounded-lg overflow-hidden">
                  <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="">{blog.title}</h3>
                  {blog.featured && <Star className="w-4 h-4 text-orange-500" />}
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  <span>{blog.category}</span> • <span>{blog.date}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="px-3 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showModal && editingBlog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="mb-6">{isAdding ? 'Add New Blog' : 'Edit Blog'}</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const formData = new FormData(form);
                    if (isSubmitting) return;
                    const title = (formData.get('title') as string) || '';
                    const payload: Blog = {
                      id: isAdding ? Date.now().toString() : editingBlog.id,
                      title,
                      imageUrl: (formData.get('imageUrl') as string) || '',
                      category: (formData.get('category') as string) || '',
                      date: (formData.get('date') as string) || '',
                      featured: formData.get('featured') === 'on',
                      content: htmlContent || ((formData.get('content') as string) || ''),
                    };

                    if (!payload.title.trim()) {
                      toast.error('Title wajib diisi');
                      return;
                    }
                    if (!payload.category.trim()) {
                      toast.error('Category wajib diisi');
                      return;
                    }
                    if (!payload.date.trim()) {
                      toast.error('Date wajib diisi');
                      return;
                    }
                    if (!DATE_REGEX.test(payload.date.trim())) {
                      toast.error('Format tanggal harus DD MMM YYYY');
                      return;
                    }
                    if (!payload.imageUrl.trim()) {
                      toast.error('Image URL wajib diisi');
                      return;
                    }
                    if (!payload.content || !payload.content.trim()) {
                      toast.error('Konten wajib diisi');
                      return;
                    }
                    try {
                      const url = isAdding ? `${getApiBase()}/api/blogs` : `${getApiBase()}/api/blogs/${payload.id}`;
                      const method = isAdding ? 'POST' : 'PUT';
                      setIsSubmitting(true);
                      const res = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });
                      if (res.ok) {
                        toast.success(`Blog ${isAdding ? 'created' : 'updated'}`);
                        setShowModal(false);
                        fetchBlogs();
                      } else {
                        try {
                          const err = await res.json();
                          toast.error(err?.error || `Failed to ${isAdding ? 'create' : 'update'} blog`);
                        } catch {
                          toast.error(`Failed to ${isAdding ? 'create' : 'update'} blog`);
                        }
                      }
                    } catch {
                      toast.error('Error connecting to server');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Title</label>
                      <input
                        name="title"
                        type="text"
                        defaultValue={editingBlog.title}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Category</label>
                      <select
                        value={isNewCategory ? 'new' : editingBlog.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'new') {
                            setIsNewCategory(true);
                            setEditingBlog({ ...editingBlog, category: '' });
                          } else {
                            setIsNewCategory(false);
                            setEditingBlog({ ...editingBlog, category: val });
                          }
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none mb-2"
                      >
                        <option value="" disabled>Pilih Kategori</option>
                        {uniqueCategories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="new">+ Tambah Kategori Baru</option>
                      </select>
                      {isNewCategory && (
                        <input
                          name="category"
                          type="text"
                          placeholder="Masukkan kategori baru"
                          value={editingBlog.category}
                          onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                          required
                          autoFocus
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                        />
                      )}
                      {!isNewCategory && <input type="hidden" name="category" value={editingBlog.category} />}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Date</label>
                      <div className="flex gap-2">
                        <input
                          name="date"
                          type="text"
                          placeholder="DD MMM YYYY"
                          value={editingBlog.date}
                          onChange={(e) => setEditingBlog({ ...editingBlog, date: e.target.value })}
                          onBlur={(e) => setEditingBlog({ ...editingBlog, date: normalizeDateText(e.target.value) })}
                          required
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                        />
                        <input
                          ref={dateInputRef}
                          type="date"
                          className="hidden"
                          onChange={(e) => {
                            const v = e.target.value;
                            const formatted = formatDateIsoToIndo(v);
                            if (formatted) setEditingBlog({ ...editingBlog, date: formatted });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => dateInputRef.current?.click()}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
                        >
                          Pilih
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-7">
                      <input
                        id="featured"
                        name="featured"
                        type="checkbox"
                        defaultChecked={editingBlog.featured}
                        className="w-4 h-4"
                      />
                      <label htmlFor="featured" className="text-gray-700">Featured</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Image URL</label>
                    <div className="flex gap-2">
                      <input
                        name="imageUrl"
                        type="text"
                        value={editingBlog.imageUrl}
                        onChange={(e) => setEditingBlog({ ...editingBlog, imageUrl: e.target.value })}
                        required
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
                  <div>
                    <label className="block text-gray-700 mb-2">Content</label>
                    <Editor
                      apiKey={cloudKey}
                      tinymceScriptSrc={cdnSrc}
                      value={htmlContent}
                      onEditorChange={(newValue: string) => setHtmlContent(newValue)}
                      init={{
                        height: 400,
                        menubar: false,
                        plugins: ['lists', 'link', 'autolink', 'image', 'table', 'code', 'media'],
                        toolbar:
                          'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image table | removeformat code',
                        automatic_uploads: true,
                        paste_data_images: false,
                        images_file_types: 'jpeg,jpg,jpe,gif,webp,png',
                        file_picker_types: 'image',
                        file_picker_callback: async (cb: any) => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = async () => {
                            const file = input.files ? input.files[0] : null;
                            if (!file) return;
                            if (!file.type.startsWith('image/')) return;
                            if (file.size > 5 * 1024 * 1024) return;
                            const formData = new FormData();
                            formData.append('file', file);
                            const res = await fetch(`${getApiBase()}/api/upload`, { method: 'POST', body: formData });
                            if (!res.ok) return;
                            const data = await res.json();
                            cb(data.url, { title: file.name });
                          };
                          input.click();
                        },
                        images_upload_handler: (blobInfo: any, progress: any) => {
                          return new Promise(async (resolve, reject) => {
                            try {
                              const formData = new FormData();
                              formData.append('file', blobInfo.blob(), blobInfo.filename());
                              const blobType = blobInfo.blob().type || '';
                              const blobSize = blobInfo.blob().size || 0;
                              if (!blobType.startsWith('image/')) {
                                reject('Invalid file type');
                                return;
                              }
                              if (blobSize > 5 * 1024 * 1024) {
                                reject('File too large');
                                return;
                              }
                              const res = await fetch(`${getApiBase()}/api/upload`, {
                                method: 'POST',
                                body: formData,
                              });
                              if (!res.ok) {
                                reject('Upload failed');
                                return;
                              }
                              const data = await res.json();
                              resolve(data.url);
                            } catch (e) {
                              reject('Upload error');
                            }
                          });
                        },
                        content_style:
                          'body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; font-size:14px}',
                      }}
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 px-6 py-3 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-all`}
                    >
                      {isSubmitting ? 'Menyimpan...' : isAdding ? 'Create Blog' : 'Save Changes'}
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
