import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [schedule, setSchedule] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM - 11:30 AM');
  const [newRoom, setNewRoom] = useState('Room 402 • Tech Hub');
  const [newInstructor, setNewInstructor] = useState('Prof. Davis');

  const days = [
    { key: 'Mon', name: 'Monday', date: 'Oct 23' },
    { key: 'Tue', name: 'Tuesday', date: 'Oct 24' },
    { key: 'Wed', name: 'Wednesday', date: 'Oct 25' },
    { key: 'Thu', name: 'Thursday', date: 'Oct 26' },
    { key: 'Fri', name: 'Friday', date: 'Oct 27' },
  ];

  const fetchTimetable = async () => {
    try {
      const res = await api.timetable.getAll();
      if (res && res.data) {
        setSchedule(res.data);
      }
    } catch (err) {
      console.error('Failed to load timetable:', err);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    try {
      const res = await api.timetable.addClass({
        day: selectedDay,
        code: newCode.trim(),
        name: newName.trim(),
        time: newTime.trim(),
        room: newRoom.trim(),
        instructor: newInstructor.trim(),
      });
      if (res && res.data) {
        setSchedule((prev) => ({
          ...prev,
          [selectedDay]: [...(prev[selectedDay] || []), res.data],
        }));
        setIsAddModalOpen(false);
        setNewCode('');
        setNewName('');
      }
    } catch (err) {
      console.error('Failed to add class:', err);
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await api.timetable.deleteClass(id);
      setSchedule((prev) => {
        const next = { ...prev };
        if (next[selectedDay]) {
          next[selectedDay] = next[selectedDay].filter((c) => c.id !== id);
        }
        return next;
      });
    } catch (err) {
      console.error('Failed to delete class:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface dark:text-inverse-on-surface">
            Weekly Class Timetable
          </h1>
          <p className="text-sm text-on-surface-variant dark:text-outline-variant mt-1">
            Lecture halls, lab schedules, and instructor consultations.
          </p>
        </div>

        {/* Week navigation & actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-surface dark:bg-surface-dim px-3 py-1.5 rounded-xl border border-surface-container-high dark:border-outline/20 text-xs font-bold">
            <button className="hover:text-primary p-0.5">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span>Oct 23 - Oct 27, 2024</span>
            <button className="hover:text-primary p-0.5">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Class
          </button>
        </div>
      </div>

      {/* Day Selector Tabs (Mobile & Quick filter) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {days.map((d) => (
          <button
            key={d.key}
            onClick={() => setSelectedDay(d.key)}
            className={`flex-1 min-w-[100px] p-3 rounded-2xl border text-center transition-all ${
              selectedDay === d.key
                ? 'bg-primary text-on-primary border-primary shadow-md'
                : 'bg-surface dark:bg-surface-dim border-surface-container-high dark:border-outline/20 text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high'
            }`}
          >
            <p className="text-xs font-bold">{d.name}</p>
            <p
              className={`text-[11px] mt-0.5 ${
                selectedDay === d.key ? 'text-on-primary/80' : 'text-outline dark:text-outline-variant'
              }`}
            >
              {d.date}
            </p>
          </button>
        ))}
      </div>

      {/* Selected Day Agenda View */}
      <div className="bg-surface dark:bg-surface-dim rounded-2xl p-6 shadow-z1 border border-surface-container-high dark:border-outline/20 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-container-high dark:border-outline/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">event_note</span>
            <h2 className="font-bold text-base text-on-surface dark:text-inverse-on-surface">
              {days.find((d) => d.key === selectedDay)?.name}'s Schedule
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-surface-container-high dark:bg-surface-container-highest rounded-lg text-on-surface-variant">
            {schedule[selectedDay]?.length || 0} Sessions Today
          </span>
        </div>

        <div className="space-y-3">
          {(!schedule[selectedDay] || schedule[selectedDay].length === 0) ? (
            <div className="text-center py-8 text-sm text-outline">
              No classes scheduled for this day. Click "Add Class" to add one!
            </div>
          ) : (
            schedule[selectedDay].map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl ${item.color || 'border-l-4 border-primary bg-primary/10 text-primary'} shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs px-2 py-0.5 rounded bg-surface/60 dark:bg-inverse-surface/60">
                      {item.code}
                    </span>
                    <span className="text-xs opacity-75 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      {item.instructor}
                    </span>
                  </div>
                  <h3 className="font-bold text-base">{item.name}</h3>
                  <div className="flex items-center gap-3 text-xs opacity-85">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {item.room}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-center">
                  <span className="text-xs font-bold bg-surface dark:bg-inverse-surface px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {item.time}
                  </span>
                  <button
                    onClick={() => handleDeleteClass(item.id)}
                    className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Remove class"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Complete Weekly Grid Overview */}
      <div className="hidden lg:block bg-surface dark:bg-surface-dim rounded-2xl p-6 shadow-z1 border border-surface-container-high dark:border-outline/20 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface dark:text-inverse-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">calendar_view_week</span>
          5-Day Weekly Matrix
        </h3>

        <div className="grid grid-cols-5 gap-3">
          {days.map((day) => (
            <div
              key={day.key}
              className="bg-surface-container-low dark:bg-surface-container-highest p-3.5 rounded-xl border border-surface-container-high dark:border-outline/20 space-y-2.5"
            >
              <div className="border-b border-surface-container-high dark:border-outline/20 pb-2">
                <p className="font-bold text-xs text-on-surface dark:text-inverse-on-surface">
                  {day.name}
                </p>
                <p className="text-[10px] text-on-surface-variant dark:text-outline-variant">
                  {day.date}
                </p>
              </div>

              <div className="space-y-2">
                {schedule[day.key]?.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-2.5 rounded-lg bg-surface dark:bg-inverse-surface border border-surface-container-high dark:border-outline/20 shadow-xs text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[11px] text-primary dark:text-primary-fixed">
                        {cls.code}
                      </span>
                    </div>
                    <p className="font-semibold text-xs leading-tight line-clamp-1">{cls.name}</p>
                    <p className="text-[10px] text-on-surface-variant dark:text-outline-variant">
                      {cls.time.split(' - ')[0]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Class Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface dark:bg-inverse-surface w-full max-w-md rounded-2xl shadow-2xl border border-surface-container-high dark:border-outline/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-container-high dark:border-outline/20 flex items-center justify-between">
              <h3 className="font-bold text-lg text-on-surface dark:text-inverse-on-surface">
                Add Class for {days.find((d) => d.key === selectedDay)?.name}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddClass} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS304"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                    Time Range
                  </label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                  Class / Subject Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Algorithms"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">
                    Room / Location
                  </label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface text-sm"
                  />
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
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
