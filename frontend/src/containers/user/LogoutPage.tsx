import { useEffect } from 'react';
import { axios } from '../../utils/axios.ts';
import { useAuthStore } from '../../stores/auth.ts';

export const LogoutPage = () => {
	const authStore = useAuthStore();
	useEffect(() => {
		authStore.setAccessToken('');
		authStore.setRefreshToken('');
		authStore.setProvider('');
		authStore.setId('');
		authStore.setEmail('');
		authStore.setName('');
		authStore.setProfileImage('');

		location.href = '/';
	}, []);

	return <></>;
};
