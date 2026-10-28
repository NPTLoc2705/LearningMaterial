import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ChangePasswordCard } from '../components/auth/ChangePasswordCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { getHomeRouteForRole, useAuth } from '../hooks/use-auth';

export function LoginPage() {
  const {
    user,
    isAuthenticated,
    isInitializing,
    isSubmitting,
    error,
    clearError,
    login,
    changePassword,
    logout,
  } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA] px-4">
        <p className="font-mono text-xs text-[#9E9D97] animate-pulse">
          Đang kiểm tra trạng thái đăng nhập...
        </p>
      </div>
    );
  }

  if (isAuthenticated && user && !user.mustChangePassword) {
    return <Navigate to={getHomeRouteForRole(user.role)} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({
        username: username.trim(),
        password,
      });
      if (!response.user.mustChangePassword) {
        navigate(getHomeRouteForRole(response.user.role), { replace: true });
      }
    } catch {
      // Error is managed by useAuth hook
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await changePassword({ currentPassword, newPassword });
      if (user) {
        navigate(getHomeRouteForRole(user.role), { replace: true });
      }
    } catch {
      // Error is managed by useAuth hook
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#FBFBFA] px-4 py-12">
      <div className="max-w-md w-full mx-auto mb-6 text-center">
        <div className="w-10 h-10 rounded-xl bg-[#141413] text-white flex items-center justify-center font-serif font-bold text-base mx-auto mb-3 shadow-subtle">
          JE
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413]">
          Junior English Platform
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6A66] mt-1">
          Đăng nhập dành cho Giáo viên &amp; Học sinh khối Pioneer
        </p>
      </div>

      {isAuthenticated && user?.mustChangePassword ? (
        <ChangePasswordCard
          displayName={user.displayName}
          isSubmitting={isSubmitting}
          error={error}
          onSubmit={handleChangePassword}
          onLogout={logout}
        />
      ) : (
        <Card className="max-w-md w-full mx-auto" innerClassName="p-6 sm:p-8">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-[#FDEBEC] border border-[#FAD4D6] px-3.5 py-2.5 text-xs text-[#9F2F2D]"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-[#141413] mb-1.5"
              >
                Tên đăng nhập
              </label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => {
                  if (error) clearError();
                  setUsername(e.target.value);
                }}
                placeholder="Ví dụ: teacher_loc hoặc pioneer_student"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[#141413] mb-1.5"
              >
                Mật khẩu
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  if (error) clearError();
                  setPassword(e.target.value);
                }}
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#EFEFEA] text-xs text-[#6B6A66] space-y-2">
            <p>
              <strong>Lưu ý cho phụ huynh khối Young (Kiddie – Explore 4):</strong>{' '}
              Các bé không cần mật khẩu — vui lòng quét mã QR hoặc mở đường dẫn lớp học
              do giáo viên gửi.
            </p>
            <div className="pt-1">
              <Link
                to="/"
                className="font-mono text-[11px] text-[#141413] underline hover:opacity-80"
              >
                ← Quay về kho lưu trữ tài liệu mẫu
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default LoginPage;

