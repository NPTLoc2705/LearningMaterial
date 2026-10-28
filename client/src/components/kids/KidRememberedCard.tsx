import { getKidAvatar } from '../../data/kid-avatars';
import type { ClassAccessProfileDto } from '../../types/api';
import { KidActionButton } from './KidActionButton';

export interface KidRememberedCardProps {
  profile: ClassAccessProfileDto;
  isEntering: boolean;
  onConfirm: (studentId: number) => void;
  onNotMe: () => void;
}

export function KidRememberedCard({
  profile,
  isEntering,
  onConfirm,
  onNotMe,
}: KidRememberedCardProps) {
  const avatar = getKidAvatar(profile.avatarKey);

  return (
    <div className="max-w-sm w-full mx-auto rounded-3xl border-2 border-[#E8E7E4] bg-white p-6 sm:p-8 text-center space-y-6 shadow-subtle">
      <div
        className={`w-28 h-28 rounded-3xl border-2 mx-auto flex items-center justify-center text-6xl ${avatar.bgClass}`}
      >
        <span aria-hidden="true">{avatar.emoji}</span>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#6B6A66]">
          Hi there! 👋
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
          {profile.nickname}
        </h2>
      </div>

      <div className="space-y-3 pt-2">
        <KidActionButton
          icon="▶"
          variant="primary"
          fullWidth
          disabled={isEntering}
          onClick={() => onConfirm(profile.studentId)}
        >
          {isEntering ? 'Starting...' : "Let's Play!"}
        </KidActionButton>

        <KidActionButton
          icon="🔄"
          variant="secondary"
          fullWidth
          disabled={isEntering}
          onClick={onNotMe}
        >
          Not me?
        </KidActionButton>
      </div>
    </div>
  );
}

