import { List, Button } from 'flowbite-react';

export interface MyPageItemProps {
	title: string;
	date: string;
}

export const MyPageItem: React.FC<MyPageItemProps> = ({ title, date }: MyPageItemProps) => (
	<List.Item className='mt-4 p-4 flex bg-primary-50 border-2 shadow-sm rounded-3xl'>
		<div className='basis-1/2'>
			<p className='m-2 text-lg tracking-tight text-gray-900 dark:text-white w-full'>{title}</p>
		</div>
		<div className='basis-1/4'>
			<p className='m-2 tracking-tight text-gray-900 dark:text-white w-full'>{date}</p>
		</div>

		<div className='basis-1/4 flex flex-auto'>
			<Button className='m-2 bg-primary-400 text-white'>{}</Button>
			<Button className='m-2 bg-primary-400 text-white'>{}</Button>
		</div>
	</List.Item>
);
