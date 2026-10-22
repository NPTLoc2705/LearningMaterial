import React from 'react';
import { Navbar } from './Navbar';
import type { AppProgressState } from '../../types/progress';

export interface LayoutProps {
  children: React.ReactNode;
  progress: AppProgressState;
}

export function Layout({ children, progress }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA]">
      <Navbar progress={progress} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {children}
      </main>
      <footer className="w-full bg-[#FBFBFA] border-t border-[#E8E7E4] py-8 text-xs text-[#9E9D97]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-serif italic text-[#6B6A66]">
            Kho lưu trữ học tập · Unit 7: Cool Apps &amp; Unit 8: Into the Past
          </p>
          <p className="font-mono text-[11px] text-[#9E9D97]">
            Dữ liệu bám sát tài liệu bài học · Lưu trữ trực tiếp trên thiết bị
          </p>
        </div>
      </footer>
    </div>
  );
}
