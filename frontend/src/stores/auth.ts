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
	accessToken: string | undefined;
	refreshToken: string | undefined;
	tokenExpireAt: Date | undefined;
	id: string | undefined;
	name: string | undefined;
	email: string | undefined;
	profileImage: string | undefined;

	setAuth: (loginResponse: LoginResponse) => void;
	setAccessToken: (accessToken: string) => void;
	clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
	// persist를 통해 localStorage에 로그인 정보 저장
	persist(
		(set) => ({
			accessToken: undefined,
			refreshToken: undefined,
			tokenExpireAt: undefined,
			id: undefined,
			name: undefined,
			email: undefined,
			profileImage: undefined,

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
			setAccessToken: (accessToken: string) => {
				set({ accessToken });
				set({ tokenExpireAt: new Date(Date.now() + import.meta.env.VITE_JWT_EXPIRE_TIME) });
			},
			clearAuth: () => {
				set({
					accessToken: undefined,
					refreshToken: undefined,
					tokenExpireAt: undefined,
					id: undefined,
					name: undefined,
					email: undefined,
					profileImage: undefined,
				});
			}
		}),
		{
			name: 'auth-storage',
		},
	),
);

export { useAuthStore };
