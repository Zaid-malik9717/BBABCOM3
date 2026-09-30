import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { setIsNewTaskOpen, darkMode, toggleDarkMode } = useApp();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'To-Do', path: '/todo', icon: 'checklist' },
    { name: 'Assignments', path: '/assignments', icon: 'assignment' },
    { name: 'Routine', path: '/routine', icon: 'schedule' },
    { name: 'Timetable', path: '/timetable', icon: 'calendar_month' },
    { name: 'Goals', path: '/goals', icon: 'ads_click' },
  ];

  return (
    <aside className="hidden md:flex flex-col py-lg px-md h-screen w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-surface-dim border-r border-surface-container-high dark:border-outline/20 z-40 transition-colors">
      {/* Profile Brand */}
      <div className="mb-8 flex items-center gap-3 px-3">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
            alt="Sarah's Profile"
            className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/40 shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-surface rounded-full"></span>
        </div>
        <div className="overflow-hidden">
          <div className="font-headline-md text-base font-bold text-primary dark:text-primary-fixed leading-snug truncate">
            Sarah Jenkins
          </div>
          <div className="font-label-sm text-xs text-outline dark:text-outline-variant truncate">
            BBA 3rd Semester
          </div>
        </div>
      </div>

      {/* New Task CTA */}
      <button
        onClick={() => setIsNewTaskOpen(true)}
        className="w-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm py-3 px-4 rounded-xl mb-6 shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 group active:scale-[0.98]"
        id="desktop-new-task-btn"
      >
        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">add</span>
        <span>New Task</span>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? 'text-primary dark:text-primary-fixed font-bold bg-primary/10 dark:bg-primary/20 border-r-4 border-primary dark:border-primary-fixed shadow-sm'
                  : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'filled text-primary dark:text-primary-fixed' : ''}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Dark Mode & System Status Footer */}
      <div className="pt-4 mt-auto border-t border-surface-container-high dark:border-outline/20 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-outline-variant">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online Sync</span>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          id="theme-toggle-btn"
        >
          <span className="material-symbols-outlined text-[20px]">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </aside>
  );
}
