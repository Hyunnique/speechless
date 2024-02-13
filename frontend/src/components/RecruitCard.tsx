import { Badge, Card } from 'flowbite-react';
import React, { ReactNode } from 'react';

import type { CommunityView } from '../types/Community.ts';
import { CustomBadge } from './CustomBadge.tsx';

interface RecruitCardProps {
	session: CommunityView;
}
export const RecruitCard: React.FC<RecruitCardProps> = ({ session }) => {
	const badges = [];

	badges.push(session.category);

	return (
		<Card>
			<div className='flex justify-between mb-2 gap-2'>
				<div>조회수 {session.hit}</div>
				{badges.map((badge) => {
					return (
						<CustomBadge size='md' key={badge} color='yellow' bordered>
							{badge}
						</CustomBadge>
					);
				})}
			</div>
			<div className='text-xl border-b-2 pb-1'>{session.title}</div>
			<div className='px-1'>{session.content}</div>
			<div className='flex flex-col gap-2'>
				<div className='flex'>
					<CustomBadge size='md' color='red' bordered>
						<svg
							className='w-2.5 h-2.5 me-1.5'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='currentColor'
							viewBox='0 0 20 20'
						>
							<path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z' />
						</svg>
						마감 2일 전!
					</CustomBadge>
				</div>
				<div className='flex justify-between items-center'>
					<CustomBadge size='md' color='white' bordered>
						{session.sessionStart.toLocaleDateString()} {session.sessionStart.toLocaleTimeString()}
					</CustomBadge>
					<span className='text-sm font-bold'>
						{session.currentParticipants} / {session.maxParticipants}
					</span>
				</div>
			</div>
		</Card>
	);
};
