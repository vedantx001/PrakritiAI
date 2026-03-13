import React, { useEffect, useState } from 'react';
import ThemeStyles from '../../../components/dashboard/admin/ThemeStyles';
import AdminSidebar from '../../../components/dashboard/admin/AdminSidebar';
import AdminNavbar from '../../../components/dashboard/admin/AdminNavbar';
import AdminOverview from '../../../components/dashboard/admin/AdminOverview';
import DiscussionsPageContent from '../../discussion/DiscussionsPageContent';
import ContributionHandle from './ContributionHandle';
import AdminProfile from './AdminProfile';
import { useTheme } from '../../../context/ThemeContext';

export default function AdminDashboard({ initialTab = 'Dashboard' }) {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const isDarkMode = theme === 'dark';

  const renderActiveTab = () => {
    if (activeTab === 'Dashboard') {
      return <AdminOverview onSelectTab={setActiveTab} />;
    }

    if (activeTab === 'Discussions') {
      return (
        <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
          <DiscussionsPageContent />
        </main>
      );
    }

    if (activeTab === 'Contributions') {
      return <ContributionHandle />;
    }

    if (activeTab === 'Profile') {
      return <AdminProfile />;
    }

    return (
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[var(--bg-primary)]">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">{activeTab}</h1>
          <p className="text-sm text-[var(--text-muted)]">This section UI is coming soon.</p>
        </div>
      </main>
    );
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden transition-colors duration-300 font-sans">
      <ThemeStyles />
      <AdminSidebar isSidebarOpen={isSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 
          ${isSidebarOpen ? 'ml-64' : 'ml-20'}
        `}
      >
        <AdminNavbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onProfileClick={() => setActiveTab('Profile')}
        />

        {renderActiveTab()}
      </div>
    </div>
  );
}