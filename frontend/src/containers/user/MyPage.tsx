import React from 'react';
import { Button, Card, Avatar } from 'flowbite-react';
import { useAuthStore } from '../../stores/auth';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CustomButton } from '../../components/CustomButton.tsx';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const MyPage = () => {
	const authStore = useAuthStore();

	return (
		<>
			<Card className='w-3/4 mx-auto px-10 py-5'>
				<div className='w-full flex flex-row'>
					<div className='basis-1/3 flex flex-col gap-2 items-center'>
						<Avatar
							img={authStore.profileImage}
							alt='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
							size='xl'
							rounded
						/>
						<p className='text-2xl font-semibold tracking-tight'>{authStore.name}</p>
						<p className='text-md font-semibold text-gray-600'>{authStore.email}</p>
					</div>
					<div className='basis-2/3'></div>
				</div>
			</Card>
			<div className='w-3/4 mx-auto flex justify-center mt-5'>
				<CustomButton color='negative'>회원 데이터 삭제</CustomButton>
			</div>
		</>
	);
};
