import { Button, Card, Carousel } from 'flowbite-react';
import { TitledCard } from '../components/TitledCard.tsx';
import { Calendar } from '../components/Calendar.tsx';

import type { CommunityView } from '../types/Community.ts';
import { RecruitCard } from '../components/RecruitCard.tsx';

import Banner1 from '../assets/images/banner-1.png';
import Banner2 from '../assets/images/banner-2.png';

import { useEffect, useState } from 'react';
import { useLocalAxios } from '../utils/axios.ts';

const awaitingSpeechSessions: CommunityView[] = [
	{
		id: 1,
		writer: '김민수',
		category: 'IT',
		title: 'IT 자유주제 5분 스피치',
		content:
			'안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
		currentParticipants: 4,
		maxParticipants: 8,
		deadline: new Date(),
		sessionStart: new Date(),
		invisible: false,
		private: false,
		createdAt: new Date(),
	},
	{
		id: 2,
		writer: '김민수',
		category: '자기소개',
		title: '자소서 기반 자기소개 피드백',
		content:
			'안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
		currentParticipants: 3,
		maxParticipants: 4,
		deadline: new Date(),
		sessionStart: new Date(),
		invisible: false,
		private: false,
		createdAt: new Date(),
	},
	{
		id: 3,
		writer: '김민수',
		category: '자유',
		title: '싸피 PT 면접 준비하실분!!',
		content:
			'안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
		currentParticipants: 6,
		maxParticipants: 6,
		deadline: new Date(),
		sessionStart: new Date(),
		invisible: false,
		private: true,
		createdAt: new Date(),
	},
	{
		id: 4,
		writer: '김민수',
		category: '게임',
		title: '본인이 하는 게임 소개하기',
		content:
			'안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
		currentParticipants: 2,
		maxParticipants: 4,
		deadline: new Date(),
		sessionStart: new Date(),
		invisible: false,
		private: false,
		createdAt: new Date(),
	},
];
export const IndexPage = () => {
	const localAxiosWithAuth = useLocalAxios();
	const [speechSessions, setSpeechSessions] = useState<CommunityView[]>([]);

	useEffect(() => {
		localAxiosWithAuth
			.get('/community/list')
			.then((res) => {
				// TODO: 백엔드에서 받은 response로 글을 채워준다
				setSpeechSessions(res.data);
			})
			.catch((err) => {
				// TODO: 백엔드 response가 없어서 무조건 에러가 날 것이므로 임시로 더미 데이터를 넣어준다
				setSpeechSessions(awaitingSpeechSessions);
			});

		//axios.get("/kakao");
	}, []);

	return (
		<>
			<div className='relative h-56 sm:h-64 xl:h-80 2xl:h-96 mb-8'>
				<Carousel slideInterval={5000}>
					<img src={Banner2} alt='...' />
					<img src={Banner2} alt='...' />
					<img src={Banner2} alt='...' />
					<img src={Banner1} alt='...' />
					<img src={Banner1} alt='...' />
				</Carousel>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-2'>
				<TitledCard title='내가 참여할 발표 세션'>
					<ul className='flex flex-col gap-4 h-full justify-center'>
						{awaitingSpeechSessions.slice(0, 3).map((session) => {
							return (
								<li key={session.id} className='flex justify-between border-b-2 px-2 pb-2'>
									<div className='flex flex-col justify-between'>
										<p className='text-md font-semibold'>{session.title}</p>
										<p className='text-sm'>
											{session.sessionStart.toLocaleDateString()}{' '}
											{session.sessionStart.toLocaleTimeString()}
										</p>
									</div>
									<div className='flex flex-col justify-between items-center'>
										<p className='text-sm font-semibold'>
											{session.currentParticipants} / {session.maxParticipants}
										</p>
										<Button size='xs' color='purple' disabled>
											참여하기
										</Button>
										{/* 참여하기 버튼은 시작 시간 10분 전부터 활성화? */}
									</div>
								</li>
							);
						})}
					</ul>
				</TitledCard>
				<TitledCard title='일정'>
					<div className='flex flex-col justify-center h-full'>
						<Calendar />
					</div>
				</TitledCard>
			</div>
			<div>
				<p className='text-2xl ml-4 mb-4'>이번 주 인기 발표 모집 글</p>
				<div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4'>
					{speechSessions.map((session) => {
						return <RecruitCard key={session.id} session={session} />;
					})}
				</div>
			</div>
		</>
	);
};
