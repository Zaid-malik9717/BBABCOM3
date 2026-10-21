import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'submitted'
  const [timelinePeriod, setTimelinePeriod] = useState('week'); // 'week', 'month'
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS304');
  const [newInstructor, setNewInstructor] = useState('Prof. Davis');
  const [newDue, setNewDue] = useState('Oct 25, 2024, 11:59 PM');
  const [newWeight, setNewWeight] = useState('20%');

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.assignments.getAll();
      if (res && res.data) {
        setAssignments(res.data);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmitting = async (id, title) => {
    try {
      setSubmittingId(id);
      const res = await api.assignments.submit(id, 'Submitted via Scholara Hub');
      if (res && res.data) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === id ? res.data : a))
        );
        showNotification(`🎉 "${title}" has been successfully submitted!`);
      }
    } catch (err) {
      console.error('Failed to submit assignment:', err);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.assignments.create({
        title: newTitle.trim(),
        course: newCourse,
        instructor: newInstructor,
        due: newDue,
        weight: newWeight,
        urgent: true,
      });
      if (res && res.data) {
        setAssignments((prev) => [res.data, ...prev]);
        setIsAddModalOpen(false);
        setNewTitle('');
        showNotification(`Assignment "${res.data.title}" added to your tracker.`);
      }
    } catch (err) {
      console.error('Failed to add assignment:', err);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filtered = assignments.filter((a) => {
    if (activeTab === 'pending') return a.status === 'pending';
    if (activeTab === 'submitted') return a.status === 'submitted';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in text-sm font-medium">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface dark:text-inverse-on-surface">
            Assignments & Submissions
          </h1>
          <p className="text-sm text-on-surface-variant dark:text-outline-variant mt-1">
            Track coursework deadlines, project milestones, and grading rubrics.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 8 Cols */}
        <div className="xl:col-span-8 space-y-6">
          {/* Timeline View Section */}
          <section className="bg-surface dark:bg-surface-dim rounded-2xl shadow-z1 border border-surface-container-high dark:border-outline/20 overflow-hidden">
            <div className="p-4 border-b border-surface-container-high dark:border-outline/20 flex items-center justify-between bg-surface-container-low dark:bg-surface-container-highest">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  view_timeline
                </span>
                <h2 className="font-bold text-sm text-on-surface dark:text-inverse-on-surface">
                  Submission Timeline
                </h2>
              </div>

              <div className="flex gap-1 bg-surface dark:bg-surface-dim p-1 rounded-xl border border-surface-container-high dark:border-outline/20">
                <button
                  onClick={() => setTimelinePeriod('week')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    timelinePeriod === 'week'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant dark:text-outline-variant'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimelinePeriod('month')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    timelinePeriod === 'month'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant dark:text-outline-variant'
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>

            <div className="p-5 overflow-x-auto scrollbar-hide">
              <div className="min-w-[620px] space-y-4">
                <div className="grid grid-cols-5 gap-2 text-xs font-bold text-outline dark:text-outline-variant border-b border-surface-container-high dark:border-outline/20 pb-2">
                  <div>Mon 12</div>
                  <div>Tue 13 (Today)</div>
                  <div>Wed 14</div>
                  <div>Thu 15</div>
                  <div>Fri 16</div>
                </div>

                {/* Timeline Gantt Bars */}
                <div className="space-y-3 relative pt-2">
                  {assignments.slice(0, 3).map((item, idx) => {
                    const colors = [
                      'bg-primary text-on-primary',
                      'bg-secondary text-on-secondary',
                      'bg-emerald-600 text-white',
                    ];
                    return (
                      <div
                        key={item.id}
                        className="h-10 relative bg-surface-container-low dark:bg-surface-container-highest rounded-xl border border-surface-container-high dark:border-outline/20"
                      >
                        <div
                          className={`absolute ${
                            idx === 0
                              ? 'left-[10%] w-[45%]'
                              : idx === 1
                              ? 'left-[25%] w-[40%]'
                              : 'left-[45%] w-[50%]'
                          } top-1 bottom-1 ${
                            item.status === 'submitted'
                              ? 'bg-emerald-600 text-white'
                              : colors[idx % colors.length]
                          } rounded-lg flex items-center px-3 shadow-sm hover:shadow-md transition-all cursor-pointer text-xs font-semibold`}
                        >
                          <span className="truncate">
                            {item.course}: {item.title} (
                            {item.status === 'submitted' ? 'Submitted' : `${item.progress}%`})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Urgent & Due Soon */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-inverse-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px] filled">
                warning
              </span>
              Active & Urgent Coursework
            </h2>

            {loading ? (
              <div className="p-8 text-center text-sm text-on-surface-variant flex items-center justify-center gap-2 bg-surface dark:bg-surface-dim rounded-2xl border border-surface-container-high dark:border-outline/20">
                <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                <span>Loading coursework...</span>
              </div>
            ) : assignments.filter((a) => a.status === 'pending').length === 0 ? (
              <div className="p-6 bg-surface dark:bg-surface-dim rounded-2xl text-center text-xs text-on-surface-variant dark:text-outline-variant border border-surface-container-high dark:border-outline/20">
                No active or urgent coursework pending. You're completely caught up!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments
                  .filter((a) => a.status === 'pending')
                  .map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface dark:bg-surface-dim rounded-2xl p-5 shadow-z1 border border-secondary/20 hover:border-secondary/40 transition-all flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-bl-full pointer-events-none"></div>

                    <div className="space-y-3 relative z-10">
                      <div className="flex justify-between items-start">
                        <span className="bg-secondary/15 text-secondary text-xs font-bold px-2.5 py-1 rounded-md">
                          Due: {item.due}
                        </span>
                        <span className="text-xs font-semibold text-outline dark:text-outline-variant">
                          Weight: {item.weight}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-on-surface dark:text-inverse-on-surface leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant dark:text-outline-variant mt-0.5">
                          {item.course} • {item.instructor}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-on-surface-variant dark:text-outline-variant">
                            Draft Progress
                          </span>
                          <span className="text-secondary">{item.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-surface-container-high dark:bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary rounded-full transition-all duration-500"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 mt-4 border-t border-surface-container-high dark:border-outline/20 relative z-10">
                      <button
                        onClick={() => handleSubmitting(item.id, item.title)}
                        disabled={submittingId === item.id}
                        className="flex-1 py-2 bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">upload_file</span>
                        <span>{submittingId === item.id ? 'Submitting...' : 'Upload & Submit'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* All Coursework Table */}
          <section className="bg-surface dark:bg-surface-dim rounded-2xl p-5 shadow-z1 border border-surface-container-high dark:border-outline/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-container-high dark:border-outline/20 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-inverse-on-surface">
                All Coursework ({assignments.length})
              </h3>

              <div className="flex items-center gap-2">
                {['all', 'pending', 'submitted'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                      activeTab === tab
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-low dark:bg-surface-container-highest text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-outline dark:text-outline-variant border-b border-surface-container-high dark:border-outline/20 pb-2">
                    <th className="pb-2 font-semibold">Course</th>
                    <th className="pb-2 font-semibold">Assignment</th>
                    <th className="pb-2 font-semibold">Due Date</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold">Grade / Score</th>
                    <th className="pb-2 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high dark:divide-outline/10">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-on-surface-variant dark:text-outline-variant">
                        <span className="material-symbols-outlined animate-spin text-primary inline-block align-middle mr-2">progress_activity</span>
                        <span>Loading coursework table...</span>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-xs text-on-surface-variant dark:text-outline-variant">
                        No coursework matching this category.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-container-low/60 transition-colors">
                        <td className="py-3 font-bold text-primary dark:text-primary-fixed">
                          {item.course}
                        </td>
                        <td className="py-3 font-semibold text-on-surface dark:text-inverse-on-surface">
                          {item.title}
                        </td>
                        <td className="py-3 text-on-surface-variant dark:text-outline-variant">
                          {item.due}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              item.status === 'submitted'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-secondary/15 text-secondary'
                            }`}
                          >
                            {item.status === 'submitted' ? 'Submitted' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 font-medium text-on-surface-variant dark:text-outline-variant">
                          {item.grade || '—'}
                        </td>
                        <td className="py-3 text-right">
                          {item.status === 'pending' && (
                            <button
                              onClick={() => handleSubmitting(item.id, item.title)}
                              disabled={submittingId === item.id}
                              className="text-xs text-primary hover:underline font-semibold"
                            >
                              Mark Submit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right 4 Cols: Dropzone & Stats */}
        <div className="xl:col-span-4 space-y-6">
          {/* Quick Upload Dropzone */}
          <section className="bg-surface dark:bg-surface-dim rounded-2xl p-6 shadow-z1 border border-surface-container-high dark:border-outline/20 text-center space-y-4">
            <div
              onClick={() => setIsAddModalOpen(true)}
              className="border-2 border-dashed border-primary/40 rounded-2xl p-6 bg-primary/5 dark:bg-primary/10 hover:bg-primary/15 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">cloud_upload</span>
              </div>
              <h4 className="font-bold text-sm text-on-surface dark:text-inverse-on-surface">
                Create & Track Assignment
              </h4>
              <p className="text-xs text-on-surface-variant dark:text-outline-variant mt-1">
                Upload files or register upcoming submissions
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-xl shadow-sm"
              >
                Register Assignment
              </button>
            </div>
          </section>

          {/* Academic Velocity Impact */}
          <section className="bg-surface dark:bg-surface-dim rounded-2xl p-5 shadow-z1 border border-surface-container-high dark:border-outline/20 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-inverse-on-surface">
              Term GPA Impact
            </h3>
            <div className="p-4 rounded-xl bg-surface-container-low dark:bg-surface-container-highest border border-surface-container-high dark:border-outline/20 flex items-center justify-between">
              <div>
                <p className="text-xs text-on-surface-variant dark:text-outline-variant">
                  Current Weighted Grade
                </p>
                <h4 className="text-2xl font-black text-primary dark:text-primary-fixed">
                  3.88 / 4.0
                </h4>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                A
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal: New Assignment */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface dark:bg-inverse-surface w-full max-w-md rounded-2xl shadow-2xl border border-surface-container-high dark:border-outline/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-container-high dark:border-outline/20 flex items-center justify-between">
              <h3 className="font-bold text-lg text-on-surface dark:text-inverse-on-surface">
                Add Course Assignment
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Financial Portfolio Analysis"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                  Instructor
                </label>
                <input
                  type="text"
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                  Due Date
                </label>
                <input
                  type="text"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                />
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
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
