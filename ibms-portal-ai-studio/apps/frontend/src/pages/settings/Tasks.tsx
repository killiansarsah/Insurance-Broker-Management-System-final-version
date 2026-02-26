
import React, { useState } from 'react';
import { Task } from '../../types';
import { Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, FormControl, InputLabel } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

type FilterType = 'all' | 'pending' | 'completed';
type SortType = 'dueDate' | 'priority' | 'name';

const Tasks: React.FC = () => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskDueTime, setNewTaskDueTime] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [taskMenuAnchor, setTaskMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  
  const teamMembers = [
    { id: '1', name: 'John Okafor', role: 'Senior Agent', avatar: 'https://picsum.photos/seed/11/100/100', activeTasks: 3 },
    { id: '2', name: 'Sarah Adeyemi', role: 'Claims Specialist', avatar: 'https://picsum.photos/seed/12/100/100', activeTasks: 5 },
    { id: '3', name: 'David Musa', role: 'Policy Manager', avatar: 'https://picsum.photos/seed/13/100/100', activeTasks: 2 },
    { id: '4', name: 'Grace Nwosu', role: 'Senior Consultant', avatar: 'https://picsum.photos/seed/14/100/100', activeTasks: 4 },
  ];
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Follow up on renewal for Dangote Industries', priority: 'High', dueTime: '10:00 AM', entityName: 'Dangote Industries', entityId: 'POL-2023-889', type: 'business', completed: false },
    { id: '2', title: 'Process claim payment #CLM-9921', priority: 'Medium', dueTime: '1:00 PM', entityName: 'Sarah Okonjo', entityId: 'CLM-9921', type: 'warning', completed: false },
    { id: '3', title: 'Send quote revision to SME Clients', priority: 'Low', dueTime: '4:30 PM', entityName: 'TechStart Ltd', entityId: 'QT-2024-002', type: 'groups', completed: false },
    { id: '4', title: 'Review Q3 Compliance Report', priority: 'Medium', dueTime: 'Tomorrow', entityName: 'Internal', entityId: 'REP-Q3', type: 'apartment', completed: false },
    { id: '5', title: 'Draft introduction email for new lead', priority: 'Low', dueTime: 'Completed 9:30 AM', entityName: 'Lead: Global Motors', entityId: '', type: 'person_add', completed: true },
  ]);

  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);

  // Statistics for the dashboard
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const highPriorityCount = tasks.filter(t => t.priority === 'High' && !t.completed).length;
  const mediumPriorityCount = tasks.filter(t => t.priority === 'Medium' && !t.completed).length;
  const lowPriorityCount = tasks.filter(t => t.priority === 'Low' && !t.completed).length;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    let dueTimeText = 'Today';
    if (newTaskDueDate && newTaskDueTime) {
      const date = new Date(newTaskDueDate);
      dueTimeText = `${date.toLocaleDateString()} ${newTaskDueTime}`;
    } else if (newTaskDueDate) {
      const date = new Date(newTaskDueDate);
      dueTimeText = date.toLocaleDateString();
    } else if (newTaskDueTime) {
      dueTimeText = newTaskDueTime;
    }

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      priority: newTaskPriority,
      dueTime: dueTimeText,
      entityName: 'Internal',
      entityId: 'NEW',
      type: 'assignment',
      completed: false
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskDueTime('');
    setNewTaskPriority('Medium');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleCheckboxChange = (task: Task) => {
    if (!task.completed) {
      setTaskToComplete(task);
    } else {
      toggleTaskCompletion(task.id);
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const confirmComplete = () => {
    if (taskToComplete) {
      toggleTaskCompletion(taskToComplete.id);
      setTaskToComplete(null);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setTaskMenuAnchor(null);
    setSelectedTaskId(null);
  };

  const handleTaskMenuOpen = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    event.stopPropagation();
    setTaskMenuAnchor(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleTaskMenuClose = () => {
    setTaskMenuAnchor(null);
    setSelectedTaskId(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    }
    return 0; // dueDate - keeping original order
  });

  return (
    <div className="relative">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Create Task Input */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 transition-all" 
                    placeholder="Add a new task..." 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button 
                  onClick={handleAddTask}
                  className="bg-primary hover:bg-primary-hover text-white rounded-xl px-6 flex items-center justify-center transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              
              {/* Date, Time, and Priority Row */}
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-medium text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <input
                    type="time"
                    value={newTaskDueTime}
                    onChange={(e) => setNewTaskDueTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-medium text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 transition-all"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    filter === 'all' 
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200' 
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    filter === 'pending' 
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200' 
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    filter === 'completed' 
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200' 
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Completed
                </button>
              </div>
              <button 
                onClick={(e) => setSortMenuAnchor(e.currentTarget)}
                className="font-black text-slate-600 dark:text-slate-300 text-xs uppercase tracking-widest flex items-center gap-1 hover:text-primary transition-colors"
              >
                Sort: {sortBy === 'dueDate' ? 'Due Date' : sortBy === 'priority' ? 'Priority' : 'Name'} 
                <span className="material-symbols-outlined text-lg">arrow_drop_down</span>
              </button>
              <Menu
                anchorEl={sortMenuAnchor}
                open={Boolean(sortMenuAnchor)}
                onClose={() => setSortMenuAnchor(null)}
              >
                <MenuItem onClick={() => { setSortBy('dueDate'); setSortMenuAnchor(null); }}>Due Date</MenuItem>
                <MenuItem onClick={() => { setSortBy('priority'); setSortMenuAnchor(null); }}>Priority</MenuItem>
                <MenuItem onClick={() => { setSortBy('name'); setSortMenuAnchor(null); }}>Name</MenuItem>
              </Menu>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedTasks.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4 text-slate-400">
                  <span className="material-symbols-outlined text-6xl">checklist_rtl</span>
                  <p className="font-bold uppercase tracking-widest text-xs">
                    {filter === 'all' ? 'No tasks found. Create one above!' : `No ${filter} tasks found.`}
                  </p>
                </div>
              ) : (
                sortedTasks.map((task) => (
                  <div key={task.id} className={`group flex items-start gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer border-l-4 ${task.priority === 'High' && !task.completed ? 'border-red-500' : 'border-transparent'} ${task.completed ? 'opacity-50' : ''}`}>
                    <div className="pt-1">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => handleCheckboxChange(task)} 
                        className="w-6 h-6 rounded-lg border-slate-200 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <h3 className={`text-base font-black tracking-tight group-hover:text-primary transition-colors ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-widest">
                        <span className="flex items-center gap-1.5 text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                          <span className="material-symbols-outlined text-[16px]">{task.type}</span>
                          {task.entityName}
                        </span>
                        <span className="text-slate-400">{task.entityId}</span>
                        <span className={`flex items-center gap-1.5 ${task.priority === 'High' && !task.completed ? 'text-red-500' : 'text-slate-500'}`}>
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          {task.dueTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                        task.priority === 'High' ? 'bg-red-50 text-red-700' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-500'
                      }`}>{task.priority}</span>
                      <button 
                        onClick={(e) => handleTaskMenuOpen(e, task.id)}
                        className="text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Dynamic Progress Dashboard */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col gap-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Today's Progress</h3>
            <div className="flex items-center gap-8">
              <div className="relative size-32">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="4" />
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="15.9" 
                    fill="none" 
                    className="stroke-primary transition-all duration-700 ease-out" 
                    strokeWidth="4" 
                    strokeDasharray={`${progressPercent} 100`} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{progressPercent}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase mt-1">Done</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  <span className={`size-2.5 rounded-full bg-red-500 ${highPriorityCount > 0 ? 'animate-pulse' : ''}`}></span> {highPriorityCount} High
                </div>
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  <span className="size-2.5 rounded-full bg-amber-500"></span> {mediumPriorityCount} Medium
                </div>
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  <span className="size-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span> {lowPriorityCount} Low
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 dark:bg-slate-900/50 rounded-3xl border border-primary/20 dark:border-slate-800 p-8">
            <h3 className="text-primary text-xl font-black uppercase tracking-tight mb-4">Need help?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-bold mb-6 leading-relaxed">Reassign complex tasks to your available senior team members instantly.</p>
            <div className="flex -space-x-3 mb-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="size-10 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden shadow-sm ring-1 ring-primary/5">
                  <img src={`https://picsum.photos/seed/${i + 10}/100/100`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowTeamDialog(true)}
              className="w-full bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest text-xs py-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              Manage Team
            </button>
          </div>
        </div>
      </div>

      {/* Task Menu */}
      <Menu
        anchorEl={taskMenuAnchor}
        open={Boolean(taskMenuAnchor)}
        onClose={handleTaskMenuClose}
      >
        <MenuItem onClick={handleTaskMenuClose}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Edit Task
        </MenuItem>
        <MenuItem onClick={() => selectedTaskId && handleDeleteTask(selectedTaskId)} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete Task
        </MenuItem>
      </Menu>

      {/* Confirmation Modal */}
      {taskToComplete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setTaskToComplete(null)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-fadeIn">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">task_alt</span>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Complete Task?</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Are you sure you want to mark <strong className="text-slate-900 dark:text-white">"{taskToComplete.title}"</strong> as completed?
                </p>
              </div>
              <div className="flex w-full gap-4 mt-2">
                <button 
                  onClick={() => setTaskToComplete(null)}
                  className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-800 font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmComplete}
                  className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  Yes, Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Management Dialog */}
      {showTeamDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTeamDialog(false)}></div>
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-fadeIn max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Team Management</h2>
                  <p className="text-slate-500 font-medium mt-1">Assign tasks to available team members</p>
                </div>
                <button 
                  onClick={() => setShowTeamDialog(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="size-14 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm flex-shrink-0">
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-slate-900 dark:text-white text-base truncate">{member.name}</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{member.role}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                            {member.activeTasks} Active Tasks
                          </span>
                          <span className={`size-2 rounded-full ${member.activeTasks < 4 ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-widest py-2 rounded-lg transition-all active:scale-95">
                        Assign Task
                      </button>
                      <button className="px-3 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">mail</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setShowTeamDialog(false)}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

