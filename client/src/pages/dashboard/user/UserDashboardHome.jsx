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
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const isDarkMode = theme === 'dark';

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden transition-colors duration-300 font-sans">
      <ThemeStyles />
      <UserSidebar isSidebarOpen={isSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 
          ${isSidebarOpen ? 'ml-64' : 'ml-20'}
        `}
      >
        <UserNavbar
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onProfileClick={() => setActiveTab('Profile')}
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