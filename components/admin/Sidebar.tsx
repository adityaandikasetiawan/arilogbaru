import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Briefcase,
  Image,
  MessageSquare,
  Mail,
  Users,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem('auth_user');
  const user = userStr ? JSON.parse(userStr) : {};
  const permissions = user.permissions || [];
  const role = user.role;

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', perm: null },
    { path: '/admin/shipments', icon: <Package className="w-5 h-5" />, label: 'Shipments', perm: 'Shipments Management' },
    { path: '/admin/rates', icon: <DollarSign className="w-5 h-5" />, label: 'Shipping Rates', perm: 'Rates Management' },
    { path: '/admin/services', icon: <Briefcase className="w-5 h-5" />, label: 'Services', perm: 'Services Management' },
    { path: '/admin/banners', icon: <Image className="w-5 h-5" />, label: 'Banners', perm: 'Banner Management' },
    { path: '/admin/testimonials', icon: <MessageSquare className="w-5 h-5" />, label: 'Testimonials', perm: 'Testimonials Management' },
    { path: '/admin/inquiries', icon: <Mail className="w-5 h-5" />, label: 'Inquiries', perm: 'Inquiries Management' },
    { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users', perm: 'User Management' },
  ];

  const filteredItems = menuItems.filter(item => {
    if (!item.perm) return true;
    if (role === 'Super Admin') return true;
    if (permissions.includes('All Access')) return true;
    return permissions.includes(item.perm);
  });

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-blue-600">Admin Panel</h2>
        <p className="text-sm text-gray-600 mt-1">Logistics System</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {filteredItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
        >
          <span>Back to Site</span>
        </button>
      </div>
    </div>
  );
}
