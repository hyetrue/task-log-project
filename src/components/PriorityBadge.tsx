import { Badge } from './ui/badge';
import { TaskPriority } from '../types/task';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityConfig = {
    high: { label: '높음', className: 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-300' },
    medium: { label: '보통', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300' },
    low: { label: '낮음', className: 'bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300' },
  };

  const config = priorityConfig[priority];

  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}
