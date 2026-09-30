import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function RoutineTrackerPage() {
  const [timerSeconds, setTimerSeconds] = useState(45 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [habits, setHabits] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitTime, setNewHabitTime] = useState('08:00 AM');
  const [newHabitCategory, setNewHabitCategory] = useState('Study');
  const [isAddingHabit, setIsAddingHabit] = useState(false);

  // Fetch habits and timeblocks from backend
  useEffect(() => {
    async function loadData() {
      try {
        const [habitsRes, blocksRes] = await Promise.all([
          api.routines.getHabits(),
          api.routines.getTimeBlocks(),
        ]);
        if (habitsRes?.data) setHabits(habitsRes.data);
        if (blocksRes?.data) setTimeBlocks(blocksRes.data);
      } catch (err) {
        console.error('Failed to load routines data:', err);
      }
    }
    loadData();
  }, []);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      api.routines
        .logFocusSession({
          durationMinutes: 45,
          subject: 'Routine Focus Block',
        })
        .catch(console.error);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const toggleHabit = async (id) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );

    try {
      const res = await api.routines.toggleHabit(id);
      if (res?.data) {
        setHabits((prev) =>
          prev.map((h) => (h.id === id ? res.data : h))
        );
      }
    } catch (err) {
      console.error('Failed to toggle habit:', err);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    try {
      const res = await api.routines.createHabit({
        title: newHabitTitle.trim(),
        time: newHabitTime,
        category: newHabitCategory,
      });
      if (res?.data) {
        setHabits((prev) => [...prev, res.data]);
        setNewHabitTitle('');
        setIsAddingHabit(false);
      }
    } catch (err) {
      console.error('Failed to create habit:', err);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(45 * 60);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface dark:text-inverse-on-surface">
            Daily Routine & Habits
          </h1>
          <p className="text-sm text-on-surface-variant dark:text-outline-variant mt-1">
            Build discipline with structured time blocks, habit checklists, and focus sprints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Schedule On Track
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: Time Blocks */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface dark:bg-surface-dim rounded-2xl p-5 shadow-z1 border border-surface-container-high dark:border-outline/20">
            <div className="flex items-center justify-between border-b border-surface-container-high dark:border-outline/20 pb-3 mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-inverse-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  view_timeline
                </span>
                Scheduled Time Blocks ({timeBlocks.length})
              </h2>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  Deep Work
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Lecture
                </span>
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Wellness
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {timeBlocks.map((block) => (
                <div
                  key={block.id}
                  className={`p-4 rounded-2xl border-l-4 ${block.color} shadow-sm transition-all hover:translate-x-1 cursor-pointer flex items-start justify-between gap-4`}
                >
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[22px] mt-0.5">
                      {block.icon || 'schedule'}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm leading-snug">{block.title}</h4>
                      <p className="text-xs opacity-80 mt-0.5">{block.type}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold tracking-tight bg-surface/80 dark:bg-inverse-surface/80 px-2.5 py-1 rounded-lg shadow-xs">
                    {block.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 cols: Focus Timer & Habit Streak */}
        <div className="lg:col-span-4 space-y-6">
          {/* Focus Timer Widget */}
          <section className="bg-surface dark:bg-surface-dim rounded-2xl p-6 shadow-z1 border border-surface-container-high dark:border-outline/20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-inverse-on-surface">
                Sprint Pomodoro
              </h3>
              <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
            </div>

            <div className="my-6">
              <div className="text-5xl font-black text-primary dark:text-primary-fixed tracking-tight">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-xs text-on-surface-variant dark:text-outline-variant mt-2 font-medium">
                {timerRunning ? 'Deep Focus Session in Progress' : 'Ready to immerse in focus'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetTimer}
                className="w-11 h-11 rounded-full bg-surface-container-high dark:bg-surface-container-highest text-on-surface-variant dark:text-outline-variant flex items-center justify-center hover:bg-primary/20 transition-all active:scale-95"
                title="Reset Timer"
              >
                <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              </button>

              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="w-14 h-14 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center shadow-lg transition-all active:scale-90"
                title={timerRunning ? 'Pause Session' : 'Start Focus Session'}
              >
                <span className="material-symbols-outlined text-[28px]">
                  {timerRunning ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => setTimerSeconds(25 * 60)}
                className="w-11 h-11 rounded-full bg-surface-container-high dark:bg-surface-container-highest text-on-surface-variant dark:text-outline-variant flex items-center justify-center hover:bg-primary/20 transition-all active:scale-95"
                title="25 min Pomodoro"
              >
                <span className="material-symbols-outlined text-[20px]">speed</span>
              </button>
            </div>
          </section>

          {/* Daily Habit Streak List */}
          <section className="bg-surface dark:bg-surface-dim rounded-2xl p-5 shadow-z1 border border-surface-container-high dark:border-outline/20 space-y-3">
            <div className="flex items-center justify-between border-b border-surface-container-high dark:border-outline/20 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-inverse-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px] filled">
                  local_fire_department
                </span>
                Habit Checklist
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary">
                  {habits.filter((h) => h.completed).length}/{habits.length} Done
                </span>
                <button
                  onClick={() => setIsAddingHabit(!isAddingHabit)}
                  className="p-1 rounded text-primary hover:bg-primary/10 transition-colors"
                  title="Add Habit"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>

            {isAddingHabit && (
              <form onSubmit={handleCreateHabit} className="p-3 bg-surface-container-low rounded-xl space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="New habit title..."
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-surface-container-highest bg-surface text-on-surface"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="07:00 AM"
                    value={newHabitTime}
                    onChange={(e) => setNewHabitTime(e.target.value)}
                    className="w-1/2 px-2.5 py-1.5 rounded-lg border border-surface-container-highest bg-surface text-on-surface"
                  />
                  <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value)}
                    className="w-1/2 px-2.5 py-1.5 rounded-lg border border-surface-container-highest bg-surface text-on-surface"
                  >
                    <option value="Study">Study</option>
                    <option value="Health">Health</option>
                    <option value="Mindset">Mindset</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingHabit(false)}
                    className="px-2 py-1 text-on-surface-variant hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-primary text-on-primary rounded-lg font-semibold"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-all cursor-pointer border border-surface-container-high dark:border-outline/20"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleHabit(habit.id);
                      }}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        habit.completed
                          ? 'bg-primary text-on-primary'
                          : 'border-2 border-outline-variant dark:border-outline text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          habit.completed
                            ? 'line-through text-outline dark:text-outline-variant'
                            : 'text-on-surface dark:text-inverse-on-surface'
                        }`}
                      >
                        {habit.title}
                      </p>
                      <span className="text-[10px] text-on-surface-variant dark:text-outline-variant">
                        {habit.time}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container-high dark:bg-surface-container-highest text-on-surface-variant dark:text-outline-variant">
                    {habit.category}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
