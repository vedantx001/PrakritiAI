import React from 'react';
import { LayoutDashboard, CheckCircle, FileText, MessageSquare, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import { useTheme } from '../../../context/ThemeContext';
import SidebarItem from './SidebarItem';
import logoLight from '../../../assets/LightMode_logo_PAI.png';
import logoDark from '../../../assets/DarkMode_logo_PAI.png';

const AdminSidebar = ({ isSidebarOpen, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-[var(--bg-card)] border-r border-[var(--border-color)] transition-all duration-300 ease-in-out flex flex-col
      ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 translate-x-0'}
      lg:translate-x-0 ${/* Mobile handling could be added here */ ''}
    `}
    >
      <div className="h-16 flex items-center justify-center border-b border-[var(--border-color)] px-4">
        <div className="flex items-center justify-center w-full">
          <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="PrakritiAI"
            className="h-10 md:h-12 w-auto max-w-full object-contain bg-transparent shrink-0"
          />
        </div>
      </div>

    <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
      <SidebarItem
        icon={LayoutDashboard}
        label="Dashboard"
        active={activeTab === 'Dashboard'}
        onClick={() => {
          setActiveTab('Dashboard');
          navigate('/dashboard/admin');
        }}
        collapsed={!isSidebarOpen}
      />
      <SidebarItem
        icon={CheckCircle}
        label="Contributions Handle"
        active={activeTab === 'Contributions'}
        onClick={() => {
          setActiveTab('Contributions');
          navigate('/dashboard/admin/contribution-handle');
        }}
        collapsed={!isSidebarOpen}
      />
      <SidebarItem
        icon={FileText}
        label="Articles"
        active={false}
        onClick={() => navigate('/articles')}
        collapsed={!isSidebarOpen}
      />
      <SidebarItem
        icon={MessageSquare}
        label="Blogs / Discussion"
        active={activeTab === 'Discussions'}
        onClick={() => setActiveTab('Discussions')}
        collapsed={!isSidebarOpen}
      />
    </nav>

      <div className="p-4 border-t border-[var(--border-color)] space-y-2">
        <SidebarItem
          icon={LogOut}
          label="Logout"
          active={false}
          onClick={handleLogout}
          collapsed={!isSidebarOpen}
        />
      </div>
    </aside>
  );
};

export default AdminSidebar;