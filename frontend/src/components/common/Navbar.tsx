import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Menu, Bell, Search } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, title }) => {
  const { user } = useAuth();

  return (
    <header
      className="h-[68px] bg-card flex items-center px-5 md:px-8 sticky top-0 z-30"
      style={{
        borderBottom: '1px solid hsl(var(--border))',
        boxShadow: '0 2px 8px hsl(215 65% 18% / 0.04)',
      }}
    >
      <button onClick={onMenuClick} className="md:hidden mr-4 p-2 rounded-lg hover:bg-muted transition-colors text-foreground">
        <Menu size={20} />
      </button>

      {title && (
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full" style={{ background: 'var(--gradient-royal)' }} />
          <h2 className="font-heading font-extrabold text-xl tracking-tight text-foreground">{title}</h2>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <button className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hidden sm:flex">
          <Search size={18} />
        </button>

        {/* Notifications */}
        <button className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'hsl(var(--destructive))', boxShadow: '0 0 6px hsl(0, 80%, 55%, 0.5)' }} />
        </button>

        {/* Divider */}
        <div className="w-px h-8 mx-2 hidden sm:block" style={{ background: 'hsl(var(--border))' }} />

        {/* User */}
        {user && (
          <div className="hidden sm:flex items-center gap-3 pl-1">
            <div>
              <p className="text-sm font-bold text-foreground text-right">{user.full_name}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: 'hsl(var(--secondary))' }}>{user.role}</p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
              style={{ background: 'var(--gradient-primary)', color: 'white', boxShadow: 'var(--shadow-card)' }}
            >
              {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
