import { getKidAvatar } from '../../data/kid-avatars';
import type { ClassroomStudentDto } from '../../types/api';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface StudentRosterListProps {
  students: ClassroomStudentDto[];
  isArchived: boolean;
  onRemoveStudent: (studentId: number) => Promise<void>;
}

export function StudentRosterList({
  students,
  isArchived,
  onRemoveStudent,
}: StudentRosterListProps) {
  const activeStudents = students.filter(
    (s) => s.enrollmentStatus === 'Active'
  );

  return (
    <Card innerClassName="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold text-[#141413]">
            Danh sách học sinh ({activeStudents.length})
          </h2>
          <p className="text-xs text-[#6B6A66] mt-0.5">
            Học sinh đang ghi danh hoạt động trong lớp học này.
          </p>
        </div>
      </div>

      {activeStudents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E8E7E4] py-10 text-center text-xs sm:text-sm text-[#6B6A66]">
          Chưa có học sinh nào trong lớp. Hãy thêm học sinh ở biểu mẫu phía trên.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeStudents.map((student) => {
            const avatar = getKidAvatar(student.avatarKey);
            return (
              <div
                key={student.studentId}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#E8E7E4] bg-[#FBFBFA] p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl shrink-0 ${avatar.bgClass}`}
                  >
                    <span aria-hidden="true">{avatar.emoji}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#141413] truncate">
                      {student.displayName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {student.loginMode === 'Password' ? (
                        <span className="font-mono text-[11px] text-[#6B6A66] truncate">
                          @{student.username}
                        </span>
                      ) : (
                        <Badge variant="green" size="sm">
                          Hồ sơ QR
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {!isArchived && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void onRemoveStudent(student.studentId)}
                  >
                    Rời lớp
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
