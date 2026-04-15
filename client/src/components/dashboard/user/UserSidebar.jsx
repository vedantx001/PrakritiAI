import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  Heart,
  History,
  Edit3,
  Stethoscope,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import SidebarItem from './SidebarItem';

const UserSidebar = ({ isSidebarOpen, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-[var(--bg-card)] border-r border-[var(--border-color)] transition-all duration-300 ease-in-out flex flex-col
      ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:translate-x-0 md:w-20'}
    `}
    >
      <div className="h-16 flex items-center border-b border-[var(--border-color)] px-4">
        <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center w-full'}`}>
          <img
            src="/LogoNoBg.png"
            alt="PrakritiAI"
            className="w-10 h-10 md:w-12 md:h-12 scale-[2] translate-x-[2px] object-contain bg-transparent shrink-0"
          />
          {isSidebarOpen && (
            <span className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-main)] leading-none whitespace-nowrap">
              Prakriti<span className="text-[var(--text-brand)]">AI</span>
            </span>
          )}
        </div>
      </div>

    <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
      <SidebarItem
        icon={LayoutDashboard}
        label="Dashboard"
        active={activeTab === 'Dashboard'}
        onClick={() => {
          setActiveTab('Dashboard');
          navigate('/dashboard/user');
        }}
        collapsed={!isSidebarOpen}
      />
      <SidebarItem
        icon={Stethoscope}
        label="Symptom Analyzer"
        active={activeTab === 'Analyzer'}
        onClick={() => {
          setActiveTab('Analyzer');
          navigate('/dashboard/user/symptoms-analyzer');
        }}
        collapsed={!isSidebarOpen}
      />
      <SidebarItem
        icon={BookOpen}
        label="Articles"
        active={false}
        onClick={() => navigate('/articles')}
        collapsed={!isSidebarOpen}
      />
      <SidebarItem
        icon={MessageCircle}
        label="Blogs & Discuss"
        active={activeTab === 'Discussions'}
        onClick={() => setActiveTab('Discussions')}
        collapsed={!isSidebarOpen}
      />
      <SidebarItem
        icon={Heart}
        label="Saved Library"
        active={activeTab === 'Saved'}
        onClick={() => {
          setActiveTab('Saved');
          navigate('/dashboard/user/saved');
        }}
        collapsed={!isSidebarOpen}
      />
      <SidebarItem
        icon={History}
        label="My History"
        active={activeTab === 'History'}
        onClick={() => {
          setActiveTab('History');
          navigate('/dashboard/user/history');
        }}
        collapsed={!isSidebarOpen}
      />
      <SidebarItem
        icon={Edit3}
        label="My Contributions"
        active={activeTab === 'Contributions'}
        onClick={() => {
          setActiveTab('Contributions');
          navigate('/dashboard/user/contributions');
        }}
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

export default UserSidebar;