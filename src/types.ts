export type PlanType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  type: PlanType;
  date: string; // ISO string for daily, or start of week/month/year
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio?: string;
  avatar?: string;
}
