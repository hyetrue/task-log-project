import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Building2, Lock, User, Database } from 'lucide-react';

interface LoginPageProps {
  onLogin: (employeeId: string, password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(employeeId, password);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-4'>
        <Card className='shadow-lg border-0 dark:border'>
          <CardHeader className='space-y-4 text-center'>
            <div className='flex justify-center'></div>
            <div>
              <CardTitle className='text-2xl'>🚀 Task Log</CardTitle>
              <CardDescription>
                직원 ID와 비밀번호로 로그인하세요
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='employeeId'>아이디</Label>
                <div className='relative'>
                  <User className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />
                  <Input
                    id='employeeId'
                    type='text'
                    placeholder='아이디를 입력하세요'
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className='pl-10'
                    required
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>비밀번호</Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />
                  <Input
                    id='password'
                    type='password'
                    placeholder='비밀번호를 입력하세요'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='pl-10'
                    required
                  />
                </div>
              </div>
              <Button
                type='submit'
                className='w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-600'>
                로그인
              </Button>
              <div className='text-center text-sm text-gray-500 dark:text-gray-400 mt-4'>
                테스트 계정: EMP001 / admin123 (관리자)
                <br />
                EMP002 / user123 (직원)
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className='shadow-lg border-0 dark:border bg-gray-100 dark:bg-gray-800'>
          <CardContent className='pt-6'>
            <div className='flex items-start gap-3'>
              <Database className='w-5 h-5 text-yellow-300 dark:text-yellow-300 mt-0.5 flex-shrink-0' />
              <div className='space-y-1'>
                <p className='text-sm'>
                  <span className='text-gray-700 dark:text-gray-400'>
                    임시 서버 기능:
                  </span>{' '}
                  모든 업무 데이터는 브라우저의 localStorage에 JSON 형태로
                  저장됩니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
