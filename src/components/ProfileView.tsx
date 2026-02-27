import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button } from './Button';
import { User, Mail, Phone, Save, CheckCircle2, Edit3, AlertCircle, X, AlignLeft, Camera, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileViewProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export const ProfileView = ({ profile, onSave }: ProfileViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmSave = () => {
    onSave(formData);
    setIsSaved(true);
    setShowConfirm(false);
    setIsEditing(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 md:space-y-12 max-w-2xl mx-auto px-4 md:px-0 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif italic text-slate-900">Your Profile</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-lg">Manage your personal information.</p>
        </div>
        {!isEditing && (
          <Button 
            variant="secondary" 
            onClick={() => setIsEditing(true)}
            className="rounded-2xl px-6 py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Edit3 className="w-4 h-4" /> 
            {profile.name ? 'Edit Profile' : 'Add Profile'}
          </Button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.form 
            key="edit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSaveClick} 
            className="space-y-6 md:space-y-8 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center text-slate-400">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 md:w-16 md:h-16" />
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 md:p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all"
                >
                  <Camera className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click to change photo</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-base md:text-lg bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-base md:text-lg bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 transition-all"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Phone className="w-3 h-3" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-base md:text-lg bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 transition-all"
                    placeholder="+251 ..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <AlignLeft className="w-3 h-3" /> Bio / Description
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full text-base md:text-lg bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 transition-all min-h-[120px] resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <div className="flex flex-row gap-3 md:gap-4">
              <Button 
                type="button" 
                variant="danger" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData(profile);
                }}
                className="flex-1 py-4 rounded-2xl"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-[2] py-4 rounded-2xl flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            key="view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 md:space-y-10 relative overflow-hidden"
          >
            <AnimatePresence>
              {isSaved && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-0 left-0 right-0 bg-emerald-500 text-white py-3 px-4 text-center text-sm font-bold flex items-center justify-center gap-2 z-10"
                >
                  <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-100 rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center text-indigo-600">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 md:w-16 md:h-16" />
                )}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif italic text-slate-900">{profile.name || 'No Name Set'}</h2>
                <p className="text-slate-500 text-sm md:text-base">{profile.email || 'No Email Set'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                <p className="text-slate-700 font-medium flex items-center gap-2 break-all">
                  <Mail className="w-4 h-4 text-slate-300 flex-shrink-0" /> {profile.email || 'Not provided'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                <p className="text-slate-700 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-300 flex-shrink-0" /> {profile.phone || 'Not provided'}
                </p>
              </div>
            </div>

            {profile.bio && (
              <div className="space-y-2 pt-6 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bio / Description</p>
                <p className="text-slate-600 leading-relaxed italic text-sm md:text-base">"{profile.bio}"</p>
              </div>
            )}

            {!profile.name && (
              <div className="bg-indigo-50 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-4">
                <div className="bg-white p-2 rounded-xl shadow-sm">
                  <AlertCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-indigo-900 font-bold text-sm">Complete your profile</p>
                  <p className="text-indigo-600/70 text-xs">Add your details and photo to personalize your experience.</p>
                </div>
                <Button size="sm" className="w-full md:w-auto" onClick={() => setIsEditing(true)}>Add Profile</Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="bg-indigo-50 p-3 rounded-2xl">
                  <Save className="w-6 h-6 text-indigo-600" />
                </div>
                <button onClick={() => setShowConfirm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-serif italic text-slate-900">Are you sure?</h3>
                <p className="text-slate-500">Do you want to save the changes to your profile?</p>
              </div>

              <div className="flex flex-row gap-3 pt-2">
                <Button variant="danger" className="flex-1 py-4 rounded-2xl" onClick={() => setShowConfirm(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 py-4 rounded-2xl" onClick={confirmSave}>
                  Yes, Save
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
