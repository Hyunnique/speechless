import { Card } from 'flowbite-react';
import React, { ReactNode } from 'react';

interface TitledCardProps {
	children: ReactNode;
	title: string;
}
export const TitledCard: React.FC<TitledCardProps> = ({ children, title }) => {
	return (
		<Card className='mx-2 bg-gray-50 border-2 mb-20 h-[350px]'>
			<div className='w-full h-full flex flex-col'>
				<p className='text-2xl mb-4'>{title}</p>
				<div className='flex-1'>{children}</div>
			</div>
		</Card>
	);
};
