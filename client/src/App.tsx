import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useProgress } from './hooks/use-progress';

const DashboardPage = lazy(() =>
  import('./pages/dashboard').then((m) => ({ default: m.DashboardPage }))
);
const VocabularyListPage = lazy(() =>
  import('./pages/vocabulary-list').then((m) => ({ default: m.VocabularyListPage }))
);
const VocabularyFlashcardsPage = lazy(() =>
  import('./pages/vocabulary-flashcards').then((m) => ({ default: m.VocabularyFlashcardsPage }))
);
const VocabularyQuizPage = lazy(() =>
  import('./pages/vocabulary-quiz').then((m) => ({ default: m.VocabularyQuizPage }))
);
const GrammarListPage = lazy(() =>
  import('./pages/grammar-list').then((m) => ({ default: m.GrammarListPage }))
);
const GrammarLessonPage = lazy(() =>
  import('./pages/grammar-lesson').then((m) => ({ default: m.GrammarLessonPage }))
);

function RouteLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="font-mono text-xs text-[#9E9D97] animate-pulse">
        Đang tải nội dung bài học...
      </div>
    </div>
  );
}

export function App() {
  const progressHook = useProgress();

  return (
    <BrowserRouter>
      <Layout progress={progressHook.progress}>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<DashboardPage progressHook={progressHook} />} />
            <Route
              path="/vocabulary"
              element={<VocabularyListPage progressHook={progressHook} />}
            />
            <Route
              path="/vocabulary/flashcards"
              element={<VocabularyFlashcardsPage progressHook={progressHook} />}
            />
            <Route
              path="/vocabulary/quiz"
              element={<VocabularyQuizPage progressHook={progressHook} />}
            />
            <Route
              path="/grammar"
              element={<GrammarListPage progressHook={progressHook} />}
            />
            <Route
              path="/grammar/:topicId"
              element={<GrammarLessonPage progressHook={progressHook} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
