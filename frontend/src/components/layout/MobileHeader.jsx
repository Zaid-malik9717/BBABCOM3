import React from 'react';
import { useApp } from '../../context/AppContext';

export default function MobileHeader({ title = 'Sarah' }) {
  const { darkMode, toggleDarkMode, setIsNewTaskOpen } = useApp();

  return (
    <header className="flex md:hidden justify-between items-center w-full px-4 py-3 bg-surface/95 dark:bg-inverse-surface/95 backdrop-blur border-b border-surface-container-high dark:border-outline/20 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary">
          <img
            alt="Sarah's Profile"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
          />
        </div>
        <div>
          <h1 className="font-bold text-base text-on-surface dark:text-inverse-on-surface leading-tight">
            {title}
          </h1>
          <p className="text-[11px] text-on-surface-variant dark:text-outline-variant">
            Productivity Hub
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          title="Add New Task"
          id="mobile-new-task-btn"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors text-on-surface-variant dark:text-outline-variant"
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined text-[20px]">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <button
          className="p-2 rounded-full hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors text-on-surface-variant dark:text-outline-variant relative"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
