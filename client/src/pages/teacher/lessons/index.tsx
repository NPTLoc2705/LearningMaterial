import { Card } from '../../../components/ui/Card';

export function TeacherLessonsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66]">
          Quản lý nội dung
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413] mt-1">
          Thư viện bài giảng
        </h1>
      </div>

      <Card innerClassName="p-6 sm:p-8">
        <p className="text-sm text-[#6B6A66]">
          Danh sách bài giảng theo cấp độ và trạng thái biên tập.
        </p>
      </Card>
    </div>
  );
}

export default TeacherLessonsPage;
