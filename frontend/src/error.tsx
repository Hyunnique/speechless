import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CustomButton } from './components/CustomButton';

export default function ErrorPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const { state } = location;
	const { code, message } = state || {};

	return (
		<>
			<p>에러가 발생했습니다.</p>
			{id && <p>에러 코드 {id}</p>}
			{code && <p>에러 코드: {code}</p>}
			{message && <p>메시지: {message}</p>}

			<CustomButton color='blue' onClick={() => navigate('/')}>
				{' '}
				메인으로 돌아가기{' '}
			</CustomButton>
		</>
	);
}
