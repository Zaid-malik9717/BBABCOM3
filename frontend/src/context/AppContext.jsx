import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [viewMode, setViewMode] = useState('responsive'); // 'responsive', 'desktop', 'mobile'
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    try {
      setLoadingTasks(true);
      const res = await api.tasks.getAll();
      if (res && res.data) {
        setTasks(res.data);
      }
      setTasksError(null);
    } catch (err) {
      console.warn('Backend unavailable, using local task cache:', err.message);
      setTasksError(err.message);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const toggleTaskCompleted = async (taskId) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      const res = await api.tasks.toggle(taskId);
      if (res && res.data) {
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? res.data : task))
        );
      }
    } catch (err) {
      console.error('Failed to sync toggle with backend:', err);
      // Revert if error
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const addTask = async (newTask) => {
    // Optimistic temporary task
    const tempId = Date.now();
    const optimisticTask = {
      id: tempId,
      completed: false,
      priority: 'medium',
      ...newTask,
    };
    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const res = await api.tasks.create(newTask);
      if (res && res.data) {
        setTasks((prev) =>
          prev.map((t) => (t.id === tempId ? res.data : t))
        );
        return res.data;
      }
    } catch (err) {
      console.error('Failed to save task to backend:', err);
      // Keep optimistic or handle error
    }
    return optimisticTask;
  };

  const deleteTask = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await api.tasks.delete(taskId);
    } catch (err) {
      console.error('Failed to delete task on backend:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        isNewTaskOpen,
        setIsNewTaskOpen,
        viewMode,
        setViewMode,
        tasks,
        loadingTasks,
        tasksError,
        refreshTasks: fetchTasks,
        toggleTaskCompleted,
        addTask,
        deleteTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
