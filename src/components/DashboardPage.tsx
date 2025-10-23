import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { StatusBadge } from './StatusBadge';
import { Task } from '../types/task';
import { CheckCircle2, Clock, PauseCircle, TrendingUp } from 'lucide-react';

interface DashboardPageProps {
  tasks: Task[];
  currentUser: string;
  onTaskClick?: (task: Task) => void;
}

export function DashboardPage({
  tasks,
  currentUser,
  onTaskClick,
}: DashboardPageProps) {
  const userTasks = tasks.filter((task) => task.employeeId === currentUser);
  const todayTasks = userTasks.filter((task) => {
    const taskDate = new Date(task.date);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const inProgressCount = userTasks.filter(
    (t) => t.status === 'in-progress'
  ).length;
  const completedCount = userTasks.filter(
    (t) => t.status === 'completed'
  ).length;
  const onHoldCount = userTasks.filter((t) => t.status === 'on-hold').length;

  const completionRate =
    userTasks.length > 0
      ? Math.round((completedCount / userTasks.length) * 100)
      : 0;

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl'>Dashboard 📅</h2>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>
          오늘의 업무 현황을 확인하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>진행 중</CardTitle>
            <Clock className='h-4 w-4 text-blue-600 dark:text-blue-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl'>{inProgressCount}</div>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              현재 진행중인 업무
            </p>
          </CardContent>
        </Card>

        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>완료</CardTitle>
            <CheckCircle2 className='h-4 w-4 text-green-600 dark:text-green-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl'>{completedCount}</div>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              완료된 업무
            </p>
          </CardContent>
        </Card>

        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>보류</CardTitle>
            <PauseCircle className='h-4 w-4 text-gray-600 dark:text-gray-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl'>{onHoldCount}</div>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              보류 중인 업무
            </p>
          </CardContent>
        </Card>

        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>완료율</CardTitle>
            <TrendingUp className='h-4 w-4 text-purple-600 dark:text-purple-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl'>{completionRate}%</div>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              전체 업무 완료율
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 오늘의 업무 */}
      <Card>
        <CardHeader>
          <CardTitle>오늘의 업무</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayTasks.length > 0 ? (
            <div className='space-y-3'>
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className='flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'>
                  <div className='flex-1'>
                    <div>{task.title}</div>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      {task.content}
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
              오늘 등록된 업무가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 최근 업무 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 업무</CardTitle>
          <CardDescription>최근 업데이트된 업무 목록</CardDescription>
        </CardHeader>
        <CardContent>
          {userTasks.length > 0 ? (
            <div className='space-y-3'>
              {userTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className='flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'>
                  <div className='flex-1'>
                    <div>{task.title}</div>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      {new Date(task.date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
              등록된 업무가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
