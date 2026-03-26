import React, { useState } from 'react';
import Sidebar, { EXPANDED_W, COLLAPSED_W } from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const marginLeft = collapsed ? COLLAPSED_W : EXPANDED_W;

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
      />
      <div className="flex flex-col min-h-screen transition-all duration-300 ease-in-out main-content-area">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-5 md:p-8 page-fade-in">
          {children}
        </main>
      </div>
      <style>{`.main-content-area { margin-left: 0; } @media (min-width: 768px) { .main-content-area { margin-left: ${marginLeft}px; } }`}</style>
    </div>
  );
};

export default DashboardLayout;
