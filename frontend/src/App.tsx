import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from './containers/layout/DefaultLayout.tsx';
import { IndexPage } from './containers/IndexPage.tsx';
import { LoginPage } from './containers/user/LoginPage.tsx';
import { LogoutPage } from './containers/user/LogoutPage.tsx';
import { GoogleCallback } from './containers/callback/GoogleCallback.tsx';
import { KakaoCallback } from './containers/callback/KakaoCallback.tsx';
import { NaverCallback } from './containers/callback/NaverCallback.tsx';
import { InterviewPage } from './containers/session/interview/InterviewPage.tsx';
import { SpeechPage } from './containers/session/speech/SpeechPage.tsx';
import { MyPage } from './containers/user/MyPage.tsx';
import { SpeechListPage } from './containers/speech/SpeechListPage.tsx';
import { SpeechDetailPage } from './containers/speech/SpeechDetailPage.tsx';
import { StatementWritePage } from './containers/statement/StatementWritePage.tsx';
import { InterviewEnterPage } from './containers/session/interview/InterviewEnterPage.tsx';
import { StatementDetailPage } from './containers/statement/StatementDetailPage.tsx';
import { SpeechCreatePage } from './containers/speech/SpeechCreatePage.tsx';
import { PrivateRoute } from './containers/layout/PrivateRoute.tsx';
import { AuthRoute } from './containers/layout/AuthRoute.tsx';
import { InterviewReportDetailPage } from './containers/report/InterviewReportDetailPage.tsx';
import ErrorPage from './error.tsx';
export default function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route element={<DefaultLayout />}>
						<Route element={<PrivateRoute />}>
							{/* 레이아웃 있음 && 로그인 필요 */}
							<Route path='/speech' element={<SpeechListPage />} />
							<Route path='/speech/:id' element={<SpeechDetailPage />} />
							<Route path='/speech/write/:id?' element={<SpeechCreatePage />} />
							<Route path='/mypage' element={<MyPage />} />
							<Route path='/statement/write/:id?' element={<StatementWritePage />} />
							<Route path='/statement/detail/:id' element={<StatementDetailPage />} />
							<Route path='/interview' element={<InterviewEnterPage />} />
							<Route path='/interview/report/:id' element={<InterviewReportDetailPage />} />
						</Route>
					</Route>

					<Route element={<DefaultLayout />}>
						<Route element={<AuthRoute />}>
							{/* 레이아웃 있음 && 비로그인 필요 */}
							<Route path='/login' element={<LoginPage />} />
						</Route>
					</Route>

					<Route element={<DefaultLayout />}>
						{/* 레이아웃 있음 && 로그인 상관없음*/}
						<Route path='/' element={<IndexPage />} />
						<Route path='/error/:id?' element={<ErrorPage />} />
					</Route>

					<Route element={<PrivateRoute />}>
						{/* 레이아웃 없음 && 로그인 필요 */}
						<Route path='/session/interview' element={<InterviewPage />} />
						<Route path='/session/speech' element={<SpeechPage />} />
					</Route>

					<Route element={<AuthRoute />}>{/* 레이아웃 없음 && 비로그인 필요 */}</Route>

					{/* 레이아웃 없음 && 로그인 상관없음 */}
					<Route path='/logout' element={<LogoutPage />} />
					<Route path='/auth/google' element={<GoogleCallback />} />
					<Route path='/auth/kakao' element={<KakaoCallback />} />
					<Route path='/auth/naver' element={<NaverCallback />} />

					{/* 존재하지 않는 경로에 대한 처리 */}
					<Route
						path='*'
						element={
							<Navigate
								to='/error'
								replace={true}
								state={{
									code: 404,
									message: '존재하지 않는 페이지입니다.',
								}}
							/>
						}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}
