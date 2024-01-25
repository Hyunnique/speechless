import { Button, Card } from 'flowbite-react';
import { CustomButton } from '../../components/CustomButton.tsx';

import GoogleIcon from '../../assets/images/google.png';
import KakaoIcon from '../../assets/images/kakao.png';
import NaverIcon from '../../assets/images/naver.png';

export const LoginPage = () => {
	const googleAuth = () => {
		location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
			import.meta.env.VITE_GOOGLE_CLIENT_ID
		}&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20profile%20email`;
	};
	const kakaoAuth = () => {
		location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${
			import.meta.env.VITE_KAKAO_CLIENT_ID
		}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;
	};
	const naverAuth = () => {
		location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=${
			import.meta.env.VITE_NAVER_CLIENT_ID
		}&redirect_uri=${import.meta.env.VITE_NAVER_REDIRECT_URI}&state=${'RANDOM_STATE'}&response_type=code`;
	};

	return (
		<Card className='w-full max-w-[500px] mx-auto h-[400px] mt-20 border-2'>
			<p className='text-2xl mx-auto font-semibold mb-10'>Speechless에 로그인</p>

			<CustomButton
				onClick={googleAuth}
				color='google'
				size='lg'
				bordered
				className='w-3/4 mx-auto py-2 flex items-center justify-center gap-3'
			>
				<img src={GoogleIcon} alt='G' className='w-8 h-8' />
				<span>구글 계정으로 로그인</span>
			</CustomButton>
			<CustomButton
				onClick={kakaoAuth}
				color='kakao'
				size='lg'
				bordered
				className='w-3/4 mx-auto py-2 flex items-center justify-center gap-3'
			>
				<img src={KakaoIcon} alt='K' className='w-8 h-8' />
				<span>카카오 계정으로 로그인</span>
			</CustomButton>
			<CustomButton
				onClick={naverAuth}
				color='naver'
				size='lg'
				bordered
				className='w-3/4 mx-auto py-2 flex items-center justify-center gap-3'
			>
				<img src={NaverIcon} alt='N' className='w-8 h-8' />
				<span>네이버 계정으로 로그인</span>
			</CustomButton>
		</Card>
	);
};
