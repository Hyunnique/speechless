import { useCallback, useEffect } from 'react';

import { axios } from '../../utils/axios.ts';
import { useAuthStore } from '../../stores/auth.ts';

export const NaverCallback = () => {
	const authStore = useAuthStore();

	const handleNaverCallback = useCallback(async () => {
		try {
			const response = await axios.post('/auth/login', null, {
				params: {
					code: new URL(document.location.toString()).searchParams.get('code'),
					'redirect-uri': import.meta.env.VITE_NAVER_REDIRECT_URI,
				},
			});

			authStore.setAuth(response.data);
		} catch (e) {
			console.error(e);
		}
	}, [authStore]);

	useEffect(() => {
		handleNaverCallback();
	}, [handleNaverCallback]);

	return <></>;
};
