import { useState, useEffect } from 'react';
import { Calendar, CheckSquare, LayoutDashboard, ListTodo, Target, Trophy, UserCircle, Plus, Sparkles } from 'lucide-react';
import { DailyView, WeeklyView, MonthlyView, YearlyView } from './components/PlanViews';
import { TaskModal } from './components/TaskModal';
import { ProfileView } from './components/ProfileView';
import { ProductivitySlider } from './components/ProductivitySlider';
import { PlanType, Task, UserProfile } from './types';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<PlanType | 'dashboard' | 'profile'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('chronos_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('chronos_profile');
    return saved ? JSON.parse(saved) : { name: '', email: '', phone: '', bio: '' };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<PlanType>('daily');
  const [modalDate, setModalDate] = useState<Date>(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem('chronos_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('chronos_profile', JSON.stringify(profile));
  }, [profile]);

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalType(task.type);
    setModalDate(new Date(task.date));
    setIsModalOpen(true);
  };

  const handleAddTask = (type: PlanType, date: Date) => {
    setEditingTask(null);
    setModalType(type);
    setModalDate(date);
    setIsModalOpen(true);
  };

  const saveTask = (title: string, description: string) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, title, description } : t));
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        completed: false,
        type: modalType,
        date: modalDate.toISOString(),
        priority: 'medium'
      };
      setTasks(prev => [...prev, newTask]);
    }
    setEditingTask(null);
  };

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'daily', label: 'Daily', icon: CheckSquare },
    { id: 'weekly', label: 'Weekly', icon: ListTodo },
    { id: 'monthly', label: 'Monthly', icon: Calendar },
    { id: 'yearly', label: 'Yearly', icon: Target },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard tasks={tasks} profile={profile} onNavigate={setActiveTab} />;
      case 'daily':
        return <DailyView tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} onEdit={handleEditTask} onAddTask={handleAddTask} />;
      case 'weekly':
        return <WeeklyView tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} onEdit={handleEditTask} onAddTask={handleAddTask} />;
      case 'monthly':
        return <MonthlyView tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} onEdit={handleEditTask} onAddTask={handleAddTask} />;
      case 'yearly':
        return <YearlyView tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} onEdit={handleEditTask} onAddTask={handleAddTask} />;
      case 'profile':
        return <ProfileView profile={profile} onSave={setProfile} />;
    }
  };

  return (
    <div className="min-h-screen pb-32 md:pb-0 md:pl-64 bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-indigo-950 border-r border-indigo-900/50 flex-col p-6 z-40 shadow-2xl">
        <div className="mb-12">
          <h1 className="text-2xl font-serif italic font-bold text-white">Chronos</h1>
          <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mt-1">Planner</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium",
                activeTab === tab.id 
                  ? "bg-white text-indigo-950 shadow-lg shadow-black/20" 
                  : "text-indigo-200 hover:bg-indigo-900/50 hover:text-white"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-indigo-900/50">
          <div className="bg-indigo-900/30 rounded-2xl p-4">
            <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Progress</p>
            <div className="h-2 bg-indigo-900/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000" 
                style={{ width: `${(tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-indigo-400 mt-2">
              {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-indigo-950 border-t border-indigo-900/50 px-6 py-4 flex justify-between items-center z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeTab === tab.id ? "text-white scale-110" : "text-indigo-400/60"
            )}
          >
            <tab.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }} 
        onSave={saveTask} 
        type={modalType}
        initialData={editingTask ? { title: editingTask.title, description: editingTask.description || '' } : undefined}
      />
    </div>
  );
}

function Dashboard({ tasks, profile, onNavigate }: { tasks: Task[], profile: UserProfile, onNavigate: (tab: any) => void }) {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-12">
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-serif italic text-slate-900 leading-tight">
            {profile.name ? `Hello ${profile.name}.` : 'Hello there.'}
          </h1>
          <p className="text-slate-500 text-sm md:text-base">Welcome back.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-center">
          <ProductivitySlider />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('daily')}
            className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <p className="text-3xl font-serif italic text-indigo-900">{tasks.filter(t => t.type === 'daily' && !t.completed).length}</p>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mt-1">Daily Tasks</p>
          </button>
          <button 
            onClick={() => onNavigate('weekly')}
            className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <p className="text-3xl font-serif italic text-emerald-900">{tasks.filter(t => t.type === 'weekly' && !t.completed).length}</p>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mt-1">Weekly Focus</p>
          </button>
          <button 
            onClick={() => onNavigate('monthly')}
            className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <p className="text-3xl font-serif italic text-amber-900">{tasks.filter(t => t.type === 'monthly' && !t.completed).length}</p>
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mt-1">Monthly Goals</p>
          </button>
          <button 
            onClick={() => onNavigate('yearly')}
            className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <p className="text-3xl font-serif italic text-rose-900">{tasks.filter(t => t.type === 'yearly' && !t.completed).length}</p>
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mt-1">Yearly Vision</p>
          </button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif italic text-slate-900">Quick Navigation</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: 'daily', color: 'indigo' },
            { type: 'weekly', color: 'emerald' },
            { type: 'monthly', color: 'amber' },
            { type: 'yearly', color: 'rose' }
          ].map(({ type, color }) => (
            <button
              key={type}
              onClick={() => onNavigate(type as PlanType)}
              className={cn(
                "p-6 rounded-[2rem] border shadow-sm transition-all text-left group",
                `bg-${color}-50 border-${color}-100 hover:shadow-md`
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors",
                `bg-white text-${color}-600 group-hover:bg-${color}-600 group-hover:text-white`
              )}>
                <Plus className="w-5 h-5" />
              </div>
              <p className={cn("font-bold text-[10px] uppercase tracking-widest transition-colors", `text-${color}-400 group-hover:text-${color}-900`)}>View</p>
              <p className={cn("font-serif italic text-lg transition-colors", `text-${color}-900`)}>{type}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

