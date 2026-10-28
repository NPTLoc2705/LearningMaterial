import { getKidAvatar } from '../../data/kid-avatars';
import type { ClassAccessProfileDto } from '../../types/api';

export interface KidProfileTileProps {
  profile: ClassAccessProfileDto;
  isEntering: boolean;
  disabled: boolean;
  onSelect: (studentId: number) => void;
}

export function KidProfileTile({
  profile,
  isEntering,
  disabled,
  onSelect,
}: KidProfileTileProps) {
  const avatar = getKidAvatar(profile.avatarKey);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(profile.studentId)}
      className={`min-h-[144px] min-w-[64px] w-full rounded-3xl border-2 p-4 flex flex-col items-center justify-center gap-3 select-none touch-manipulation transition-transform active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-[#141413] disabled:opacity-60 ${avatar.bgClass}`}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/90 border border-black/5 flex items-center justify-center text-4xl sm:text-5xl shadow-subtle">
        <span aria-hidden="true">{avatar.emoji}</span>
      </div>
      <span className="font-serif font-bold text-base sm:text-lg text-[#141413] text-center line-clamp-1">
        {isEntering ? 'Starting...' : profile.nickname}
      </span>
    </button>
  );
}

