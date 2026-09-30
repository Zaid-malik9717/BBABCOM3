import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import NewTaskModal from './NewTaskModal';

export default function AppLayout() {
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard':
      case '/':
        return 'Sarah';
      case '/todo':
        return 'To-Do List';
      case '/assignments':
        return 'Assignments';
      case '/routine':
        return 'Routine Tracker';
      case '/timetable':
        return 'Class Timetable';
      case '/goals':
        return 'Goals & Milestones';
      default:
        return 'Sarah';
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen pb-20 md:pb-8">
        {/* Mobile Header */}
        <MobileHeader title={getPageTitle(location.pathname)} />

        {/* Page Content */}
        <main className="flex-1 px-4 md:px-8 pt-4 md:pt-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Interactive New Task Modal */}
      <NewTaskModal />
    </div>
  );
}
