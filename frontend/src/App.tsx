import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

export default function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route element={<DefaultLayout />}>
						{/* 레이아웃이 필요한 페이지 */}
						<Route path='/' element={<IndexPage />} />
						<Route path='/login' element={<LoginPage />} />
						<Route path='/SpeechList' element={<SpeechListPage />} />
						<Route path='/SpeechDetail' element={<SpeechDetailPage />} />
						<Route path='/mypage' element={<MyPage />} />
					</Route>
					<Route>
						{/* 레이아웃이 필요없는 페이지 */}
						<Route path='/logout' element={<LogoutPage />} />
						<Route path='/auth/google' element={<GoogleCallback />} />
						<Route path='/auth/kakao' element={<KakaoCallback />} />
						<Route path='/auth/naver' element={<NaverCallback />} />
						<Route path='/session/interview' element={<InterviewPage />} />
						<Route path='/session/speech' element={<SpeechPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}
