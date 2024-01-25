import { useEffect } from 'react';
import { Button } from 'flowbite-react';
import { CustomButton } from '../../../components/CustomButton.tsx';

export const InterviewPage = () => {
	useEffect(() => {}, []);

	return (
		<div className='p-10'>
			<div className='session-header flex justify-end'>
				<CustomButton size='lg' color='negative'>
					면접 종료
				</CustomButton>
			</div>
			<div className='session-content'>
				<div className='session-screen'></div>
			</div>
		</div>
	);
};
