import React from 'react';
import { Card, Avatar } from 'flowbite-react';
import { useAuthStore } from '../../stores/auth';

import { RecentScoreChart } from './RecentScoreChart.tsx';
import { ReservedSpeechView } from './ReservedSpeechView.tsx';
import { FinishedSpeechView } from './FinishedSpeechView.tsx';


export const MyPage = () => {
	const authStore = useAuthStore();

	return (
		<>
			<Card className='w-3/4 mx-auto px-10 py-5'>
				<div className='w-full flex flex-row'>
					<div className='basis-1/3 gap-2 flex flex-col justify-center items-center'>
						<Avatar
							img={authStore.profileImage}
							alt='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
							size='xl'
							rounded
						/>
						<p className='text-2xl font-semibold tracking-tight'>{authStore.name}</p>
						<p className='text-md font-semibold text-gray-600'>{authStore.email}</p>
					</div>
					<div className='basis-2/3'>
						<RecentScoreChart/>
					</div>
				</div>
			</Card>

			<div className='w-3/4 mx-auto mt-7'>
				<ReservedSpeechView/>
			</div>

			<div className='w-3/4 mx-auto mt-7'>
				<FinishedSpeechView/>
			</div>
		</>
	);
};
