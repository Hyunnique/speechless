import Axios from 'axios';

const axios = Axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401) {
			console.log('request accessToken');
		}
		return Promise.reject(error);
	},
);

export { axios };
