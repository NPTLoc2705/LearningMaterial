import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useProgress } from './hooks/use-progress';
import { DashboardPage } from './pages/dashboard';
import { VocabularyListPage } from './pages/vocabulary-list';
import { VocabularyFlashcardsPage } from './pages/vocabulary-flashcards';
import { VocabularyQuizPage } from './pages/vocabulary-quiz';
import { GrammarListPage } from './pages/grammar-list';
import { GrammarLessonPage } from './pages/grammar-lesson';

export function App() {
  const progressHook = useProgress();

  return (
    <BrowserRouter>
      <Layout progress={progressHook.progress}>
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
      </Layout>
    </BrowserRouter>
  );
}

export default App;
