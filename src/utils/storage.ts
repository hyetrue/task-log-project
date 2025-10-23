import { Task, Employee } from '../types/task';

const STORAGE_KEYS = {
  TASKS: 'intranet_tasks',
  EMPLOYEES: 'intranet_employees',
  LAST_SYNC: 'intranet_last_sync',
};

// 초기 데이터
const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP001',
    name: '이혜진',
    team: '개발팀',
    role: 'admin',
  },
  {
    id: 'EMP002',
    name: '이성호',
    team: '개발팀',
    role: 'employee',
  },
  {
    id: 'EMP003',
    name: '최예은',
    team: '디자인팀',
    role: 'employee',
  },
  {
    id: 'EMP004',
    name: '이현진',
    team: '마케팅팀',
    role: 'employee',
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'T001',
    title: '사용자 인증 기능 개발',
    content: '로그인 및 회원가입 API 개발 완료. 프론트엔드 연동 진행 중입니다.',
    status: 'in-progress',
    priority: 'high',
    date: '2025-10-17',
    employeeId: 'EMP002',
    employeeName: '이성호',
    team: '개발팀',
    createdAt: '2025-10-17T09:00:00Z',
    updatedAt: '2025-10-17T09:00:00Z',
  },
  {
    id: 'T002',
    title: 'UI 디자인 시스템 구축',
    content: '컴포넌트 라이브러리 설계 및 스타일 가이드 작성을 완료했습니다.',
    status: 'completed',
    priority: 'medium',
    date: '2025-10-16',
    employeeId: 'EMP003',
    employeeName: '최예은',
    team: '디자인팀',
    attachments: ['design_system_v1.pdf'],
    createdAt: '2025-10-16T09:00:00Z',
    updatedAt: '2025-10-16T17:00:00Z',
  },
  {
    id: 'T003',
    title: '마케팅 캠페인 기획',
    content: '신규 서비스 론칭을 위한 마케팅 전략 수립 중입니다.',
    status: 'on-hold',
    priority: 'low',
    date: '2025-10-15',
    employeeId: 'EMP004',
    employeeName: '이현진',
    team: '마케팅팀',
    createdAt: '2025-10-15T09:00:00Z',
    updatedAt: '2025-10-15T09:00:00Z',
  },
  {
    id: 'T004',
    title: 'API 문서 작성',
    content: 'REST API 엔드포인트 문서화 작업 진행 중입니다.',
    status: 'in-progress',
    priority: 'medium',
    date: '2025-10-17',
    employeeId: 'EMP002',
    employeeName: '이성호',
    team: '개발팀',
    createdAt: '2025-10-17T10:00:00Z',
    updatedAt: '2025-10-17T10:00:00Z',
  },
  {
    id: 'T005',
    title: '데이터베이스 최적화',
    content: '쿼리 성능 개선 및 인덱스 최적화 완료했습니다.',
    status: 'completed',
    priority: 'high',
    date: '2025-10-14',
    employeeId: 'EMP001',
    employeeName: '이혜진',
    team: '개발팀',
    createdAt: '2025-10-14T09:00:00Z',
    updatedAt: '2025-10-14T18:00:00Z',
  },
];

// localStorage에서 데이터 로드
export function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (stored) {
      const tasks = JSON.parse(stored);
      console.log('✅ 업무 데이터 로드됨:', tasks.length, '개');
      return tasks;
    }
  } catch (error) {
    console.error('❌ 업무 데이터 로드 실패:', error);
  }

  // 초기 데이터 저장
  console.log('📝 초기 업무 데이터 생성 중...');
  saveTasks(INITIAL_TASKS);
  return INITIAL_TASKS;
}

export function loadEmployees(): Employee[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('❌ 직원 데이터 로드 실패:', error);
  }

  // 초기 데이터 저장
  saveEmployees(INITIAL_EMPLOYEES);
  return INITIAL_EMPLOYEES;
}

// localStorage에 데이터 저장
export function saveTasks(tasks: Task[]): boolean {
  try {
    const jsonData = JSON.stringify(tasks, null, 2);
    localStorage.setItem(STORAGE_KEYS.TASKS, jsonData);
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    console.log('💾 업무 데이터 저장됨:', tasks.length, '개');
    return true;
  } catch (error) {
    console.error('❌ 업무 데이터 저장 실패:', error);
    return false;
  }
}

export function saveEmployees(employees: Employee[]): boolean {
  try {
    const jsonData = JSON.stringify(employees, null, 2);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, jsonData);
    return true;
  } catch (error) {
    console.error('❌ 직원 데이터 저장 실패:', error);
    return false;
  }
}

// 단일 업무 추가
export function addTask(task: Task): boolean {
  const tasks = loadTasks();
  tasks.unshift(task); // 최신 업무를 맨 앞에 추가
  return saveTasks(tasks);
}

// 단일 업무 수정
export function updateTask(taskId: string, updates: Partial<Task>): boolean {
  const tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === taskId);

  if (index === -1) {
    console.error('❌ 업무를 찾을 수 없음:', taskId);
    return false;
  }

  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return saveTasks(tasks);
}

// 단일 업무 삭제
export function deleteTask(taskId: string): boolean {
  const tasks = loadTasks();
  const filtered = tasks.filter((t) => t.id !== taskId);

  if (filtered.length === tasks.length) {
    console.error('❌ 삭제할 업무를 찾을 수 없음:', taskId);
    return false;
  }

  return saveTasks(filtered);
}

// JSON 파일로 다운로드
export function downloadTasksAsJson(): void {
  const tasks = loadTasks();
  const jsonData = JSON.stringify(tasks, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  console.log('📥 JSON 파일 다운로드 완료');
}

// JSON 파일에서 불러오기
export function uploadTasksFromJson(file: File): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const tasks = JSON.parse(content) as Task[];

        // 데이터 검증
        if (!Array.isArray(tasks)) {
          throw new Error('유효하지 않은 데이터 형식입니다.');
        }

        saveTasks(tasks);
        console.log('📤 JSON 파일에서 업무 데이터 불러옴:', tasks.length, '개');
        resolve(tasks);
      } catch (error) {
        console.error('❌ JSON 파일 읽기 실패:', error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };

    reader.readAsText(file);
  });
}

// 데이터 초기화
export function resetStorage(): void {
  saveTasks(INITIAL_TASKS);
  saveEmployees(INITIAL_EMPLOYEES);
  console.log('🔄 데이터 초기화 완료');
}

// 마지막 동기화 시간
export function getLastSyncTime(): string | null {
  return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
}

// 스토리지 상태 정보
export function getStorageInfo() {
  const tasks = loadTasks();
  const employees = loadEmployees();
  const lastSync = getLastSyncTime();

  return {
    tasksCount: tasks.length,
    employeesCount: employees.length,
    lastSync: lastSync ? new Date(lastSync).toLocaleString('ko-KR') : '없음',
    storageSize: new Blob([
      localStorage.getItem(STORAGE_KEYS.TASKS) || '',
      localStorage.getItem(STORAGE_KEYS.EMPLOYEES) || '',
    ]).size,
  };
}
