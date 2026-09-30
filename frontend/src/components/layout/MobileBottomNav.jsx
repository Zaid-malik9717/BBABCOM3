import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MobileBottomNav() {
  const tabs = [
    { name: 'Home', path: '/dashboard', icon: 'home' },
    { name: 'To-Do', path: '/todo', icon: 'checklist' },
    { name: 'Assign', path: '/assignments', icon: 'assignment' },
    { name: 'Routine', path: '/routine', icon: 'schedule' },
    { name: 'Timetable', path: '/timetable', icon: 'calendar_month' },
    { name: 'Goals', path: '/goals', icon: 'ads_click' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-safe h-16 bg-surface/95 dark:bg-inverse-surface/95 backdrop-blur shadow-[0_-4px_16px_rgba(0,0,0,0.08)] border-t border-surface-container-high dark:border-outline/20">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-xl px-2.5 py-1 transition-all ${
              isActive
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant dark:text-outline-variant hover:text-on-surface'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isActive ? 'filled' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
