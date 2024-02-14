import React from 'react';
import { Card, Avatar } from 'flowbite-react';
import { useAuthStore } from '../../stores/auth';

import { CustomButton } from '../../components/CustomButton.tsx';
import { RecentScoreChart } from './RecentScoreChart.tsx';


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
		</>
	);
};
