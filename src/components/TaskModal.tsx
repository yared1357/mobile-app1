import React, { useState } from 'react';
import { PlanType } from '../types';
import { Button } from './Button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  type: PlanType;
  initialData?: { title: string; description: string };
}

export const TaskModal = ({ isOpen, onClose, onSave, type, initialData }: TaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title, description);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-lg bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 shadow-2xl z-50"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif italic text-slate-900">
                New {type.charAt(0).toUpperCase() + type.slice(1)} Plan
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title</label>
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What are you planning?"
                  className="w-full text-xl font-medium bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notes (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add some details..."
                  rows={3}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-300 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="secondary" className="flex-1 py-4" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 py-4">
                  Save Plan
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
