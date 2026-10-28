import { useNavigate, useParams } from 'react-router-dom';
import { KidActionButton } from '../components/kids/KidActionButton';
import { KidProfileTile } from '../components/kids/KidProfileTile';
import { KidRememberedCard } from '../components/kids/KidRememberedCard';
import { useClassAccess } from '../hooks/use-class-access';

export function ClassAccessPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const {
    classInfo,
    rememberedProfile,
    isLoading,
    enteringStudentId,
    isLinkInvalid,
    clearRememberedProfile,
    enterAsStudent,
  } = useClassAccess(token ?? '');

  const handleSelectStudent = async (studentId: number) => {
    try {
      await enterAsStudent(studentId);
      navigate('/student', { replace: true });
    } catch {
      // Handled gracefully
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBFBFA] px-4 text-center">
        <div className="text-5xl mb-3" aria-hidden="true">
          🎈
        </div>
        <p className="font-serif text-xl font-semibold text-[#141413]">
          Loading class...
        </p>
      </div>
    );
  }

  if (isLinkInvalid || !classInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBFBFA] px-4 py-10 text-center">
        <div className="max-w-sm w-full rounded-3xl border-2 border-[#E8E7E4] bg-white p-6 sm:p-8 space-y-5 shadow-subtle">
          <div className="text-6xl" aria-hidden="true">
            🔍
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#141413]">
            Ask Your Teacher
          </h1>
          <p className="text-sm text-[#6B6A66]">
            This class link is not active right now.
          </p>
          <KidActionButton
            icon="🏠"
            variant="secondary"
            fullWidth
            onClick={() => navigate('/', { replace: true })}
          >
            Go Home
          </KidActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-1.5">
          <span className="inline-block font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-[#EDF3EC] text-[#346538]">
            {classInfo.levelDisplayName}
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#141413]">
            {rememberedProfile ? 'Welcome Back!' : 'Tap Your Picture'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6A66]">
            {classInfo.classroomName}
          </p>
        </header>

        {rememberedProfile ? (
          <KidRememberedCard
            profile={rememberedProfile}
            isEntering={enteringStudentId === rememberedProfile.studentId}
            onConfirm={(id) => void handleSelectStudent(id)}
            onNotMe={clearRememberedProfile}
          />
        ) : classInfo.profiles.length === 0 ? (
          <div className="max-w-sm mx-auto rounded-3xl border-2 border-dashed border-[#E8E7E4] bg-white p-8 text-center space-y-3">
            <div className="text-5xl" aria-hidden="true">
              🐣
            </div>
            <p className="font-serif text-lg font-semibold text-[#141413]">
              No Pictures Yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {classInfo.profiles.map((profile) => (
              <KidProfileTile
                key={profile.studentId}
                profile={profile}
                isEntering={enteringStudentId === profile.studentId}
                disabled={enteringStudentId !== null}
                onSelect={(id) => void handleSelectStudent(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassAccessPage;

