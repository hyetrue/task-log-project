import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { Search, Filter, Calendar } from 'lucide-react';

interface TaskListPageProps {
  tasks: Task[];
  currentUser: string;
  onTaskClick: (task: Task) => void;
}

export function TaskListPage({
  tasks,
  currentUser,
  onTaskClick,
}: TaskListPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>(
    'all'
  );

  const userTasks = tasks.filter((task) => task.employeeId === currentUser);

  const filteredTasks = userTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group tasks by date
  const tasksByDate = filteredTasks.reduce((acc, task) => {
    const date = new Date(task.date).toLocaleDateString('ko-KR');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(tasksByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl'>Task List 📍</h2>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>
          작성한 업무를 확인하고 관리하세요
        </p>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>검색 및 필터</CardTitle>
          <CardDescription>업무를 검색하고 필터링하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
              <Input
                placeholder='업무 검색...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value: TaskStatus | 'all') =>
                setStatusFilter(value)
              }>
              <SelectTrigger>
                <div className='flex items-center'>
                  <Filter className='w-4 h-4 mr-2' />
                  <SelectValue placeholder='상태 필터' />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>전체 상태</SelectItem>
                <SelectItem value='in-progress'>진행중</SelectItem>
                <SelectItem value='completed'>완료</SelectItem>
                <SelectItem value='on-hold'>보류</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(value: TaskPriority | 'all') =>
                setPriorityFilter(value)
              }>
              <SelectTrigger>
                <div className='flex items-center'>
                  <Filter className='w-4 h-4 mr-2' />
                  <SelectValue placeholder='우선순위 필터' />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>전체 우선순위</SelectItem>
                <SelectItem value='high'>높음</SelectItem>
                <SelectItem value='medium'>보통</SelectItem>
                <SelectItem value='low'>낮음</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 업무 목록 */}
      <div className='space-y-6'>
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => (
            <Card key={date}>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-5 h-5 text-green-600 dark:text-green-400' />
                  <CardTitle>{date}</CardTitle>
                </div>
                <CardDescription>
                  {tasksByDate[date].length}개의 업무
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {tasksByDate[date].map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className='p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors'>
                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-2'>
                            <span className='truncate'>{task.title}</span>
                            <PriorityBadge priority={task.priority} />
                          </div>
                          <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
                            {task.content}
                          </p>
                        </div>
                        <StatusBadge status={task.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className='py-12'>
              <div className='text-center text-gray-500 dark:text-gray-400'>
                {searchTerm ||
                statusFilter !== 'all' ||
                priorityFilter !== 'all'
                  ? '검색 결과가 없습니다.'
                  : '등록된 업무가 없습니다.'}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
