import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, Building2, BookOpen,
  Calendar, ClipboardCheck, Bell, Building, CalendarCheck, LogOut, X,
  ChevronsLeft, ChevronsRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navSections = [
  {
    title: 'Main',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'faculty', 'student'] },
    ],
  },
  {
    title: 'Management',
    items: [
      { to: '/students', icon: Users, label: 'Students', roles: ['admin', 'faculty'] },
      { to: '/faculty', icon: GraduationCap, label: 'Faculty', roles: ['admin'] },
      { to: '/departments', icon: Building2, label: 'Departments', roles: ['admin'] },
      { to: '/subjects', icon: BookOpen, label: 'Subjects', roles: ['admin'] },
    ],
  },
  {
    title: 'Schedule',
    items: [
      { to: '/timetable', icon: Calendar, label: 'Timetable', roles: ['admin', 'faculty', 'student'] },
      { to: '/attendance', icon: ClipboardCheck, label: 'Attendance', roles: ['admin', 'faculty', 'student'] },
    ],
  },
  {
    title: 'Services',
    items: [
      { to: '/notices', icon: Bell, label: 'Notices', roles: ['admin', 'faculty', 'student'] },
      { to: '/facilities', icon: Building, label: 'Facilities', roles: ['admin'] },
      { to: '/bookings', icon: CalendarCheck, label: 'Bookings', roles: ['admin', 'faculty', 'student'] },
    ],
  },
];

const EXPANDED_W = 270;
const COLLAPSED_W = 72;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const width = collapsed ? COLLAPSED_W : EXPANDED_W;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: 'hsl(215, 65%, 10%, 0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width, background: 'var(--gradient-sidebar)' }}
      >
        {/* Logo */}
        <div className="px-4 py-5 relative" style={{ borderBottom: '1px solid hsl(215, 55%, 20%)' }}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl shrink-0" />
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="font-heading font-extrabold text-sm tracking-tight" style={{ color: 'white' }}>NextGen Campus</h1>
                <p className="text-[9px] font-medium uppercase tracking-widest" style={{ color: 'hsl(42, 95%, 55%)' }}>Since 2024</p>
              </div>
            )}
            {!collapsed && (
              <button className="ml-auto md:hidden p-1" onClick={onClose} style={{ color: 'hsl(215, 20%, 60%)' }}>
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navSections.map((section) => {
            const visibleItems = section.items.filter(item => item.roles.includes(user.role));
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.title} className="mb-5">
                {!collapsed && (
                  <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'hsl(215, 20%, 40%)' }}>
                    {section.title}
                  </p>
                )}
                {collapsed && <div className="mb-2 mx-auto w-6 border-t" style={{ borderColor: 'hsl(215, 55%, 22%)' }} />}
                {visibleItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center rounded-lg mb-1 text-[13px] font-semibold transition-all duration-200 group relative ${
                        collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
                      }`}
                      style={{
                        color: isActive ? 'white' : 'hsl(215, 20%, 65%)',
                        background: isActive ? 'hsl(215, 90%, 50%, 0.15)' : 'transparent',
                        borderLeft: !collapsed && isActive ? '3px solid hsl(215, 90%, 50%)' : !collapsed ? '3px solid transparent' : undefined,
                      }}
                    >
                      <item.icon size={collapsed ? 20 : 18} style={isActive ? { color: 'hsl(215, 90%, 60%)' } : {}} />
                      {!collapsed && (
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item.label}</span>
                      )}
                      {!collapsed && isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(215, 90%, 60%)', boxShadow: '0 0 8px hsl(215, 90%, 60%)' }} />
                      )}
                      {collapsed && isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: 'hsl(215, 90%, 50%)' }} />
                      )}

                      {/* Tooltip on collapsed hover */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] pointer-events-none"
                          style={{ background: 'hsl(215, 65%, 18%)', color: 'white', boxShadow: 'var(--shadow-card)' }}
                        >
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden md:flex justify-center py-2 px-2" style={{ borderTop: '1px solid hsl(215, 55%, 20%)' }}>
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 hover:scale-[1.02]"
            style={{ color: 'hsl(215, 20%, 55%)', background: 'hsl(215, 60%, 15%)' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> <span>Collapse</span></>}
          </button>
        </div>

        {/* User footer */}
        <div className="px-3 py-3" style={{ borderTop: '1px solid hsl(215, 55%, 20%)' }}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0"
                style={{ background: 'var(--gradient-accent)', color: 'hsl(215, 50%, 10%)' }}
              >
                {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ color: 'hsl(215, 20%, 55%)' }}
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'hsl(215, 60%, 15%)' }}>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0"
                style={{ background: 'var(--gradient-accent)', color: 'hsl(215, 50%, 10%)' }}
              >
                {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: 'white' }}>{user.full_name}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'hsl(42, 95%, 55%)' }}>{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ color: 'hsl(215, 20%, 55%)' }}
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export { EXPANDED_W, COLLAPSED_W };
export default Sidebar;
