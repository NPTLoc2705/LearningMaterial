import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IconBook, IconHome } from '../ui/Icons';

export interface TeacherLayoutProps {
  children?: React.ReactNode;
}

const TEACHER_LINKS = [
  { to: '/teacher/classes', label: 'Lớp học', icon: IconHome },
  { to: '/teacher/lessons', label: 'Bài giảng', icon: IconBook },
];

const getNavClasses = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
    isActive
      ? 'bg-[#141413] text-white shadow-subtle'
      : 'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F4F3EF]'
  }`;

export function TeacherLayout({ children }: TeacherLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA]">
      <header className="sticky top-0 z-40 w-full bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#E8E7E4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-6">
              <NavLink
                to="/teacher/classes"
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-[#141413] text-white flex items-center justify-center font-serif font-bold text-sm">
                  JE
                </div>
                <div>
                  <span className="font-serif font-semibold text-[#141413] text-sm tracking-tight block">
                    Cổng Giáo Viên
                  </span>
                  <span className="font-mono text-[10px] text-[#9E9D97] uppercase tracking-wider block">
                    Junior English Platform
                  </span>
                </div>
              </NavLink>

              <nav className="hidden sm:flex items-center gap-1">
                {TEACHER_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={getNavClasses}
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden md:flex items-center gap-2 text-xs text-[#6B6A66]">
                  <span className="font-medium text-[#141413]">
                    {user.displayName}
                  </span>
                  <Badge variant="slate" size="sm">
                    {user.role === 'Admin' ? 'Quản trị' : 'Giáo viên'}
                  </Badge>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
