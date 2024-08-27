import RootLayout from '@Layouts/RootLayout';
import RootPage from '@Pages/Root/page';
import { lazy, Suspense } from 'react';
import { createRoutesFromElements, Route } from 'react-router-dom';

/**
 * React Router Dom에서는 lazy 기능을 지원하지만,
 * 특정 네이밍으로 Export를 해줘야 해서 React의 lazy를 사용함
 * */

/** Common */
const NotFoundPage = lazy(() => import('@Pages/NotFoundPage').then((module) => ({ default: module.default })));
const GlobalErrorPage = lazy(() => import('@Pages/GlobalErrorPage').then((module) => ({ default: module.default })));
const AppLayout = lazy(() => import('@Layouts/AppLayout').then((module) => ({ default: module.default })));

/** Skeleton */
const AppLayoutSkeletonUI = lazy(() => import('@Layouts/AppLayout.skeleton').then((module) => ({ default: module.default })));
const ArchiveSkeletonUI = lazy(() => import('@Pages/Root/archive/page.skeleton').then((module) => ({ default: module.default })));
const BoomarkSkeltonUI = lazy(() => import('@Pages/Root/mypage/bookmark/page.skeleton').then((module) => ({ default: module.default })));
const MyPageFeedSkeletonUI = lazy(() => import('@Pages/Root/mypage/feed/page.skeleton').then((module) => ({ default: module.default })));
const MyPageSkeletonUI = lazy(() => import('@Pages/Root/mypage/page.skeleton').then((module) => ({ default: module.default })));
const VoteHistorySkeletonUI = lazy(() => import('@Pages/Root/mypage/voteHistory/page.skeleton').then((module) => ({ default: module.default })));
const SubscribeListSkeletonUI = lazy(() => import('@Pages/Root/subscribe/list/page.skeleton').then((module) => ({ default: module.default })));
const SubscribeSkeletonUI = lazy(() => import('@Pages/Root/subscribe/page.skeleton').then((module) => ({ default: module.default })));
const UserFeedSkeletonUI = lazy(() => import('@Pages/Root/user/page.skeleton').then((module) => ({ default: module.default })));
const VoteFAPSkeletonUI = lazy(() => import('@Pages/Root/voteFAP/page.skeleton').then((module) => ({ default: module.default })));

/** Root */
const LoginPage = lazy(() => import('@Pages/Root/login/page').then((module) => ({ default: module.default })));
const SignUpPage = lazy(() => import('@Pages/Root/signup/page').then((module) => ({ default: module.default })));
const ArchivePage = lazy(() => import('@Pages/Root/archive/page').then((module) => ({ default: module.default })));
const VoteFAPPage = lazy(() => import('@Pages/Root/voteFAP/page').then((module) => ({ default: module.default })));
const SubscribePage = lazy(() => import('@Pages/Root/subscribe/page').then((module) => ({ default: module.default })));
const SubscribeListPage = lazy(() => import('@Pages/Root/subscribe/list/page').then((module) => ({ default: module.default })));
const MyPage = lazy(() => import('@Pages/Root/mypage/page').then((module) => ({ default: module.default })));
const MyPageFeed = lazy(() => import('@Pages/Root/mypage/feed/page').then((module) => ({ default: module.default })));
const MyPageVoteHistory = lazy(() => import('@Pages/Root/mypage/voteHistory/page').then((module) => ({ default: module.default })));
const MyPageBookmark = lazy(() => import('@Pages/Root/mypage/bookmark/page').then((module) => ({ default: module.default })));
const UserFeedPage = lazy(() => import('@Pages/Root/user/page').then((module) => ({ default: module.default })));

/** Auth */
const KakaoCallback = lazy(() => import('@Pages/Auth/KakaoCallback').then((module) => ({ default: module.default })));
const SignOut = lazy(() => import('@Pages/Auth/SignOut').then((module) => ({ default: module.default })));

export const routesFromElements = createRoutesFromElements(
  <Route element={<RootLayout />}>
    <Route
      path="/"
      errorElement={
        <Suspense>
          <GlobalErrorPage />
        </Suspense>
      }>
      <Route index element={<RootPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route
        element={
          <Suspense fallback={<AppLayoutSkeletonUI />}>
            <AppLayout />
          </Suspense>
        }>
        <Route
          path="archive"
          element={
            <Suspense fallback={<ArchiveSkeletonUI />}>
              <ArchivePage />
            </Suspense>
          }
        />
        <Route
          path="vote-fap"
          element={
            <Suspense fallback={<VoteFAPSkeletonUI />}>
              <VoteFAPPage />
            </Suspense>
          }
        />
        <Route path="subscribe">
          <Route
            index
            element={
              <Suspense fallback={<SubscribeSkeletonUI />}>
                <SubscribePage />
              </Suspense>
            }
          />
          <Route
            path="list"
            element={
              <Suspense fallback={<SubscribeListSkeletonUI />}>
                <SubscribeListPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="mypage">
          <Route
            index
            element={
              <Suspense fallback={<MyPageSkeletonUI />}>
                <MyPage />
              </Suspense>
            }
          />
          <Route
            path="feed"
            element={
              <Suspense fallback={<MyPageFeedSkeletonUI />}>
                <MyPageFeed />
              </Suspense>
            }
          />
          <Route
            path="vote-history"
            element={
              <Suspense fallback={<VoteHistorySkeletonUI />}>
                <MyPageVoteHistory />
              </Suspense>
            }
          />
          <Route
            path="bookmark"
            element={
              <Suspense fallback={<BoomarkSkeltonUI />}>
                <MyPageBookmark />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="user"
          element={
            <Suspense fallback={<UserFeedSkeletonUI />}>
              <UserFeedPage />
            </Suspense>
          }
        />
      </Route>
    </Route>

    <Route
      path="/auth"
      errorElement={
        <Suspense>
          <GlobalErrorPage />
        </Suspense>
      }>
      <Route path="callback">
        <Route path="kakao">
          <Route index element={<KakaoCallback />} loader={async (params) => (await import('@Pages/Auth/KakaoCallback')).loader(params)} />
        </Route>
      </Route>
      <Route path="signout">
        <Route index element={<SignOut />} loader={async () => (await import('@Pages/Auth/SignOut')).loader()} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Route>
);
