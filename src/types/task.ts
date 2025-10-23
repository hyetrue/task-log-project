export type TaskStatus = 'in-progress' | 'completed' | 'on-hold';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  content: string;
  status: TaskStatus;
  priority: TaskPriority;
  date: string;
  employeeId: string;
  employeeName: string;
  team: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  team: string;
  role: 'employee' | 'admin';
}
