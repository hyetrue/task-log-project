import { useState, useRef } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Task } from '../types/task';
import {
  Search,
  Users,
  BarChart3,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Database,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Pie,
  PieChart,
  Cell,
} from 'recharts';
import {
  downloadTasksAsJson,
  uploadTasksFromJson,
  resetStorage,
  getStorageInfo,
} from '../utils/storage';
import { toast } from 'sonner@2.0.3';

interface AdminPageProps {
  tasks: Task[];
  onTasksUpdate?: () => void;
}

export function AdminPage({ tasks, onTasksUpdate }: AdminPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [storageInfo, setStorageInfo] = useState(getStorageInfo());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadJson = () => {
    downloadTasksAsJson();
    toast.success('업무 데이터가 JSON 파일로 다운로드되었습니다.');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadTasksFromJson(file); //파일을 읽어서 localStorage에 저장
      setStorageInfo(getStorageInfo()); // 스토리지 정보 업데이트
      toast.success('JSON 파일에서 데이터를 불러왔습니다.');
      onTasksUpdate?.(); //부모에게 알림 (옵셔널 체이닝)

      // 페이지 새로고침 (중요!)
      window.location.reload();
    } catch (error) {
      toast.error('파일 업로드 실패: ' + (error as Error).message);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 데이터 초기화 핸들러
  const handleReset = () => {
    if (confirm('모든 데이터가 초기화됩니다. 계속하시겠습니까?')) {
      resetStorage();
      setStorageInfo(getStorageInfo());
      toast.success('데이터가 초기화되었습니다.');

      // 페이지 새로고침
      window.location.reload();
    }
  };

  // 팀별 업무 통계(reduce활용)
  const teamStats = tasks.reduce((acc, task) => {
    // 팀이 없으면 초기화
    if (!acc[task.team]) {
      acc[task.team] = { total: 0, completed: 0, inProgress: 0, onHold: 0 };
    }
    // 통계 업데이트
    acc[task.team].total++;
    if (task.status === 'completed') acc[task.team].completed++;
    if (task.status === 'in-progress') acc[task.team].inProgress++;
    if (task.status === 'on-hold') acc[task.team].onHold++;
    return acc;
  }, {} as Record<string, { total: number; completed: number; inProgress: number; onHold: number }>);

  // 차트 데이터 변환
  const teamChartData = Object.entries(teamStats).map(([team, stats]) => ({
    team,
    진행중: stats.inProgress,
    완료: stats.completed,
    보류: stats.onHold,
  }));

  // 직원별 업무량 통계
  const employeeStats = tasks.reduce((acc, task) => {
    if (!acc[task.employeeId]) {
      acc[task.employeeId] = {
        name: task.employeeName,
        team: task.team,
        total: 0,
        completed: 0,
        inProgress: 0,
        onHold: 0,
      };
    }
    acc[task.employeeId].total++;
    if (task.status === 'completed') acc[task.employeeId].completed++;
    if (task.status === 'in-progress') acc[task.employeeId].inProgress++;
    if (task.status === 'on-hold') acc[task.employeeId].onHold++;
    return acc;
  }, {} as Record<string, { name: string; team: string; total: number; completed: number; inProgress: number; onHold: number }>);

  const employeeChartData = Object.entries(employeeStats).map(
    ([id, stats]) => ({
      name: stats.name,
      업무량: stats.total,
    })
  );
  //Recharts 라이브러리는 배열 형태의 데이터를 요구
  //객체 -> 배열 반환이 필요

  // 상태별 통계
  const statusStats = [
    {
      name: '진행중',
      value: tasks.filter((t) => t.status === 'in-progress').length,
      color: '#3B82F6',
    },
    {
      name: '완료',
      value: tasks.filter((t) => t.status === 'completed').length,
      color: '#10B981',
    },
    {
      name: '보류',
      value: tasks.filter((t) => t.status === 'on-hold').length,
      color: '#6B7280',
    },
  ];

  // 필터링된 태스크
  const teams = [...new Set(tasks.map((t) => t.team))];
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = teamFilter === 'all' || task.team === teamFilter;
    return matchesSearch && matchesTeam;
  });

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl'>Admin👷‍♀️</h2>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>
          전체 업무 현황을 관리하세요
        </p>
      </div>

      {/* 데이터 관리 */}
      <Card className='bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 border-2 border-green-300 dark:border-blue-900'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Database className='w-5 h-5 text-green-600 dark:text-green-400' />
            데이터 관리
          </CardTitle>
          <CardDescription>JSON 파일로 백업 및 복원</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex flex-wrap gap-3'>
              <Button
                onClick={handleDownloadJson}
                variant='outline'
                className='flex-1 min-w-[150px]'>
                <Download className='w-4 h-4 mr-2' />
                JSON 다운로드
              </Button>

              <input
                ref={fileInputRef}
                type='file'
                accept='.json'
                onChange={handleFileSelect}
                className='hidden'
                id='json-upload'
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant='outline'
                className='flex-1 min-w-[150px]'>
                <Upload className='w-4 h-4 mr-2' />
                JSON 업로드
              </Button>

              <Button
                onClick={handleReset}
                variant='outline'
                className='flex-1 min-w-[150px] text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'>
                <RefreshCw className='w-4 h-4 mr-2' />
                데이터 초기화
              </Button>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t dark:border-gray-700'>
              <div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  업무 수
                </p>
                <p className='text-lg'>{storageInfo.tasksCount}개</p>
              </div>
              <div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  직원 수
                </p>
                <p className='text-lg'>{storageInfo.employeesCount}명</p>
              </div>
              <div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  저장 크기
                </p>
                <p className='text-lg'>
                  {(storageInfo.storageSize / 1024).toFixed(1)}KB
                </p>
              </div>
              <div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  마지막 동기화
                </p>
                <p className='text-xs'>{storageInfo.lastSync}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 전체 통계 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>전체 업무</CardTitle>
            <BarChart3 className='h-4 w-4 text-blue-600 dark:text-blue-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl'>{tasks.length}</div>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              등록된 총 업무 수
            </p>
          </CardContent>
        </Card>

        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>전체 직원</CardTitle>
            <Users className='h-4 w-4 text-green-600 dark:text-green-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl'>{Object.keys(employeeStats).length}</div>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              활동 중인 직원 수
            </p>
          </CardContent>
        </Card>

        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>완료율</CardTitle>
            <BarChart3 className='h-4 w-4 text-purple-600 dark:text-purple-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl'>
              {tasks.length > 0
                ? Math.round(
                    (tasks.filter((t) => t.status === 'completed').length /
                      tasks.length) *
                      100
                  )
                : 0}
              %
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              전체 업무 완료율
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>팀별 업무 현황</CardTitle>
            <CardDescription>팀별 업무 상태 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={teamChartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='team' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='진행중' fill='#3B82F6' />
                <Bar dataKey='완료' fill='#10B981' />
                <Bar dataKey='보류' fill='#6B7280' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>전체 업무 상태</CardTitle>
            <CardDescription>업무 상태별 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={statusStats}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'>
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>직원별 업무량</CardTitle>
            <CardDescription>직원별 총 업무 수</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={employeeChartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='업무량' fill='#8B5CF6' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>업무 검색 및 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
              <Input
                placeholder='업무 또는 직원 검색...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger>
                <div className='flex items-center'>
                  <Filter className='w-4 h-4 mr-2' />
                  <SelectValue placeholder='팀 필터' />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>전체 팀</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 업무 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>전체 업무 목록</CardTitle>
          <CardDescription>{filteredTasks.length}개의 업무</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>날짜</TableHead>
                  <TableHead>업무 제목</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>팀</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>우선순위</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  // 최대 20개만 표시 (성능 최적화)
                  // 만약 filteredTasks가 100개 라면
                  // 처음 20개만 렌더링
                  filteredTasks.slice(0, 20).map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        {new Date(task.date).toLocaleDateString('ko-KR')}
                      </TableCell>
                      <TableCell className='max-w-xs truncate'>
                        {task.title}
                      </TableCell>
                      <TableCell>{task.employeeName}</TableCell>
                      <TableCell>{task.team}</TableCell>
                      <TableCell>
                        <StatusBadge status={task.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={task.priority} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='text-center py-8 text-gray-500'>
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
