import { SignedMediaImage } from '../common/SignedMediaImage';
import type { StudentVocabularyPreviewDto } from '../../types/api';

export interface KidVocabularyCardProps {
  item: StudentVocabularyPreviewDto;
}

export function KidVocabularyCard({ item }: KidVocabularyCardProps) {
  return (
    <div className="rounded-3xl border-2 border-[#E8E7E4] bg-white p-4 sm:p-5 flex flex-col items-center text-center gap-3 shadow-subtle">
      <SignedMediaImage
        imageKey={item.imageKey}
        alt={item.word}
        fallbackText="🖼️"
        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border border-[#E8E7E4] bg-[#F4F3EF] text-4xl"
      />

      <div className="space-y-1">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141413]">
          {item.word}
        </h3>
        {item.exampleEn && (
          <p className="text-xs sm:text-sm text-[#6B6A66]">{item.exampleEn}</p>
        )}
      </div>
    </div>
  );
}

