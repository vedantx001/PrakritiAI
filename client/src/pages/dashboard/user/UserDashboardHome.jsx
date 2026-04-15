import React, { useState, useEffect } from 'react';
import ThemeStyles from '../../../components/dashboard/user/ThemeStyles';
import UserSidebar from '../../../components/dashboard/user/UserSidebar';
import UserNavbar from '../../../components/dashboard/user/UserNavbar';
import UserOverview from '../../../components/dashboard/user/UserOverview';
import SymptomsAnalyzer from './SymptomsAnalyzer';
import DiscussionsPageContent from '../../discussion/DiscussionsPageContent';
import UserProfile from './UserProfile';
import ContributionHistory from './ContributionHistory';
import SavedLibrary from './SavedLibrary';
import HealthHistory from './HealthHistory';
import { useTheme } from '../../../context/ThemeContext';

export default function UserDashboard({ initialTab = 'Dashboard' }) {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const isDarkMode = theme === 'dark';

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-x-hidden transition-colors duration-300 font-sans relative">
      <ThemeStyles />
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <UserSidebar 
        isSidebarOpen={isSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0
          ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}
          ml-0
        `}
      >
        <UserNavbar
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onProfileClick={() => handleTabChange('Profile')}
        />

        {activeTab === 'Analyzer' ? (
          <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
            <SymptomsAnalyzer />
          </main>
        ) : activeTab === 'Discussions' ? (
          <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
            <DiscussionsPageContent />
          </main>
        ) : activeTab === 'Saved' ? (
          <SavedLibrary />
        ) : activeTab === 'History' ? (
          <HealthHistory />
        ) : activeTab === 'Contributions' ? (
          <ContributionHistory />
        ) : activeTab === 'Profile' ? (
          <UserProfile />
        ) : (
          <UserOverview
            onSelectTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
}