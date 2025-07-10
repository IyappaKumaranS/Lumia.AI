import { DashboardTheme } from '../types';

export const dashboardThemes: DashboardTheme[] = [
  {
    id: 'default',
    name: 'Default',
    background: 'bg-gray-50',
    cardBackground: 'bg-white',
    textColor: 'text-gray-900',
    accentColor: 'text-blue-600',
    chartColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'],
    borderColor: 'border-gray-200'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    background: 'bg-gray-900',
    cardBackground: 'bg-gray-800',
    textColor: 'text-white',
    accentColor: 'text-blue-400',
    chartColors: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#22D3EE', '#FB923C', '#A3E635', '#F472B6', '#9CA3AF'],
    borderColor: 'border-gray-700'
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    background: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    cardBackground: 'bg-white/80 backdrop-blur-sm',
    textColor: 'text-slate-800',
    accentColor: 'text-blue-700',
    chartColors: ['#0EA5E9', '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63', '#1E40AF', '#1D4ED8', '#2563EB', '#3B82F6'],
    borderColor: 'border-blue-200'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    background: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50',
    cardBackground: 'bg-white/90 backdrop-blur-sm',
    textColor: 'text-gray-800',
    accentColor: 'text-orange-600',
    chartColors: ['#EA580C', '#DC2626', '#E11D48', '#BE185D', '#A21CAF', '#7C3AED', '#6366F1', '#3B82F6', '#0EA5E9', '#06B6D4'],
    borderColor: 'border-orange-200'
  },
  {
    id: 'forest',
    name: 'Forest Green',
    background: 'bg-gradient-to-br from-green-50 to-emerald-50',
    cardBackground: 'bg-white/85 backdrop-blur-sm',
    textColor: 'text-green-900',
    accentColor: 'text-green-700',
    chartColors: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#047857', '#065F46', '#064E3B', '#22C55E', '#16A34A', '#15803D'],
    borderColor: 'border-green-200'
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    background: 'bg-gradient-to-br from-purple-50 to-indigo-50',
    cardBackground: 'bg-white/85 backdrop-blur-sm',
    textColor: 'text-purple-900',
    accentColor: 'text-purple-700',
    chartColors: ['#7C3AED', '#8B5CF6', '#A855F7', '#C084FC', '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81', '#1E1B4B'],
    borderColor: 'border-purple-200'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    background: 'bg-white',
    cardBackground: 'bg-gray-50',
    textColor: 'text-gray-900',
    accentColor: 'text-gray-700',
    chartColors: ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6', '#111827', '#1F2937', '#4B5563', '#6B7280'],
    borderColor: 'border-gray-300'
  }
];

export const getThemeById = (id: string): DashboardTheme => {
  return dashboardThemes.find(theme => theme.id === id) || dashboardThemes[0];
};