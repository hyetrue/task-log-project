import { ReactNode } from 'react';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../hooks/use-theme';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName: string;
  isAdmin: boolean;
}

export function Layout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  userName,
  isAdmin,
}: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'create', label: '업무 작성', icon: PlusCircle },
    { id: 'list', label: '업무 목록', icon: ListTodo },
    ...(isAdmin ? [{ id: 'admin', label: '관리자', icon: Settings }] : []),
  ];

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
      {/* 헤더 */}
      <header className='bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-50 transition-colors'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center gap-3'>
              <div className='custom-nav-logo'>🚀</div>
              <div>
                <h1 className='text-xl'>Task Log</h1>
              </div>
            </div>

            {/* 데스크탑 네비게이션 */}
            <nav className='hidden md:flex items-center gap-2'>
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    onClick={() => onNavigate(item.id)}
                    className={
                      currentPage === item.id
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                        : ''
                    }>
                    <Icon className='w-4 h-4 mr-2' />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            <div className='flex items-center gap-3'>
              <div className='hidden sm:block text-sm'>
                <span className='text-gray-600 dark:text-gray-400'>
                  환영합니다,{' '}
                </span>
                <span>{userName}</span>
              </div>

              {/* 다크모드 토글 */}
              <Button
                variant='ghost'
                size='icon'
                onClick={toggleTheme}
                className='hidden sm:flex'>
                {theme === 'light' ? (
                  <Moon className='w-4 h-4' />
                ) : (
                  <Sun className='w-4 h-4' />
                )}
              </Button>

              <Button
                variant='outline'
                onClick={onLogout}
                className='hidden sm:flex'>
                <LogOut className='w-4 h-4 mr-2' />
                로그아웃
              </Button>

              {/* 모바일 메뉴 버튼 */}
              <Button
                variant='ghost'
                className='md:hidden'
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? (
                  <X className='w-5 h-5' />
                ) : (
                  <Menu className='w-5 h-5' />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 모바일 네비게이션 */}
        {isMobileMenuOpen && (
          <div className='md:hidden border-t dark:border-gray-700 bg-white dark:bg-gray-800'>
            <div className='px-4 py-3 space-y-2'>
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start ${
                      currentPage === item.id
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                        : ''
                    }`}>
                    <Icon className='w-4 h-4 mr-2' />
                    {item.label}
                  </Button>
                );
              })}
              <div className='pt-3 border-t dark:border-gray-700'>
                <div className='text-sm mb-2 px-3'>
                  <span className='text-gray-600 dark:text-gray-400'>
                    환영합니다,{' '}
                  </span>
                  <span>{userName}</span>
                </div>

                {/* 모바일 다크모드 토글 */}
                <Button
                  variant='outline'
                  onClick={toggleTheme}
                  className='w-full justify-start mb-2'>
                  {theme === 'light' ? (
                    <>
                      <Moon className='w-4 h-4 mr-2' />
                      다크모드
                    </>
                  ) : (
                    <>
                      <Sun className='w-4 h-4 mr-2' />
                      라이트모드
                    </>
                  )}
                </Button>

                <Button
                  variant='outline'
                  onClick={onLogout}
                  className='w-full justify-start'>
                  <LogOut className='w-4 h-4 mr-2' />
                  로그아웃
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 메인 컨텐츠 */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {children}
      </main>

      {/* 푸터 */}
      <footer className='bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-12 transition-colors'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
            © 2025 Task Log. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
