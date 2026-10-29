import React, { useState, useEffect } from 'react';
import { CollegeProvider, useCollege } from './context/CollegeContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/home/LandingPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdvisorDashboard } from './components/advisor/AdvisorDashboard';
import { HODDashboard } from './components/hod/HODDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AIChatbot } from './components/common/AIChatbot';
import { Sparkles } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { currentUser, activeRole } = useCollege();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // When active role changes, return to overview tab
  useEffect(() => {
    setActiveTab('overview');
  }, [activeRole]);

  if (!currentUser) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenChat={() => setShowChatModal(true)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Role-Specific Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Workspace Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeRole === 'student' && (
              <StudentDashboard activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
            )}
            {activeRole === 'advisor' && (
              <AdvisorDashboard activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
            )}
            {activeRole === 'hod' && (
              <HODDashboard activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
            )}
            {activeRole === 'admin' && (
              <AdminDashboard activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
            )}
          </div>
        </main>
      </div>

      {/* Floating AI Assistant Trigger for quick help */}
      {!showChatModal && (
        <button
          onClick={() => setShowChatModal(true)}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
          title="Open CampusConnect AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold">
            Campus AI Assistant
          </span>
        </button>
      )}

      {/* Interactive AI Chatbot Modal */}
      {showChatModal && (
        <AIChatbot isModal onClose={() => setShowChatModal(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <CollegeProvider>
      <DashboardContent />
    </CollegeProvider>
  );
}
