import Axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import { useAuthStore } from "../stores/auth.ts";

// Local Axios Custom Hook
// 파라미터로 isAuth: boolean을 받으며, 기본값은 true
// Token 인증이 필요한 요청에 대해서는 파라미터를 주지 않아도 자동으로 헤더에 토큰을 넣어주고, Interceptor를 통한 재인증을 시도함
// 로그인 등 일부 Token 인증이 필요없는 요청에 대해서만 파라미터로 false를 명시해주면 된다.

const useLocalAxios = (isAuth?: boolean): AxiosInstance => {
	const authenticated: boolean = isAuth !== undefined ? isAuth : true;
	const authStore = useAuthStore();

	const instance = Axios.create({
		baseURL: import.meta.env.VITE_API_BASE_URL
	});

	// 인증이 필요할 경우 Interceptor를 사용함
	if (authenticated) {
		// Request Intercept를 통해 헤더에 토큰을 넣어줌
		instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
			if (authStore.accessToken) {
				config.headers = config.headers || {};
				config.headers.Authorization = `Bearer ${authStore.accessToken}`;
			}

			return config;
		});

		// Response Intercept를 통해 401 에러가 발생할 경우 재인증을 시도함
		instance.interceptors.response.use(
			(response) => response,
			async (error) => {
				if (error.response.status === 401 && error.config.url !== '/auth/refresh') {
					if (!authStore.refreshToken) {
						authStore.clearAuth();
						return Promise.reject(error);
					}

					const refreshAxios = Axios.create({
						baseURL: import.meta.env.VITE_API_BASE_URL,
					})

					const refreshResponse = await refreshAxios.get('/auth/refresh', {
						headers: {
							Refresh: authStore.refreshToken
						}
					})

					if (!refreshResponse.data.accessToken) {
						authStore.clearAuth();
						return Promise.reject(error);
					}

					console.log(refreshResponse);
					authStore.setAccessToken(refreshResponse.data.accessToken);

					return instance.request(error.config);
				}

				return Promise.reject(error);
			},
		);
	}

	return instance;
}

export { useLocalAxios };
