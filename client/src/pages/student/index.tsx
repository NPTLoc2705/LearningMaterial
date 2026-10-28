import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/use-auth';

export function StudentHomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66]">
          Học tập
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413] mt-1">
          Xin chào, {user?.displayName ?? 'Học sinh'}!
        </h1>
      </div>

      <Card innerClassName="p-6 sm:p-8">
        <p className="text-sm text-[#6B6A66]">
          Danh sách bài học được giao và tiến độ rèn luyện của em sẽ hiển thị tại đây.
        </p>
      </Card>
    </div>
  );
}

export default StudentHomePage;
