import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfYear, eachMonthOfInterval } from 'date-fns';
import { Task, PlanType } from '../types';
import { TaskItem } from './TaskItem';
import { Button } from './Button';
import { Plus, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onAddTask: (type: PlanType, date: Date) => void;
}

export const DailyView = ({ tasks, onToggle, onDelete, onEdit, onAddTask }: ViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dailyTasks = tasks.filter(t => t.type === 'daily' && isSameDay(new Date(t.date), currentDate));

  return (
    <div className="space-y-12">
      <div className="relative h-[160px] md:h-[200px] rounded-[2rem] overflow-hidden bg-indigo-600 flex items-end p-6 md:p-10 shadow-xl shadow-indigo-100">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent" />
        <div className="relative z-10 w-full flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-4xl font-serif italic text-white leading-none">{format(currentDate, 'MMMM d')}</h2>
            <p className="text-indigo-200 text-sm md:text-base mt-1 md:mt-2 font-medium">{format(currentDate, 'EEEE, yyyy')}</p>
          </div>
          <div className="flex gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
            <Button variant="ghost" className="text-white hover:bg-white/20 h-8 text-xs" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20 h-8 w-8" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20 h-8 w-8" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Your Schedule</h3>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {dailyTasks.length} {dailyTasks.length === 1 ? 'Task' : 'Tasks'}
          </span>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {dailyTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </AnimatePresence>
          
          {dailyTasks.length === 0 && (
            <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50">
              <p className="text-slate-400 text-sm font-medium">Your day is clear. Ready to plan?</p>
            </div>
          )}

          <Button 
            variant="secondary" 
            className="w-full py-4 border-2 border-dashed border-indigo-100 bg-white hover:bg-indigo-50 hover:border-indigo-200 rounded-[1.5rem] text-indigo-600 font-bold text-base shadow-sm"
            onClick={() => onAddTask('daily', currentDate)}
          >
            <Plus className="w-5 h-5 mr-2" /> Create New Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export const WeeklyView = ({ tasks, onToggle, onDelete, onEdit, onAddTask }: ViewProps) => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const weekDays = eachDayOfInterval({
    start: currentWeek,
    end: addDays(currentWeek, 6)
  });

  return (
    <div className="space-y-8">
      <div className="relative h-[160px] md:h-[200px] rounded-[2rem] overflow-hidden bg-emerald-600 flex items-end p-6 md:p-10 shadow-xl shadow-emerald-100">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent" />
        <div className="relative z-10 w-full flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-serif italic text-white leading-none">Weekly</h2>
            <p className="text-emerald-100 text-sm md:text-base mt-2 font-medium">
              {format(startOfWeek(currentWeek), 'MMM d')} - {format(endOfWeek(currentWeek), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="flex gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
            <Button variant="ghost" className="text-white hover:bg-white/20 h-8 text-xs" size="sm" onClick={() => setCurrentWeek(startOfWeek(new Date()))}>
              Today
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20 h-8 w-8" size="icon" onClick={() => setCurrentWeek(addDays(currentWeek, -7))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20 h-8 w-8" size="icon" onClick={() => setCurrentWeek(addDays(currentWeek, 7))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {weekDays.map(day => {
          const dayTasks = tasks.filter(t => t.type === 'weekly' && isSameDay(new Date(t.date), day));
          return (
            <div key={day.toString()} className="space-y-3 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-2">
                <span className="font-serif italic text-lg text-slate-900">{format(day, 'EEEE')}</span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{format(day, 'MMM d')}</span>
              </div>
              <div className="space-y-2">
                {dayTasks.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                ))}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                  onClick={() => onAddTask('weekly', day)}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add objective
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const MonthlyView = ({ tasks, onToggle, onDelete, onEdit, onAddTask }: ViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const days = eachDayOfInterval({
    start: startOfWeek(currentMonth),
    end: addDays(startOfWeek(addDays(endOfMonth(currentMonth), 1)), 6)
  });

  return (
    <div className="space-y-8">
      <div className="relative h-[160px] md:h-[200px] rounded-[2rem] overflow-hidden bg-amber-600 flex items-end p-6 md:p-10 shadow-xl shadow-amber-100">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent" />
        <div className="relative z-10 w-full flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-serif italic text-white leading-none">{format(currentMonth, 'MMMM yyyy')}</h2>
          </div>
          <div className="flex gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
            <Button variant="ghost" className="text-white hover:bg-white/20 h-8 text-xs" size="sm" onClick={() => setCurrentMonth(startOfMonth(new Date()))}>
              Today
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20 h-8 w-8" size="icon" onClick={() => setCurrentMonth(addDays(currentMonth, -30))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20 h-8 w-8" size="icon" onClick={() => setCurrentMonth(addDays(currentMonth, 30))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="calendar-grid gap-px bg-amber-200 border border-amber-200 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm w-full">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="bg-amber-50 py-2 text-center text-[9px] md:text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            <span className="hidden md:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</span>
            <span className="md:hidden">{d}</span>
          </div>
        ))}
        {days.map(day => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const dayTasks = tasks.filter(t => t.type === 'monthly' && isSameDay(new Date(t.date), day));
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={day.toString()} 
              className={cn(
                "min-h-[60px] md:min-h-[100px] bg-white p-1 md:p-3 flex flex-col gap-1 transition-colors hover:bg-amber-50 cursor-pointer border-r border-b border-slate-100",
                !isCurrentMonth && "bg-slate-50/50 text-slate-300"
              )}
              onClick={() => onAddTask('monthly', day)}
            >
              <span className={cn(
                "text-[10px] md:text-xs font-bold w-5 h-5 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all",
                isToday && "bg-amber-600 text-white shadow-lg shadow-amber-200"
              )}>
                {format(day, 'd')}
              </span>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {dayTasks.slice(0, 2).map(t => (
                  <div key={t.id} className={cn(
                    "text-[7px] md:text-[10px] truncate px-1 py-0.5 rounded-sm",
                    t.completed ? "bg-slate-100 text-slate-400 line-through" : "bg-amber-50 text-amber-700 font-medium"
                  )}>
                    {t.title}
                  </div>
                ))}
                {dayTasks.length > 2 && <span className="text-[7px] md:text-[10px] text-amber-400 font-bold">+{dayTasks.length - 2}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const YearlyView = ({ tasks, onToggle, onDelete, onEdit, onAddTask }: ViewProps) => {
  const currentYear = startOfYear(new Date());
  const months = eachMonthOfInterval({
    start: currentYear,
    end: addDays(currentYear, 364)
  });

  return (
    <div className="space-y-8">
      <div className="relative h-[160px] md:h-[200px] rounded-[2rem] overflow-hidden bg-rose-600 flex items-end p-6 md:p-10 shadow-xl shadow-rose-100">
        <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 to-transparent" />
        <div className="relative z-10 w-full flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-serif italic text-white leading-none">{format(currentYear, 'yyyy')} Vision</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map(month => {
          const monthTasks = tasks.filter(t => t.type === 'yearly' && isSameMonth(new Date(t.date), month));
          return (
            <div key={month.toString()} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4 hover:border-rose-200 transition-colors group">
              <h3 className="text-2xl font-serif italic border-b border-slate-100 pb-3 group-hover:text-rose-600 transition-colors">{format(month, 'MMMM')}</h3>
              <div className="space-y-3">
                {monthTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className={cn("w-2 h-2 rounded-full", task.completed ? "bg-slate-200" : "bg-rose-600")} />
                      <span className={cn(task.completed && "line-through text-slate-300")}>{task.title}</span>
                    </div>
                    <button onClick={() => onEdit(task)} className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-rose-600 transition-all">
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => onAddTask('yearly', month)}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add objective
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
