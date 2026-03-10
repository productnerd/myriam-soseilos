
import { Wing, Feather, Flame, Bolt } from './customIcons';

// Point types and their properties
export const pointTypes = {
  grey: {
    name: 'Wise Points',
    color: '#968E85',
    bg: 'bg-yellow-500/20',
    bgLight: 'bg-yellow-200/30',
    bgDark: 'bg-yellow-800/30',
    borderLight: 'border-yellow-200/20',
    borderDark: 'border-yellow-700/30',
    textColor: 'text-yellow-400',
    hoverBg: 'hover:bg-yellow-200',
    icon: Feather,
  },
  dark: {
    name: 'Coins',
    color: '#7E22CE', // Purple color
    bg: 'bg-purple-500/20',
    bgLight: 'bg-purple-500/20',
    bgDark: 'bg-purple-900/30',
    borderLight: 'border-purple-400/20',
    borderDark: 'border-purple-700/30',
    textColor: 'text-purple-500',
    hoverBg: 'hover:bg-purple-200',
    icon: Wing,
  },
  streak: {
    name: 'Streak',
    color: '#FF7A50',
    bg: 'bg-orange-500/20',
    bgLight: 'bg-orange-500/20',
    bgDark: 'bg-orange-900/30',
    borderLight: 'border-orange-400/20',
    borderDark: 'border-orange-700/30',
    textColor: 'text-orange-500',
    hoverBg: 'hover:bg-orange-200',
    icon: Flame,
  },
  flow: {
    name: 'Flow',
    color: '#3B82F6',
    bg: 'bg-blue-500/20',
    bgLight: 'bg-blue-500/20',
    bgDark: 'bg-blue-900/30',
    borderLight: 'border-blue-400/20',
    borderDark: 'border-blue-700/30',
    textColor: 'text-blue-500',
    hoverBg: 'hover:bg-blue-200',
    icon: Bolt,
  }
};
