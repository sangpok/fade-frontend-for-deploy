import RootLayout from '@Layouts/RootLayout';
import RootPage from '@Pages/Root/page';
import { lazy, Suspense } from 'react';
import { createRoutesFromElements, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

/**
 * React Router Dom에서는 lazy 기능을 지원하지만,
 * 특정 네이밍으로 Export를 해줘야 해서 React의 lazy를 사용함
 * */

/** Common */
const NotFoundPage = lazy(() => import('@Pages/NotFoundPage'));
const GlobalErrorPage = lazy(() => import('@Pages/GlobalErrorPage').then((module) => ({ default: module.default })));
const AppLayout = lazy(() => import('@Layouts/AppLayout').then((module) => ({ default: module.default })));

/** Root */
const LoginPage = lazy(() => import('@Pages/Root/Login/page').then((module) => ({ default: module.default })));
const SignUpPage = lazy(() => import('@Pages/Root/signup/page').then((module) => ({ default: module.default })));
const ArchivePage = lazy(() => import('@Pages/Root/archive/page').then((module) => ({ default: module.default })));
const VoteFAPPage = lazy(() => import('@Pages/Root/voteFAP/page').then((module) => ({ default: module.default })));
const FeedPage = lazy(() => import('@Pages/Root/feed/page').then((module) => ({ default: module.default })));
const MyPage = lazy(() => import('@Pages/Root/mypage/page').then((module) => ({ default: module.default })));

/** Auth */
const KakaoCallback = lazy(() => import('@Pages/Auth/KakaoCallback').then((module) => ({ default: module.default })));
const SignOut = lazy(() => import('@Pages/Auth/SignOut').then((module) => ({ default: module.default })));

export const routesFromElements = createRoutesFromElements(
  <Route element={<RootLayout />}>
    <Route path="/" ErrorBoundary={GlobalErrorPage}>
      <Route index element={<RootPage />} loader={async (params) => (await import('@Pages/Root/page')).loader(params)} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <Suspense fallback={<>앱 레이아웃 로딩중 !</>}>
              <AppLayout />
            </Suspense>
          }>
          <Route path="archive" element={<ArchivePage />} />
          <Route path="vote-fap" element={<VoteFAPPage />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>
      </Route>
    </Route>

    <Route path="/auth" ErrorBoundary={GlobalErrorPage}>
      <Route path="callback">
        <Route path="kakao">
          <Route index element={<KakaoCallback />} loader={async (params) => (await import('@Pages/Auth/KakaoCallback')).loader(params)} />
        </Route>
      </Route>
      <Route path="signout">
        <Route index element={<SignOut />} loader={async () => (await import('@Pages/Auth/SignOut')).loader()} />
      </Route>
    </Route>

    <Route path="*" Component={NotFoundPage} />
  </Route>
);
