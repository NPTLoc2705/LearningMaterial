import { Card } from '../../../components/ui/Card';
import { useAuth } from '../../../hooks/use-auth';

export function TeacherClassesPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66]">
          Quản lý lớp học
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413] mt-1">
          Danh sách lớp học của {user?.displayName ?? 'Giáo viên'}
        </h1>
      </div>

      <Card innerClassName="p-6 sm:p-8">
        <p className="text-sm text-[#6B6A66]">
          Không gian quản lý lớp học, học sinh và đường dẫn vào lớp (Class Link) đã sẵn sàng.
        </p>
      </Card>
    </div>
  );
}

export default TeacherClassesPage;
