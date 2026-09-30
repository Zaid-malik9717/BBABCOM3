import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function NewTaskModal() {
  const { isNewTaskOpen, setIsNewTaskOpen, addTask } = useApp();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Economics');
  const [due, setDue] = useState('Today, 6:00 PM');
  const [priority, setPriority] = useState('high');
  const [tag, setTag] = useState('Assignment');

  if (!isNewTaskOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title,
      subject,
      due,
      priority,
      tag,
    });
    setTitle('');
    setIsNewTaskOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface dark:bg-inverse-surface w-full max-w-md rounded-2xl shadow-2xl border border-surface-container-high dark:border-outline/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-container-high dark:border-outline/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed">add_task</span>
            <h3 className="font-bold text-lg text-on-surface dark:text-inverse-on-surface">
              Create New Task
            </h3>
          </div>
          <button
            onClick={() => setIsNewTaskOpen(false)}
            className="p-1 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant dark:text-outline-variant mb-1.5 uppercase tracking-wider">
              Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Complete Statistics Regression Analysis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-highest dark:border-outline/30 bg-surface-container-lowest dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant dark:text-outline-variant mb-1.5 uppercase tracking-wider">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-surface-container-highest dark:border-outline/30 bg-surface-container-lowest dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="Economics">Economics</option>
                <option value="Management">Management</option>
                <option value="Accounting">Accounting</option>
                <option value="Marketing">Marketing</option>
                <option value="Statistics">Statistics</option>
                <option value="Personal">Personal Routine</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant dark:text-outline-variant mb-1.5 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-surface-container-highest dark:border-outline/30 bg-surface-container-lowest dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant dark:text-outline-variant mb-1.5 uppercase tracking-wider">
                Due Date / Time
              </label>
              <input
                type="text"
                placeholder="Tomorrow, 5:00 PM"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-surface-container-highest dark:border-outline/30 bg-surface-container-lowest dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
              </input>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant dark:text-outline-variant mb-1.5 uppercase tracking-wider">
                Category Tag
              </label>
              <input
                type="text"
                placeholder="Urgent, Reading, Project"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-surface-container-highest dark:border-outline/30 bg-surface-container-lowest dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-surface-container-high dark:border-outline/20">
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary shadow-sm transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
