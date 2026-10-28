export interface KidAvatarOption {
  key: string;
  labelVi: string;
  emoji: string;
  bgClass: string;
}

export const KID_AVATARS: readonly KidAvatarOption[] = [
  { key: 'fox', labelVi: 'Cáo nhỏ', emoji: '🦊', bgClass: 'bg-[#FFF3E6] border-[#F8D8B8]' },
  { key: 'panda', labelVi: 'Gấu trúc', emoji: '🐼', bgClass: 'bg-[#F4F3EF] border-[#E0DFD9]' },
  { key: 'tiger', labelVi: 'Hổ con', emoji: '🐯', bgClass: 'bg-[#FFF7E0] border-[#F5E0A3]' },
  { key: 'koala', labelVi: 'Gấu Koala', emoji: '🐨', bgClass: 'bg-[#EEF2F6] border-[#D3DCE6]' },
  { key: 'owl', labelVi: 'Cú mèo', emoji: '🦉', bgClass: 'bg-[#F6EFEA] border-[#E3D3C6]' },
  { key: 'dolphin', labelVi: 'Cá heo', emoji: '🐬', bgClass: 'bg-[#EBF5FB] border-[#C6E2F5]' },
  { key: 'rabbit', labelVi: 'Thỏ trắng', emoji: '🐰', bgClass: 'bg-[#FDF0F5] border-[#F5D0DF]' },
  { key: 'dino', labelVi: 'Khủng long', emoji: '🦖', bgClass: 'bg-[#EDF7ED] border-[#C9E7CA]' },
  { key: 'unicorn', labelVi: 'Kỳ lân', emoji: '🦄', bgClass: 'bg-[#F5EEFB] border-[#DFCCF2]' },
  { key: 'penguin', labelVi: 'Chim cánh cụt', emoji: '🐧', bgClass: 'bg-[#EEF4F8] border-[#CFDCE6]' },
  { key: 'lion', labelVi: 'Sư tử', emoji: '🦁', bgClass: 'bg-[#FFF5E5] border-[#F3D9B1]' },
  { key: 'bee', labelVi: 'Ong vàng', emoji: '🐝', bgClass: 'bg-[#FEF9E6] border-[#F6E6A8]' },
];

export function getKidAvatar(avatarKey: string | null | undefined): KidAvatarOption {
  if (!avatarKey) return KID_AVATARS[0];
  return KID_AVATARS.find((item) => item.key === avatarKey) ?? KID_AVATARS[0];
}

