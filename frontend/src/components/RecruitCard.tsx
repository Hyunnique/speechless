import { Badge, Card } from 'flowbite-react';
import React, {ReactNode, useEffect, useState} from 'react';

import type { CommunityView } from '../types/Community.ts';
import { CustomBadge } from './CustomBadge.tsx';

import moment from 'moment';
import DOMPurify from 'dompurify';

interface RecruitCardProps {
	session: CommunityView;
}
export const RecruitCard: React.FC<RecruitCardProps> = ({ session }) => {
	const badges = [];

	const [ leftTime, setLeftTime ] = useState(0);

	useEffect(() => {
		setLeftTime(Math.floor(moment.duration(moment(session.deadline).diff(moment())).asHours()));
	}, []);
	badges.push(session.category);

	return (
		<Card className='hover:bg-gray-50'>
			<div className='flex justify-between mb-2 gap-2'>
				<div className='flex items-center gap-2'>
					<span className='material-symbols-outlined text-md'>visibility</span>
					<span className='text-sm font-semibold'>{session.hit}</span>
				</div>
				{badges.map((badge) => {
					return (
						<CustomBadge size='md' key={badge} color='purple' bordered>
							{badge}
						</CustomBadge>
					);
				})}
			</div>
			<div className='text-xl border-b-2 pb-1 text-ellipsis overflow-hidden whitespace-nowrap'>{session.title}</div>
			<div className='px-1 h-[140px] text-ellipsis overflow-hidden text-left' dangerouslySetInnerHTML={{
				__html: DOMPurify.sanitize(session.content)
			}} />
			<div className='flex flex-col gap-2'>
				<div className='flex'>
					<CustomBadge size='md' color={
						leftTime < 0
							? 'gray'
							: leftTime <= 24
								? 'red'
								: leftTime <= 72
									? 'yellow'
									: 'green'
					} bordered>
						<div className='flex items-center gap-2'>
							<span className='material-symbols-outlined text-sm'>schedule</span>
							<span>
								<span>
									{
										leftTime < 0
											? '모집 종료'
											: leftTime <= 1
												? '마감 임박!'
												: leftTime >= 24
													? '마감 ' + Math.floor(leftTime / 24) + '일 전'
													: '마감 ' + leftTime + '시간 전'
									}
								</span>
							</span>
						</div>
					</CustomBadge>
				</div>
				<div className='flex justify-between items-center'>
					<CustomBadge size='md' color='white' bordered>
						<div className='flex items-center gap-2'>
							<span className='material-symbols-outlined text-sm'>mic</span>
							<span>{moment(session.sessionStart).format('YYYY. MM. DD. HH:mm')}</span>
						</div>
					</CustomBadge>
					{/*<span className='text-sm font-bold'>*/}
					{/*	{session.currentParticipants} / {session.maxParticipants}*/}
					{/*</span>*/}
				</div>
			</div>
		</Card>
	);
};
