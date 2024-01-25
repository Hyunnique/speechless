import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthResponse {
	id: string;
	name: string;
	email: string;
	profileImageUrl: string;
}

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	authResponse: AuthResponse;
}

interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	tokenExpireAt: Date | null;
	id: string | null;
	name: string | null;
	email: string | null;
	profileImage: string | null;

	setAuth: (loginResponse: LoginResponse) => void;
}

const useAuthStore = create<AuthState>()(
	// persist를 통해 localStorage에 로그인 정보 저장
	persist(
		(set) => ({
			accessToken: null,
			refreshToken: null,
			tokenExpireAt: null,
			id: null,
			name: null,
			email: null,
			profileImage: null,

			setAuth: ({ accessToken, refreshToken, authResponse }) => {
				set({
					accessToken,
					refreshToken,
					id: authResponse.id,
					name: authResponse.name,
					email: authResponse.email,
					profileImage: authResponse.profileImageUrl,
				});

				set({ tokenExpireAt: new Date(Date.now() + import.meta.env.VITE_JWT_EXPIRE_TIME) });
			},
		}),
		{
			name: 'auth-storage',
		},
	),
);

export { useAuthStore };
