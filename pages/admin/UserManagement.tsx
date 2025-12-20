import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Clock } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import Sidebar from '../../components/admin/Sidebar';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Operator';
  permissions: string[];
  lastActive: string;
  status: 'active' | 'inactive';
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const allPermissions = [
    'Shipments Management',
    'Rates Management',
    'Services Management',
    'Banner Management',
    'Testimonials Management',
    'Inquiries Management',
    'User Management',
  ];

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('User deleted successfully');
          fetchUsers();
        } else {
          toast.error('Failed to delete user');
        }
      } catch (error) {
        toast.error('Error connecting to server');
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Super Admin': 'bg-purple-100 text-purple-700',
      Admin: 'bg-blue-100 text-blue-700',
      Operator: 'bg-green-100 text-green-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="mb-2">User Management</h1>
              <p className="text-gray-600">Manage admin users and permissions</p>
            </div>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add User
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Name</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Role</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Permissions</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Last Active</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-600" />
                          </div>
                          <p className="text-gray-900">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.slice(0, 2).map((perm, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {perm}
                            </span>
                          ))}
                          {user.permissions.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              +{user.permissions.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{user.lastActive}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="mb-6">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const fd = new FormData(form);
                    const permissions = (fd.getAll('permissions') as string[]) || [];
                    const name = ((fd.get('name') as string) || editingUser?.name || '').trim();
                    const email = ((fd.get('email') as string) || editingUser?.email || '').trim();
                    const role = ((fd.get('role') as string) || editingUser?.role || 'Operator') as User['role'];
                    const status = ((fd.get('status') as string) || editingUser?.status || 'active') as User['status'];
                    const password = ((fd.get('password') as string) || '').trim();
                    if (!name) {
                      toast.error('Nama wajib diisi');
                      return;
                    }
                    if (!email) {
                      toast.error('Email wajib diisi');
                      return;
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                      toast.error('Format email tidak valid');
                      return;
                    }
                    if (!editingUser && !password) {
                      toast.error('Password wajib diisi untuk pengguna baru');
                      return;
                    }
                    if (!editingUser && password.length < 8) {
                      toast.error('Password minimal 8 karakter');
                      return;
                    }
                    if (editingUser && password && password.length < 8) {
                      toast.error('Password minimal 8 karakter');
                      return;
                    }
                    const payload: User = {
                      id: editingUser?.id || Date.now().toString(),
                      name,
                      email,
                      role,
                      permissions,
                      lastActive:
                        editingUser?.lastActive || new Date().toISOString().slice(0, 16).replace('T', ' '),
                      status,
                    };
                    const body: any = password ? { ...payload, password } : payload;
                    try {
                      const res = await fetch(
                        editingUser ? `/api/users/${payload.id}` : '/api/users',
                        {
                          method: editingUser ? 'PUT' : 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(body),
                        }
                      );
                      if (res.ok) {
                        toast.success('User saved successfully');
                        setShowModal(false);
                        fetchUsers();
                      } else {
                        let msg = 'Failed to save user';
                        try {
                          const err = await res.json();
                          msg = err.detail || err.error || msg;
                        } catch {}
                        toast.error(msg);
                      }
                    } catch (error) {
                      toast.error('Error connecting to server');
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Full Name</label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={editingUser?.name}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Email</label>
                      <input
                        name="email"
                        type="email"
                        defaultValue={editingUser?.email}
                        placeholder="john@logistics.com"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Role</label>
                      <select
                        name="role"
                        defaultValue={editingUser?.role}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="Operator">Operator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        defaultValue={editingUser?.status}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                      name="password"
                      type="password"
                      placeholder={editingUser ? 'Leave blank to keep current password' : 'Enter password'}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-3">Permissions</label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {allPermissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            name="permissions"
                            value={permission}
                            type="checkbox"
                            defaultChecked={editingUser?.permissions.includes(permission)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-sm text-gray-700">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      Save User
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

          {/* Activity Log */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="mb-4">Recent Activity Log</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span>John Doe</span> updated shipment{' '}
                    <span>LGX001</span>
                  </p>
                  <p className="text-xs text-gray-500">2024-11-27 14:30</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span>Jane Smith</span> added new shipping rate
                  </p>
                  <p className="text-xs text-gray-500">2024-11-27 10:15</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span>Bob Wilson</span> viewed customer inquiry
                  </p>
                  <p className="text-xs text-gray-500">2024-11-26 16:45</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
