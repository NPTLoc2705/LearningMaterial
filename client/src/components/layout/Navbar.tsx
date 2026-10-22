import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import {
  IconBook,
  IconCards,
  IconQuiz,
  IconGrammar,
  IconHome,
  IconMenu,
  IconClose,
  IconCheck,
} from '../ui/Icons';
import type { AppProgressState } from '../../types/progress';
import vocabData from '../../data/vocabulary.json';

export interface NavbarProps {
  progress: AppProgressState;
}

export function Navbar({ progress }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalWords = vocabData.length;
  const knownCount = Object.values(progress.words).filter(
    (w) => w.status === 'known'
  ).length;

  const navLinks = [
    { to: '/', label: 'Tổng quan', icon: IconHome },
    { to: '/vocabulary', label: 'Từ vựng', icon: IconBook },
    { to: '/vocabulary/flashcards', label: 'Thẻ ghi nhớ', icon: IconCards },
    { to: '/vocabulary/quiz', label: 'Luyện từ vựng', icon: IconQuiz },
    { to: '/grammar', label: 'Ngữ pháp', icon: IconGrammar },
  ];

  const getLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all touch-manipulation ${
      isActive
        ? 'bg-[#141413] text-white shadow-subtle'
        : 'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F4F3EF]'
    }`;

  const getMobileLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all touch-manipulation ${
      isActive
        ? 'bg-[#141413] text-white'
        : 'text-[#6B6A66] hover:bg-[#F4F3EF] hover:text-[#141413]'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#E8E7E4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#141413] text-white flex items-center justify-center font-serif font-bold text-sm shadow-subtle">
              7·8
            </div>
            <div>
              <span className="font-serif font-semibold text-[#141413] text-sm tracking-tight block">
                Góc Học Tập
              </span>
              <span className="font-mono text-[10px] text-[#9E9D97] uppercase tracking-wider block">
                Unit 7 &amp; 8 Archive
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={getLinkClasses}
                  end={link.to === '/'}
                >
                  <Icon size={14} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Mastery Badge & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <Badge variant="green" size="sm" className="hidden sm:inline-flex">
              <IconCheck size={12} />
              <span>{knownCount}/{totalWords} từ đã thuộc</span>
            </Badge>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#6B6A66] hover:text-[#141413] hover:bg-[#F4F3EF] transition-colors touch-manipulation"
              aria-label="Mở menu điều hướng"
            >
              {isMobileMenuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E7E4] bg-white px-4 py-3 space-y-1 shadow-diffuse animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={getMobileLinkClasses}
                onClick={() => setIsMobileMenuOpen(false)}
                end={link.to === '/'}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
          <div className="pt-2.5 mt-2 border-t border-[#EFEFEA] flex items-center justify-between px-2 text-xs text-[#6B6A66]">
            <span>Tiến độ ghi nhớ:</span>
            <Badge variant="green" size="sm">
              {knownCount} / {totalWords} từ
            </Badge>
          </div>
        </div>
      )}
    </header>
  );
}
