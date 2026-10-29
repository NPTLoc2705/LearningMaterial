import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { RoleRoute } from './components/auth/RoleRoute';
import { Layout } from './components/layout/Layout';
import { StudentLayout } from './components/layout/StudentLayout';
import { TeacherLayout } from './components/layout/TeacherLayout';
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
const LoginPage = lazy(() =>
  import('./pages/login').then((m) => ({ default: m.LoginPage }))
);
const ClassAccessPage = lazy(() =>
  import('./pages/class-access').then((m) => ({ default: m.ClassAccessPage }))
);
const TeacherClassesPage = lazy(() =>
  import('./pages/teacher/classes').then((m) => ({ default: m.TeacherClassesPage }))
);
const TeacherClassDetailPage = lazy(() =>
  import('./pages/teacher/classes/class-detail').then((m) => ({
    default: m.TeacherClassDetailPage,
  }))
);
const TeacherLessonsPage = lazy(() =>
  import('./pages/teacher/lessons').then((m) => ({ default: m.TeacherLessonsPage }))
);
const TeacherLessonDetailPage = lazy(() =>
  import('./pages/teacher/lessons/lesson-detail').then((m) => ({
    default: m.TeacherLessonDetailPage,
  }))
);
const StudentHomePage = lazy(() =>
  import('./pages/student').then((m) => ({ default: m.StudentHomePage }))
);
const StudentLessonHubPage = lazy(() =>
  import('./pages/student/lesson-hub').then((m) => ({
    default: m.StudentLessonHubPage,
  }))
);
const SpeechTestPage = lazy(() =>
  import('./pages/dev/speech-test').then((m) => ({
    default: m.SpeechTestPage,
  }))
);
const LookListenRepeatActivity = lazy(() =>
  import('./pages/student/activities/LookListenRepeat').then((m) => ({
    default: m.LookListenRepeatActivity,
  }))
);
const ListenAndTapPictureActivity = lazy(() =>
  import('./pages/student/activities/ListenAndTapPicture').then((m) => ({
    default: m.ListenAndTapPictureActivity,
  }))
);
const PictureAndWordMatchActivity = lazy(() =>
  import('./pages/student/activities/PictureAndWordMatch').then((m) => ({
    default: m.PictureAndWordMatchActivity,
  }))
);
const WordScrambleActivity = lazy(() =>
  import('./pages/student/activities/WordScramble').then((m) => ({
    default: m.WordScrambleActivity,
  }))
);
const GrammarUsagePracticeActivity = lazy(() =>
  import('./pages/student/activities/GrammarUsagePractice').then((m) => ({
    default: m.GrammarUsagePracticeActivity,
  }))
);
const SeniorGrammarFlowPage = lazy(() =>
  import('./pages/student/SeniorGrammarFlow').then((m) => ({
    default: m.SeniorGrammarFlowPage,
  }))
);
const StudentGrammarHubPage = lazy(() =>
  import('./pages/student/grammar-hub').then((m) => ({
    default: m.StudentGrammarHubPage,
  }))
);
const StudentResultPage = lazy(() =>
  import('./pages/student/results').then((m) => ({
    default: m.StudentResultPage,
  }))
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
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          {/* Platform Auth & Young Class Link Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/c/:token" element={<ClassAccessPage />} />
          <Route path="/dev/speech-test" element={<SpeechTestPage />} />

          {/* Platform Teacher & Admin Routes */}
          <Route
            path="/teacher"
            element={
              <RoleRoute allowedRoles={['Admin', 'Teacher']}>
                <TeacherLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Navigate to="classes" replace />} />
            <Route path="classes" element={<TeacherClassesPage />} />
            <Route path="classes/:id" element={<TeacherClassDetailPage />} />
            <Route path="lessons" element={<TeacherLessonsPage />} />
            <Route path="lessons/:id" element={<TeacherLessonDetailPage />} />
            <Route path="*" element={<Navigate to="/teacher/classes" replace />} />
          </Route>

          {/* Platform Student Routes */}
          <Route
            path="/student"
            element={
              <RoleRoute allowedRoles={['Student']}>
                <StudentLayout />
              </RoleRoute>
            }
          >
            <Route index element={<StudentHomePage />} />
            <Route path="grammar" element={<StudentGrammarHubPage />} />
            <Route path="grammar/:topicId" element={<SeniorGrammarFlowPage />} />
            <Route path="lessons/:id" element={<StudentLessonHubPage />} />
            <Route path="lessons/:id/grammar" element={<SeniorGrammarFlowPage />} />
            <Route path="lessons/:id/look-listen-repeat" element={<LookListenRepeatActivity />} />
            <Route path="lessons/:id/listen-pick-picture" element={<ListenAndTapPictureActivity />} />
            <Route path="lessons/:id/picture-word-match" element={<PictureAndWordMatchActivity />} />
            <Route path="lessons/:id/word-scramble" element={<WordScrambleActivity />} />
            <Route path="lessons/:id/grammar-usage-practice" element={<GrammarUsagePracticeActivity />} />
            <Route path="activities/grammar-usage-practice" element={<GrammarUsagePracticeActivity />} />
            <Route path="sessions/:id/result" element={<StudentResultPage />} />
            <Route path="review" element={<StudentHomePage />} />
            <Route path="*" element={<Navigate to="/student" replace />} />
          </Route>

          {/* Legacy Archive Portal Routes (Read-Only / Untouched) */}
          <Route
            element={
              <Layout progress={progressHook.progress}>
                <Outlet />
              </Layout>
            }
          >
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
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
