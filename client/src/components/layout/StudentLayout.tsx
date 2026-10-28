import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../ui/Button';
import { IconBook, IconHome } from '../ui/Icons';

export interface StudentLayoutProps {
  children?: React.ReactNode;
}

const STUDENT_LINKS = [
  { to: '/student', label: 'Bài học', icon: IconHome, end: true },
  { to: '/student/review', label: 'Ôn tập', icon: IconBook, end: false },
];

const getNavClasses = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all min-h-[44px] ${
    isActive
      ? 'bg-[#141413] text-white shadow-subtle'
      : 'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F4F3EF]'
  }`;

export function StudentLayout({ children }: StudentLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA]">
      <header className="sticky top-0 z-40 w-full bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#E8E7E4]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 sm:gap-6">
              <NavLink to="/student" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#141413] text-white flex items-center justify-center font-serif font-bold text-sm">
                  JE
                </div>
                <div>
                  <span className="font-serif font-semibold text-[#141413] text-sm sm:text-base tracking-tight block">
                    Góc Học Sinh
                  </span>
                  {user && (
                    <span className="font-mono text-[11px] text-[#6B6A66] block">
                      {user.displayName}
                    </span>
                  )}
                </div>
              </NavLink>

              <nav className="flex items-center gap-1.5">
                {STUDENT_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={getNavClasses}
                    >
                      <Icon size={15} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              Thoát
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
