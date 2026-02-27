import React from 'react';
import { CheckCircle2, Circle, Trash2, Edit3 } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const typeColors = {
    daily: 'indigo',
    weekly: 'emerald',
    monthly: 'amber',
    yearly: 'rose'
  };
  
  const color = typeColors[task.type] || 'indigo';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-2xl border transition-all",
        task.completed 
          ? "bg-slate-50 border-slate-100 opacity-60" 
          : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
      )}
    >
      <button 
        onClick={() => onToggle(task.id)}
        className={cn(
          "transition-colors",
          task.completed ? "text-emerald-500" : `text-slate-400 hover:text-${color}-600`
        )}
      >
        {task.completed ? (
          <CheckCircle2 className="w-6 h-6" />
        ) : (
          <Circle className="w-6 h-6" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-medium truncate transition-all",
          task.completed && "line-through text-slate-400"
        )}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-slate-500 truncate">{task.description}</p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(task)}
          className={cn(
            "p-2 text-slate-400 rounded-lg transition-all",
            `hover:text-${color}-600 hover:bg-${color}-50`
          )}
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(task.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
