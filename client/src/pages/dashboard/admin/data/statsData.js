import { Users, FileText, MessageSquare, CheckCircle } from 'lucide-react';

const statsData = [
  {
    id: 1,
    title: 'Total Users',
    value: '12,345',
    icon: Users,
    trend: '+12%',
    trendUp: true,
  },
  {
    id: 2,
    title: 'Total Articles',
    value: '1,204',
    icon: FileText,
    trend: '+5%',
    trendUp: true,
  },
  {
    id: 3,
    title: 'Total Blogs',
    value: '842',
    icon: MessageSquare,
    trend: '-2%',
    trendUp: false,
  },
  {
    id: 4,
    title: 'Symptoms Solved',
    value: '45.2k',
    icon: CheckCircle,
    trend: '+18%',
    trendUp: true,
  },
];

export default statsData;