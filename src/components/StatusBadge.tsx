import { Badge } from './ui/badge';
import { TaskStatus } from '../types/task';

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    'in-progress': { label: '진행중', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300' },
    'completed': { label: '완료', className: 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300' },
    'on-hold': { label: '보류', className: 'bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300' },
  };

  const config = statusConfig[status];

  return <Badge className={config.className}>{config.label}</Badge>;
}
