import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function TodoListPage() {
  const { tasks, toggleTaskCompleted, addTask, deleteTask } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [quickInput, setQuickInput] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'high', 'completed'
  const [viewMode, setViewMode] = useState('list'); // 'list', 'board'

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    addTask({
      title: quickInput,
      subject: 'Economics',
      due: 'Today, 8:00 PM',
      priority: 'high',
      tag: 'General',
    });
    setQuickInput('');
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'high') return matchesSearch && task.priority === 'high';
    if (activeFilter === 'completed') return matchesSearch && task.completed;
    if (activeFilter === 'active') return matchesSearch && !task.completed;
    return matchesSearch;
  });

  const todayTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface dark:text-inverse-on-surface">
            To-Do List
          </h1>
          <p className="text-sm text-on-surface-variant dark:text-outline-variant mt-1">
            Organize assignments, study tasks, and daily action items.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search tasks or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface dark:bg-surface-dim border border-surface-container-high dark:border-outline/20 rounded-xl text-sm text-on-surface dark:text-inverse-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>
      </div>

      {/* Quick Add Bar */}
      <form
        onSubmit={handleQuickAdd}
        className="relative w-full rounded-2xl bg-surface dark:bg-surface-dim border border-surface-container-high dark:border-outline/20 shadow-z1 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all p-1.5 flex items-center"
      >
        <span className="material-symbols-outlined text-primary text-[22px] ml-3 mr-2">
          add_circle
        </span>
        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder="Add task e.g. 'Read Chapter 4 for CS-501 by tomorrow at 5pm'..."
          className="flex-1 bg-transparent border-none py-2 px-1 focus:ring-0 text-sm text-on-surface dark:text-inverse-on-surface placeholder-outline dark:placeholder-outline-variant"
        />
        <button
          type="submit"
          disabled={!quickInput.trim()}
          className="bg-primary hover:bg-primary-container disabled:opacity-40 text-on-primary font-semibold text-xs px-4 py-2 rounded-xl transition-all mr-1"
        >
          Add Task
        </button>
      </form>

      {/* Filter Chips & View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'all', label: 'All Tasks', icon: 'format_list_bulleted' },
            { id: 'active', label: 'In Progress', icon: 'pending' },
            { id: 'high', label: 'High Priority', icon: 'flag' },
            { id: 'completed', label: 'Completed', icon: 'task_alt' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === chip.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface dark:bg-surface-dim border border-surface-container-high dark:border-outline/20 text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-surface-container-high dark:bg-surface-container-highest rounded-xl p-1 text-xs">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-semibold ${
              viewMode === 'list'
                ? 'bg-surface dark:bg-inverse-surface text-primary shadow-sm'
                : 'text-on-surface-variant dark:text-outline-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_list</span>
            List
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-semibold ${
              viewMode === 'board'
                ? 'bg-surface dark:bg-inverse-surface text-primary shadow-sm'
                : 'text-on-surface-variant dark:text-outline-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_column</span>
            Board
          </button>
        </div>
      </div>

      {/* Task Views */}
      {viewMode === 'list' ? (
        <div className="space-y-6">
          {/* Active Tasks Group */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-surface-container-high dark:border-outline/20 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-outline-variant flex items-center gap-2">
                Active Items
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[11px] font-bold">
                  {todayTasks.length}
                </span>
              </h3>
            </div>

            {todayTasks.length === 0 ? (
              <div className="bg-surface dark:bg-surface-dim rounded-2xl p-8 text-center border border-dashed border-surface-container-high dark:border-outline/30">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
                  task_alt
                </span>
                <p className="text-sm font-semibold text-on-surface dark:text-inverse-on-surface">
                  All caught up!
                </p>
                <p className="text-xs text-on-surface-variant dark:text-outline-variant mt-1">
                  No active tasks matching this filter.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-surface dark:bg-surface-dim rounded-2xl p-4 shadow-z1 hover:shadow-z2 border border-surface-container-high dark:border-outline/20 transition-all flex items-start gap-4 group"
                  >
                    <button
                      onClick={() => toggleTaskCompleted(task.id)}
                      className="mt-0.5 w-5 h-5 rounded-md border-2 border-outline-variant dark:border-outline hover:border-primary flex items-center justify-center transition-colors text-primary"
                    >
                      <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-60 transition-opacity">
                        check
                      </span>
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-semibold text-sm text-on-surface dark:text-inverse-on-surface">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                              task.priority === 'high'
                                ? 'bg-secondary/15 text-secondary'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {task.subject}
                          </span>
                          <span className="bg-surface-container-high dark:bg-surface-container-highest text-on-surface-variant dark:text-outline-variant text-[11px] font-medium px-2 py-0.5 rounded-md">
                            {task.tag}
                          </span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-outline hover:text-red-500 rounded transition-all"
                            title="Delete task"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant dark:text-outline-variant">
                        <span className="flex items-center gap-1 font-medium text-secondary">
                          <span className="material-symbols-outlined text-[15px]">flag</span>
                          {task.due}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">schedule</span>
                          45 mins focus
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Group */}
          {completedTasks.length > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-surface-container-high dark:border-outline/20 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-outline-variant flex items-center gap-2">
                  Completed Tasks
                  <span className="bg-surface-container-high dark:bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full text-[11px]">
                    {completedTasks.length}
                  </span>
                </h3>
              </div>

              <div className="space-y-2 opacity-80">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-surface/60 dark:bg-surface-dim/60 rounded-2xl p-3.5 border border-surface-container-high dark:border-outline/20 flex items-center gap-4 group"
                  >
                    <button
                      onClick={() => toggleTaskCompleted(task.id)}
                      className="w-5 h-5 rounded-md bg-primary text-on-primary flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                    <span className="flex-1 text-sm line-through text-outline dark:text-outline-variant">
                      {task.title}
                    </span>
                    <span className="text-xs text-outline-variant dark:text-outline">{task.subject}</span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-outline hover:text-red-500 rounded transition-all"
                      title="Delete task"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Board / Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface dark:bg-surface-dim rounded-2xl p-4 border border-surface-container-high dark:border-outline/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high dark:border-outline/20">
              <h4 className="text-xs font-bold uppercase text-on-surface dark:text-inverse-on-surface">
                To Do ({todayTasks.length})
              </h4>
            </div>
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="bg-surface-container-low dark:bg-surface-container-highest p-3 rounded-xl border border-surface-container-high dark:border-outline/20 shadow-sm space-y-2 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {task.subject}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleTaskCompleted(task.id)}
                      className="text-outline-variant hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-outline-variant hover:text-red-500"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-on-surface dark:text-inverse-on-surface">
                  {task.title}
                </p>
                <span className="text-[11px] text-secondary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">event</span>
                  {task.due}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-surface dark:bg-surface-dim rounded-2xl p-4 border border-surface-container-high dark:border-outline/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high dark:border-outline/20">
              <h4 className="text-xs font-bold uppercase text-on-surface dark:text-inverse-on-surface">
                In Review (1)
              </h4>
            </div>
            <div className="bg-surface-container-low dark:bg-surface-container-highest p-3 rounded-xl border border-surface-container-high dark:border-outline/20 shadow-sm space-y-2">
              <span className="text-xs font-semibold bg-secondary/10 text-secondary px-2 py-0.5 rounded">
                Management
              </span>
              <p className="text-sm font-medium text-on-surface dark:text-inverse-on-surface">
                Team Presentation Slide Deck
              </p>
              <span className="text-[11px] text-on-surface-variant font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">group</span>
                Waiting for team feedback
              </span>
            </div>
          </div>

          <div className="bg-surface dark:bg-surface-dim rounded-2xl p-4 border border-surface-container-high dark:border-outline/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high dark:border-outline/20">
              <h4 className="text-xs font-bold uppercase text-on-surface dark:text-inverse-on-surface">
                Done ({completedTasks.length})
              </h4>
            </div>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-surface-container-low dark:bg-surface-container-highest p-3 rounded-xl border border-surface-container-high dark:border-outline/20 shadow-sm space-y-1 opacity-75 group flex justify-between items-center"
              >
                <div>
                  <span className="text-xs font-semibold text-outline">{task.subject}</span>
                  <p className="text-sm font-medium line-through text-outline dark:text-outline-variant">
                    {task.title}
                  </p>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-outline hover:text-red-500"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
