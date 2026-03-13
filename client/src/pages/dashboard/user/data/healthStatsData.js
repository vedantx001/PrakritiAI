import { Activity, Stethoscope, BookOpen, Edit3 } from 'lucide-react';

const healthStatsData = [
  {
    title: 'Health Score',
    value: '88/100',
    subtext: 'Keep up the good work!',
    icon: Activity,
    colorClass: 'bg-green-100 text-green-600',
  },
  {
    title: 'Symptoms Analyzed',
    value: '12',
    subtext: 'Last analysis: Yesterday',
    icon: Stethoscope,
    colorClass: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Saved Articles',
    value: '24',
    subtext: '3 new this week',
    icon: BookOpen,
    colorClass: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'My Contributions',
    value: '02',
    subtext: '1 pending approval',
    icon: Edit3,
    colorClass: 'bg-orange-100 text-orange-600',
  },
];

export default healthStatsData;