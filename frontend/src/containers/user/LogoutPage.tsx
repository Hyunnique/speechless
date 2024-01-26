import { useEffect } from 'react';
import { axios } from '../../utils/axios.ts';
import { useAuthStore } from '../../stores/auth.ts';

export const LogoutPage = () => {
	const authStore = useAuthStore();
	useEffect(() => {
		authStore.clearAuth();
		location.href = '/';
	}, []);

	return <></>;
};
