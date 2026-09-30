import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function DashboardPage() {
  const { tasks, toggleTaskCompleted, setIsNewTaskOpen } = useApp();
  const [statsData, setStatsData] = useState(null);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);

  // Fetch live dashboard analytics from backend
  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await api.dashboard.getStats();
        if (res && res.data && isMounted) {
          setStatsData(res.data);
        }
      } catch (err) {
        console.warn('Could not load dashboard stats from backend:', err);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, [tasks]);

  // Pomodoro countdown effect
  useEffect(() => {
    let timer = null;
    if (pomodoroActive && pomodoroTime > 0) {
      timer = setInterval(() => {
        setPomodoroTime((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0 && pomodoroActive) {
      setPomodoroActive(false);
      // Log session to backend
      api.routines.logFocusSession({ durationMinutes: 25, subject: 'Pomodoro Sprint' }).catch(console.error);
      setPomodoroTime(25 * 60);
    }
    return () => clearInterval(timer);
  }, [pomodoroActive, pomodoroTime]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent =
    tasks.length > 0
      ? Math.round((completedCount / tasks.length) * 100)
      : statsData?.metrics?.taskProgressPercent || 0;

  const streakDays = statsData?.metrics?.streakDays ?? 14;
  const profileName = statsData?.profile?.name || 'Sarah';
  const profileRole = statsData?.profile?.program || 'BBA 3rd Semester';

  const upcomingClasses = statsData?.todayClasses?.length
    ? statsData.todayClasses
    : [
        {
          code: 'CS501',
          title: 'Advanced Algorithms',
          time: '10:00 AM - 11:30 AM',
          room: 'Room 402, Tech Hub',
        },
        {
          code: 'ML405',
          title: 'Machine Learning Labs',
          time: '1:00 PM - 3:00 PM',
          room: 'Virtual Lab A',
        },
        {
          code: 'EC204',
          title: 'Macroeconomics Seminar',
          time: '3:30 PM - 5:00 PM',
          room: 'Hall B-2',
        },
      ];

  const highPriorityTasks = tasks.filter((t) => t.priority === 'high' || !t.completed).slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-on-surface dark:text-inverse-on-surface">
            Good Day, {profileName} · {profileRole}
          </h1>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant dark:text-outline-variant mt-1">
            Let's build momentum and make today exceptionally productive.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="md:hidden bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Task
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main 8-col Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Focus Hub Hero */}
          <section className="bg-surface dark:bg-surface-dim rounded-2xl p-6 shadow-z1 border border-surface-container-high dark:border-outline/20 relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 w-44 h-44 bg-primary/10 rounded-bl-full -z-0 pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="flex-1 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:text-primary-fixed">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  Focus Hub Active
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-on-surface dark:text-inverse-on-surface">
                  Daily Academic Velocity
                </h2>
                <p className="text-sm text-on-surface-variant dark:text-outline-variant">
                  You've maintained your focus streak for {streakDays} straight days!
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 bg-surface-container-low dark:bg-surface-container-highest px-3 py-1.5 rounded-xl border border-surface-container-high dark:border-outline/20 text-xs font-semibold">
                    <span className="material-symbols-outlined text-secondary text-[18px] filled">
                      local_fire_department
                    </span>
                    <span>{streakDays} Day Streak</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-surface-container-low dark:bg-surface-container-highest px-3 py-1.5 rounded-xl border border-surface-container-high dark:border-outline/20 text-xs font-semibold">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      task_alt
                    </span>
                    <span>
                      {completedCount}/{tasks.length} Tasks Done
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setPomodoroActive(!pomodoroActive)}
                    className="bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {pomodoroActive ? 'pause' : 'timer'}
                    </span>
                    <span>
                      {pomodoroActive
                        ? `Pause (${formatTimer(pomodoroTime)})`
                        : 'Start Focus Sprint (25m)'}
                    </span>
                  </button>
                  {pomodoroActive && (
                    <button
                      onClick={() => {
                        setPomodoroActive(false);
                        setPomodoroTime(25 * 60);
                      }}
                      className="text-xs text-outline hover:text-on-surface px-2 py-1 rounded-lg"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Radial Meter */}
              <div className="relative w-32 h-32 flex-shrink-0 self-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-surface-container-highest dark:text-outline/20"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <circle
                    className="text-primary transition-all duration-700 ease-out"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="42"
                    stroke="currentColor"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * progressPercent) / 100}
                    strokeLinecap="round"
                    strokeWidth="8"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-primary dark:text-primary-fixed">
                    {progressPercent}%
                  </span>
                  <span className="text-[11px] font-semibold text-on-surface-variant dark:text-outline-variant uppercase tracking-wider">
                    Score
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Up Next: Schedule Cards */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-on-surface dark:text-inverse-on-surface uppercase tracking-widest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                Up Next Today
              </h3>
              <Link
                to="/timetable"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
              >
                Full Timetable
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide snap-x">
              {upcomingClasses.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="snap-start shrink-0 w-72 bg-surface dark:bg-surface-dim border border-surface-container-high dark:border-outline/20 rounded-2xl p-4 shadow-z1 hover:shadow-z2 transition-all cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-primary/10 text-primary font-bold text-xs px-2.5 py-0.5 rounded-md">
                      {item.code}
                    </span>
                    <span className="text-xs text-outline font-medium">
                      {item.instructor || 'Staff'}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-on-surface dark:text-inverse-on-surface mb-1 truncate">
                    {item.name || item.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant dark:text-outline-variant mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {item.time}
                  </p>
                  <div className="flex items-center gap-1.5 border-t border-surface-container-high dark:border-outline/20 pt-2.5 text-xs text-on-surface-variant dark:text-outline-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      location_on
                    </span>
                    <span className="truncate">{item.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* High Priority Tasks */}
          <section className="bg-surface dark:bg-surface-dim rounded-2xl p-5 shadow-z1 border border-surface-container-high dark:border-outline/20 space-y-3">
            <div className="flex items-center justify-between border-b border-surface-container-high dark:border-outline/20 pb-3">
              <h3 className="text-xs font-bold text-on-surface dark:text-inverse-on-surface uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  warning
                </span>
                Priority Tasks
              </h3>
              <Link
                to="/todo"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
              >
                View All Tasks ({tasks.length})
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>

            <div className="space-y-2">
              {highPriorityTasks.length === 0 ? (
                <div className="text-center py-6 text-sm text-outline">
                  No pending tasks! All caught up.
                </div>
              ) : (
                highPriorityTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTaskCompleted(task.id)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-all cursor-pointer group border border-transparent hover:border-surface-container-high"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompleted(task.id);
                      }}
                      className="mt-0.5 text-outline dark:text-outline-variant group-hover:text-primary transition-colors focus:outline-none"
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          task.completed ? 'text-primary filled' : ''
                        }`}
                      >
                        {task.completed ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium leading-snug transition-all ${
                          task.completed
                            ? 'line-through text-outline dark:text-outline-variant'
                            : 'text-on-surface dark:text-inverse-on-surface'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-on-surface-variant dark:text-outline-variant flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">event</span>
                        {task.due}
                      </p>
                    </div>

                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-md self-center">
                      {task.subject}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right 4-col Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mini Calendar Widget */}
          <section className="bg-surface dark:bg-surface-dim rounded-2xl p-5 shadow-z1 border border-surface-container-high dark:border-outline/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-on-surface dark:text-inverse-on-surface">
                October 2024
              </h3>
              <div className="flex gap-1">
                <button className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant dark:text-outline-variant transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant dark:text-outline-variant transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-[11px] font-bold text-outline dark:text-outline-variant">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              <div className="p-2 text-outline-variant">29</div>
              <div className="p-2 text-outline-variant">30</div>
              <div className="p-2 hover:bg-surface-container-high rounded-full cursor-pointer">1</div>
              <div className="p-2 hover:bg-surface-container-high rounded-full cursor-pointer">2</div>
              <div className="p-2 hover:bg-surface-container-high rounded-full cursor-pointer">3</div>
              <div className="p-2 bg-primary text-on-primary font-bold rounded-full shadow-sm cursor-pointer">
                4
              </div>
              <div className="p-2 hover:bg-surface-container-high rounded-full cursor-pointer relative">
                5
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-secondary rounded-full"></span>
              </div>
              {[6, 7, 8, 9, 10, 11, 12].map((num) => (
                <div
                  key={num}
                  className="p-2 hover:bg-surface-container-high rounded-full cursor-pointer"
                >
                  {num}
                </div>
              ))}
            </div>
          </section>

          {/* Daily Habits & Energy Tracker */}
          <section className="bg-surface dark:bg-surface-dim rounded-2xl p-5 shadow-z1 border border-surface-container-high dark:border-outline/20 space-y-4">
            <div className="border-b border-surface-container-high dark:border-outline/20 pb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-on-surface dark:text-inverse-on-surface uppercase tracking-widest">
                Daily Habits & Energy
              </h3>
              <Link to="/routine" className="text-xs font-semibold text-primary hover:underline">
                View Tracker
              </Link>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="font-semibold text-on-surface dark:text-inverse-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">water_drop</span>
                    Hydration Target
                  </span>
                  <span className="font-bold text-primary">2.5 / 3.0 L</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high dark:bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="font-semibold text-on-surface dark:text-inverse-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">menu_book</span>
                    Academic Reading
                  </span>
                  <span className="font-bold text-secondary">45 / 60 Mins</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high dark:bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="font-semibold text-on-surface dark:text-inverse-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">fitness_center</span>
                    Physical Workout
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Completed</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high dark:bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
