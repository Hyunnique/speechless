import { useCallback, useEffect } from 'react';

import { axios } from '../../utils/axios.ts';
import { useAuthStore } from '../../stores/auth.ts';

export const GoogleCallback = () => {
	const authStore = useAuthStore();

	const handleGoogleCallback = useCallback(async () => {
		try {
			const response = await axios.post('/auth/login', null, {
				params: {
					code: new URL(document.location.toString()).searchParams.get('code'),
					'redirect-uri': import.meta.env.VITE_GOOGLE_REDIRECT_URI,
				},
			});

			authStore.setAuth(response.data);
		} catch (e) {
			console.error(e);
		}
	}, [authStore]);

	useEffect(() => {
		handleGoogleCallback();
	}, [handleGoogleCallback]);

	return <></>;
};
