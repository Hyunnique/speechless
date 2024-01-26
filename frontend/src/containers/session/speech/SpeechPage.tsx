import { useEffect } from 'react';
import { Button } from 'flowbite-react';
import { CustomButton } from '../../../components/CustomButton.tsx';

export const SpeechPage = () => {
	useEffect(() => {}, []);

	return (
		<div className='p-10 w-[100vw] h-[100vh] bg-gray-100'>
			<div className='session-header flex justify-end'>
				<CustomButton size='lg' color='negative'>
					세션 종료
				</CustomButton>
			</div>
			<div className='session-content grid grid-cols-2'>
				<div className='session-screen'>
					<div className='session-screen-header'>
						<div className='session-indicator-expression'>
							<span>표정</span>
							<span></span>
						</div>
						<div className='session-indicator-voice'>
							<span>발음</span>
							<span></span>
						</div>
					</div>
				</div>
				<div className='session-ui'>

				</div>
			</div>
		</div>
	);
};
