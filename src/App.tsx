import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { TaskCreatePage } from './components/TaskCreatePage';
import { TaskListPage } from './components/TaskListPage';
import { TaskDetailModal } from './components/TaskDetailModal';
import { AdminPage } from './components/AdminPage';
import { Layout } from './components/Layout';
import { Task, Employee } from './types/task';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './hooks/use-theme';
import {
  loadTasks,
  loadEmployees,
  saveTasks,
  addTask,
  updateTask as updateTaskInStorage,
} from './utils/storage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Favicon 설정
  useEffect(() => {
    //기존 favicon 제거
    const existingFavicons = document.querySelectorAll("link[rel*='icon']");
    existingFavicons.forEach((favicon) => favicon.remove());

    //새 favicon 추가
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';

    // 이미지 파일 사용
    // link.href = '/favicon.png';

    // 임시
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = '48px serif';
      ctx.fillText('🚀', 8, 48);
      link.href = canvas.toDataURL();
    }

    document.head.appendChild(link);
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    console.log('🚀 업무 관리 시스템 시작...');
    const loadedTasks = loadTasks();
    const loadedEmployees = loadEmployees();
    setTasks(loadedTasks);
    setEmployees(loadedEmployees);
    console.log('✅ 데이터 로드 완료');

    // ===== 수정: 로그인 상태 복원 (sessionStorage 사용) =====
    // sessionStorage에서 저장된 로그인 정보 불러오기 (브라우저 종료 시 자동 삭제)
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
        console.log('✅ 로그인 상태 복원:', user.name);
      } catch (error) {
        console.error('❌ 로그인 정보 복원 실패:', error);
        sessionStorage.removeItem('currentUser');
      }
    }
    // ===== 수정 끝 =====
  }, []);

  const handleLogin = (employeeId: string, password: string) => {
    // Mock authentication
    const user = employees.find((emp) => emp.id === employeeId);

    if (
      user &&
      ((employeeId === 'EMP001' && password === 'admin123') ||
        (employeeId === 'EMP002' && password === 'user123') ||
        password === 'password')
    ) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setCurrentPage('dashboard');

      // ===== 수정: 로그인 정보 sessionStorage에 저장 (브라우저 종료 시 자동 삭제) =====
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      // ===== 수정 끝 =====

      console.log('👤 로그인:', user.name);
    } else {
      alert('로그인 정보가 올바르지 않습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('dashboard');

    // ===== 수정: 로그아웃 시 sessionStorage에서 로그인 정보 삭제 =====
    sessionStorage.removeItem('currentUser');
    console.log('👋 로그아웃 완료');
    // ===== 수정 끝 =====
  };

  const handleCreateTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    // 새로운 ID 생성 (기존 최대 ID + 1)
    const maxId = tasks.reduce((max, task) => {
      const num = parseInt(task.id.replace('T', ''));
      return num > max ? num : max;
    }, 0);

    const newTask: Task = {
      ...taskData,
      id: `T${String(maxId + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // localStorage에 저장
    if (addTask(newTask)) {
      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      setCurrentPage('list');
      console.log('✅ 새 업무 생성:', newTask.id, newTask.title);
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    // localStorage에 저장
    if (updateTaskInStorage(taskId, updates)) {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : task
      );
      setTasks(updatedTasks);
      setSelectedTask(null);
      setIsModalOpen(false);
      console.log('✅ 업무 수정:', taskId, updates);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  if (!isLoggedIn || !currentUser) {
    return (
      <ThemeProvider>
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Layout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        userName={currentUser.name}
        isAdmin={currentUser.role === 'admin'}>
        {currentPage === 'dashboard' && (
          <DashboardPage
            tasks={tasks}
            currentUser={currentUser.id}
            onTaskClick={handleTaskClick}
          />
        )}
        {currentPage === 'create' && (
          <TaskCreatePage
            onCreateTask={handleCreateTask}
            currentUser={currentUser}
          />
        )}
        {currentPage === 'list' && (
          <TaskListPage
            tasks={tasks}
            currentUser={currentUser.id}
            onTaskClick={handleTaskClick}
          />
        )}
        {currentPage === 'admin' && currentUser.role === 'admin' && (
          <AdminPage
            tasks={tasks}
            onTasksUpdate={() => {
              const loadedTasks = loadTasks();
              setTasks(loadedTasks);
            }}
          />
        )}
      </Layout>

      <TaskDetailModal
        task={selectedTask}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleUpdateTask}
      />

      <Toaster />
    </ThemeProvider>
  );
}
