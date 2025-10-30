import { useState, useEffect } from 'react';
//useState: 상태(데이터) 관리용 훅
//useEffect: 컴포넌트가 화면에 나타날 때 실행되는 코드 작성용
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
  const [isLoggedIn, setIsLoggedIn] = useState(false); //로그인 여부(true/false)
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);//현재 로그인한 사용자 정보
  const [currentPage, setCurrentPage] = useState('dashboard');//현재 보고 있는 페이지('dascboard')
  const [tasks, setTasks] = useState<Task[]>([]);//모든 업무 목록 배열
  const [employees, setEmployees] = useState<Employee[]>([]);//모든 직원 목록 배열
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);//클릭한 업무
  const [isModalOpen, setIsModalOpen] = useState(false);//상세 모달 열림/닫힘 상태

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
  }, []); //컴포넌트가 처음 마운트 될 때만 실행

  // 초기 데이터 로드
  useEffect(() => {
    console.log('🚀 업무 관리 시스템 시작...');
    //1. localStorage에서 업무/직원 데이터 블러오기 - localStorage: 브라우저를 닫이도 데이터 유지
    const loadedTasks = loadTasks();
    const loadedEmployees = loadEmployees();
    setTasks(loadedTasks);
    setEmployees(loadedEmployees);
    console.log('✅ 데이터 로드 완료');

    //2. sessionStorage에서 저장된 로그인 정보 불러오기 (브라우저 종료 시 자동 삭제) 
    // - sessionStorage: 브라우저 탭을 닫으면 데이터 삭제
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

  }, []);

  const handleLogin = (employeeId: string, password: string) => {
    // Mock authentication
    const user = employees.find((emp) => emp.id === employeeId);

    //비밀번호 검증
    if (
      user &&
      ((employeeId === 'EMP001' && password === 'admin123') ||
        (employeeId === 'EMP002' && password === 'user123') ||
        password === 'password')
    ) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setCurrentPage('dashboard');

      // 로그인 정보를 sessionStorage에 저장
      sessionStorage.setItem('currentUser', JSON.stringify(user));

      console.log('👤 로그인:', user.name);
    } else {
      alert('로그인 정보가 올바르지 않습니다.');
    }
  };
  // 동작 순서: 입력한 ID로 직원 찾기 -> 비밀번호 확인 -> 싱공 시 : 상태 업데이트 + sessionStorage 저장 / 실패 시 : 알림

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
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> // Task 타입에서 3개 속성 제외
  ) => {
    // 1. 새로운 ID 생성 (기존 최대 ID + 1)
    const maxId = tasks.reduce((max, task) => { // 배열에서 최대값 찾기
      const num = parseInt(task.id.replace('T', ''));
      return num > max ? num : max;
    }, 0);

    // 2. 새 업무 객체 만들기
    const newTask: Task = {
      ...taskData,
      id: `T${String(maxId + 1).padStart(3, '0')}`, // 1-> "001"형태로 변환
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 3. 저장 및 상태 업데이트
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

  // 로그인 안 됨 -> 로그인 페이지
  if (!isLoggedIn || !currentUser) {
    return (
      <ThemeProvider>
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  // 로그인 됨 -> 메인 앱
  // currentPage 값에 따라 다른 페이지 컴포넌트를 보여줍니다
  // && 연산자: 왼쪽이 true일 때만 오른쪽 실행
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
//1. App.tsx는 앱의 두뇌: 모든 상태와 페이지 전환 관리
//2. 데이터 흐름: localStotage/sessionStorage -> State -> 자식 컴포넌트
//3. Props 전달: 자식 컴포넌트에 데이터와 함수를 전달해서 통신
//4. 조건부 렌더링: 상태에 따라 다른 화면 표시
