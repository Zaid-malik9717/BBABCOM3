import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function GoalsPage() {
  const [milestones, setMilestones] = useState([]);
  const [badges, setBadges] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('Academic');
  const [newDue, setNewDue] = useState('Next Month');
  const [newProgress, setNewProgress] = useState('0%');

  useEffect(() => {
    async function loadGoals() {
      try {
        const [milestonesRes, badgesRes] = await Promise.all([
          api.goals.getMilestones(),
          api.goals.getBadges(),
        ]);
        if (milestonesRes?.data) setMilestones(milestonesRes.data);
        if (badgesRes?.data) setBadges(badgesRes.data);
      } catch (err) {
        console.error('Failed to load goals/badges:', err);
      }
    }
    loadGoals();
  }, []);

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.goals.createMilestone({
        title: newTitle.trim(),
        tag: newTag,
        due: newDue,
        progress: newProgress,
        percent: 0,
      });
      if (res?.data) {
        setMilestones((prev) => [...prev, res.data]);
        setIsAddModalOpen(false);
        setNewTitle('');
      }
    } catch (err) {
      console.error('Failed to create milestone:', err);
    }
  };

  const handleIncrementProgress = async (id, currentPercent) => {
    const nextPercent = Math.min(100, (currentPercent || 0) + 15);
    try {
      const res = await api.goals.updateMilestone(id, {
        percent: nextPercent,
        progress: `${nextPercent}%`,
      });
      if (res?.data) {
        setMilestones((prev) =>
          prev.map((m) => (m.id === id ? res.data : m))
        );
      }
    } catch (err) {
      console.error('Failed to increment milestone:', err);
    }
  };

  const handleDeleteMilestone = async (id, e) => {
    e.stopPropagation();
    try {
      await api.goals.deleteMilestone(id);
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete milestone:', err);
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface dark:text-inverse-on-surface">
            Goals & Academic Achievements
          </h1>
          <p className="text-sm text-on-surface-variant dark:text-outline-variant mt-1">
            Track term GPA velocity, active milestones, and student achievement badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-on-primary shadow-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">stars</span>
            Level 12 Scholar
          </span>
        </div>
      </div>

      {/* Bento KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GPA Circular Progress Card */}
        <div className="bg-surface dark:bg-surface-dim rounded-2xl p-6 shadow-z1 border border-surface-container-high dark:border-outline/20 relative overflow-hidden group hover:shadow-z2 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[72px] text-primary">school</span>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-outline-variant mb-4">
            Cumulative GPA
          </h3>

          <div className="flex items-center justify-between">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="transform -rotate-90 w-24 h-24" viewBox="0 0 96 96">
                <circle
                  className="text-surface-container-highest dark:text-outline/20"
                  cx="48"
                  cy="48"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-primary transition-all duration-1000 ease-out"
                  cx="48"
                  cy="48"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="238.7"
                  strokeDashoffset={238.7 - 238.7 * 0.95}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-on-surface dark:text-inverse-on-surface">
                  3.88
                </span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="text-xs font-bold uppercase text-on-surface-variant dark:text-outline-variant">
                Target GPA
              </p>
              <p className="text-2xl font-black text-primary dark:text-primary-fixed">4.00</p>
              <div className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +0.18 Term
              </div>
            </div>
          </div>
        </div>

        {/* Study Hours Card */}
        <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 shadow-z1 relative overflow-hidden flex flex-col justify-between group hover:shadow-z2 transition-all">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-primary-container/80">
              Weekly Study Hours
            </h3>
            <span className="material-symbols-outlined text-[24px]">timer</span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">28.5</span>
              <span className="text-sm font-semibold opacity-80">/ 35 hrs goal</span>
            </div>
            <p className="text-xs opacity-75 mt-1">6.5 hrs remaining to weekly milestone</p>
          </div>

          <div className="w-full h-2.5 bg-on-primary-container/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: '81%' }}
            ></div>
          </div>
        </div>

        {/* On-Time Rate Card */}
        <div className="bg-surface dark:bg-surface-dim rounded-2xl p-6 shadow-z1 border border-surface-container-high dark:border-outline/20 flex flex-col justify-between group hover:shadow-z2 transition-all">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-outline-variant">
              On-Time Submission Rate
            </h3>
            <div className="p-1.5 bg-secondary/10 rounded-lg text-secondary">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-on-surface dark:text-inverse-on-surface">
                96%
              </span>
              <span className="text-xs text-outline dark:text-outline-variant">this semester</span>
            </div>

            {/* Mini Bar Chart */}
            <div className="flex items-end h-12 gap-2 mt-2">
              {[
                { label: 'W1', height: '80%' },
                { label: 'W2', height: '95%' },
                { label: 'W3', height: '70%' },
                { label: 'W4', height: '100%' },
                { label: 'W5', height: '96%', active: true },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-surface-container-high dark:bg-surface-container-highest rounded-t h-10 relative flex items-end">
                    <div
                      className={`w-full rounded-t transition-all ${
                        bar.active ? 'bg-primary' : 'bg-primary/40'
                      }`}
                      style={{ height: bar.height }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-outline dark:text-outline-variant">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Active Milestones & Badges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Milestones Left 6 cols */}
        <div className="lg:col-span-6 bg-surface dark:bg-surface-dim rounded-2xl shadow-z1 border border-surface-container-high dark:border-outline/20 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-surface-container-high dark:border-outline/20 flex justify-between items-center bg-surface-container-low dark:bg-surface-container-highest">
            <h2 className="font-bold text-sm text-on-surface dark:text-inverse-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
              Active Milestones ({milestones.length})
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add Goal
            </button>
          </div>

          <div className="divide-y divide-surface-container-high dark:divide-outline/10 p-2">
            {milestones.map((item) => (
              <div
                key={item.id}
                onClick={() => handleIncrementProgress(item.id, item.percent)}
                className="p-4 hover:bg-surface-container-low/50 dark:hover:bg-surface-container-highest/50 rounded-xl transition-colors space-y-2 cursor-pointer group"
                title="Click to advance progress by 15%"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-bold rounded mb-1">
                      {item.tag}
                    </span>
                    <h4 className="text-sm font-semibold text-on-surface dark:text-inverse-on-surface">
                      {item.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface-variant dark:text-outline-variant">
                      {item.percent}%
                    </span>
                    <button
                      onClick={(e) => handleDeleteMilestone(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 hover:text-red-500 transition-all"
                      title="Delete goal"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                <div className="w-full h-2 bg-surface-container-high dark:bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-outline dark:text-outline-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">schedule</span>
                  {item.due}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Right 6 cols */}
        <div className="lg:col-span-6 bg-surface dark:bg-surface-dim rounded-2xl p-5 shadow-z1 border border-surface-container-high dark:border-outline/20 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-surface-container-high dark:border-outline/20 pb-3 mb-4">
            <h2 className="font-bold text-sm text-on-surface dark:text-inverse-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">military_tech</span>
              Badges & Achievements
            </h2>
            <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
              {unlockedCount} / {badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border text-center transition-all relative group cursor-pointer ${
                  badge.unlocked
                    ? 'bg-surface-container-low dark:bg-surface-container-highest border-surface-container-high dark:border-outline/20 hover:shadow-md'
                    : 'bg-surface/40 dark:bg-surface-dim/40 border-dashed border-outline-variant/50 opacity-60'
                }`}
              >
                {badge.isNew && (
                  <span className="absolute -top-1.5 -right-1.5 bg-secondary text-on-secondary text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                    NEW
                  </span>
                )}

                <div
                  className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 ${
                    badge.color || 'bg-primary/10 text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {badge.unlocked ? badge.icon : 'lock'}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-on-surface dark:text-inverse-on-surface truncate">
                  {badge.name}
                </h4>
                <p className="text-[10px] text-outline dark:text-outline-variant mt-0.5 line-clamp-1">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Milestone Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface dark:bg-inverse-surface w-full max-w-md rounded-2xl shadow-2xl border border-surface-container-high dark:border-outline/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-container-high dark:border-outline/20 flex items-center justify-between">
              <h3 className="font-bold text-lg text-on-surface dark:text-inverse-on-surface">
                Create Milestone Goal
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 5 Research Papers"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                    Target Due Date
                  </label>
                  <input
                    type="text"
                    value={newDue}
                    onChange={(e) => setNewDue(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-on-surface-variant hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary text-xs font-semibold rounded-xl shadow-sm"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
