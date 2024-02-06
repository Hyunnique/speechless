import { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth.ts';
import { useNavigate } from "react-router-dom";

export const LogoutPage = () => {
	const authStore = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		authStore.clearAuth();
		navigate('/');
	}, []);

	return <></>;
};
