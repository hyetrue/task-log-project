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

// =======================================================
  ** 설명:**
  - `LoginPageProps`: 이 컴포넌트가 받을 props의 타입 정의
  - `onLogin`: 부모(App.tsx)에서 전달받은 함수
  - 매개변수: `employeeId`(문자열), `password`(문자열)
  - 반환값: `void`(없음)

**부모-자식 통신:**

App.tsx (부모)

  ↓ onLogin 함수 전달

LoginPage.tsx (자식) -> 로그인 버튼 클릭 시 onLogin 호출

  ↑ employeeId, password 전달

App.tsx에서 로그인 처리
//========================================================

// State 선언 - 입력 값 관리
  const [employeeId, setEmployeeId] = useState(''); //사용자가 입력한 아이디 저장
  const [password, setPassword] = useState(''); //사용자가 입력한 비밀번호 저장
  //초기값은 빈 문자열 ''

  //폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //페이지 새로고침 방지
    onLogin(employeeId, password); // 부모에게 데이터 전달
    //입력된 값들을 부모 컴포넌트의 onLogin 함수로 전달
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
                  {/* 아이콘 (절대 위치) */}
                  <User className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />
                  {/* 입력 필드 */}
                  <Input
                    id='employeeId'
                    type='text'
                    placeholder='아이디를 입력하세요'
                    value={employeeId} // 현재 상태 값
                    onChange={(e) => setEmployeeId(e.target.value)} //입력 시 상태 업로드
                    className='pl-10' // 왼쪽 패팅(아이콘 공간)
                    required // 필수 입력
                  />
                </div>
              </div>
              {/* 핵심 개념 - 제어 컴포넌트 (Controlled Component):
                  사용자 입력
                      ↓                    
                  onChange 이벤트 발생
                      ↓
                  setEmployeeId(새 값)실행
                      ↓
                  employeeId 상태 업데이트
                      ↓
                  value={employeeId}로 화면에 반영

              */}
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
              {/*동작순서:
                  1. 버튼 클릭
                  2. type='sumit'이므로 <form>의 onSubmit이벤트 발생
                  3. handleSumit 함수 발생
                  4. onLogin(employeeId, password)호출
              */}
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
## 데이트 흐름 정리
[사용자]
    ↓ 아이디/비밀번호 입력
[Input 필드]
    ↓ onChange 이벤트
[employeeId, password 상태 업데이트]
    ↓ 로그인 버튼 클릭
[handleSubmit 실행]
    ↓ e.preventDefault()
[onLogin 호출]
    ↓ 데이터 전달
[App.tsx의 handleLogin]
    ↓ 로그인 처리

Q1: e.preventDefault()가 필요한 이유: HTML폼은 기본적으로 제출 시 페이지를 새로고침합니다. 이걸 막지 않으면
- 상태가 모두 초기화됨
- SPA의 장점 사라짐
- 로그인 처리가 제대로 안됨

Q2: value={employeeId}와 onChange를 같이 써야되는 이유: React의 단방향 데이터 흐름때문에
- value: React 상태 -> 화면(표시)
- onChange: 화면 입력 -> React 상태(업데이트)
- 둘 다 있어야 입력과 표시가 동기화됨

Q3: 왜 LoginPage에서 직접 로그인 처리를 안할까?
A: 책임 분리 원칙:
- LoginPage: UI만 담당(입력 받기)
- App.tsx: 로직 담당(인증 처리)
- 이렇게 하면 코드 재사용성과 유지보수성이 좋아짐

//////////////////////////////////////////////////////////////////

1. 단순한 폼 컴포넌트: 입력 -> 제출 -> 부모에게 전달
2. 제어 컴포넌트 패턴: React가 입력 값을 완전히 관리
3. Props로 통신: 부모의 함수를 받아서 데이터 전달
4. UI 컴포넌트 활용: shadcn/ui의 Card, Input, Button 사용

