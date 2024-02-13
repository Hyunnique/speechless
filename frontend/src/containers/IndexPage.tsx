import { Button, Card, Carousel } from 'flowbite-react';
import { TitledCard } from '../components/TitledCard.tsx';
import { Calendar } from '../components/Calendar.tsx';

import type { CommunityResponse, CommunityView } from '../types/Community.ts';
import { RecruitCard } from '../components/RecruitCard.tsx';

import Banner1 from '../assets/images/banner-1.png';
import Banner2 from '../assets/images/banner-2.png';
import Banner3 from '../assets/images/banner-3.png';
import Banner4 from '../assets/images/banner-4.png';
//import { Banner1, Banner2 } from '../components/Banners.tsx';

import { useEffect, useState } from 'react';
import { useLocalAxios } from '../utils/axios.ts';
import { useNavigate } from 'react-router-dom';
const awaitingSpeechSessions: CommunityView[] = [
	//향후, Custom hook으로 변환 useEffect 정리, 스크롤 바가 밀리는 현상 해결해야함(SpeechSearch 컴포넌트 플로팅이 이유로 추정)=>일단 해결..
	{
		id: 1,
		writer: '김민수',
		category: 'IT',
		title: 'IT 자유주제 5분 스피치',
		content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
		maxParticipants: 8,
		deadline: new Date(),
		sessionStart: new Date(),
		createdAt: new Date(),
		hit: 0
	},
	{
		id: 2,
		writer: '김수',
		category: 'IT',
		title: 'IT 자유주제 5분 스피치',
		content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
		maxParticipants: 6,
		deadline: new Date(),
		sessionStart: new Date(),
		createdAt: new Date(),
		hit: 0
	},
	{
		id: 3,
		writer: '민수',
		category: '자기소개',
		title: '자기소개 5분 스피치',
		content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
		maxParticipants: 8,
		deadline: new Date(),
		sessionStart: new Date(),
		createdAt: new Date(),
		hit: 0
	},
	{
		id: 4,
		writer: '김민수',
		category: 'IT',
		title: '자유주제 5분 스피치',
		content: '싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
		maxParticipants: 8,
		deadline: new Date(),
		sessionStart: new Date(),
		createdAt: new Date(),
		hit: 0
	},
	{
		id: 5,
		writer: '김민수',
		category: 'IT',
		title: 'IT 자유주제 5분 스피치',
		content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
		maxParticipants: 8,
		deadline: new Date(),
		sessionStart: new Date(),
		createdAt: new Date(),
		hit: 0
	},
	{
		id: 6,
		writer: '김민수',
		category: 'IT',
		title: 'IT 자유주제 5분 스피치',
		content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
		maxParticipants: 8,
		deadline: new Date(),
		sessionStart: new Date(),
		createdAt: new Date(),
		hit: 0
	},
];
//

export const IndexPage = () => {
	const localAxiosWithAuth = useLocalAxios();
	const navigate = useNavigate();
	const [speechSessions, setSpeechSessions] = useState<CommunityView[]>([]);
	const limit = 10;

	useEffect(() => {
		localAxiosWithAuth.get('/community/popular', {
			params: {
				limit },
		})
			.then((res) => {
				console.log("ㄱㄱ")
				// TODO: 백엔드에서 받은 response로 글을 채워준다
				const communityData: CommunityView[] = res.data.getCommunityResponses.map((communityView: CommunityResponse) => {
					return {
						...communityView,
						sessionStart: new Date(communityView.sessionStart),
						deadline: new Date(communityView.deadline),
						createdAt: new Date(communityView.createdAt)
					};
				});

				setSpeechSessions(communityData.slice(0,4));

			})
			.catch((err) => {
				// TODO: 백엔드 response가 없어서 무조건 에러가 날 것이므로 임시로 더미 데이터를 넣어준다
				setSpeechSessions(awaitingSpeechSessions.slice(0,4));
			});

		//axios.get("/kakao");
	}, []);

	return (
		<>
			<div className="relative h-56 sm:h-64 xl:h-80 2xl:h-96 mb-8">
				<Carousel slideInterval={5000}>
					<img src={Banner1} alt='banner1' className='w-full h-full object-cover' />
					<img src={Banner2} alt='banner2' className='w-full h-full object-cover' />
					<img src={Banner3} alt='banner3' className='w-full h-full object-cover' />
					<img src={Banner4} alt='banner4' className='w-full h-full object-cover' />
				</Carousel>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 mb-20 h-[400px]'>
				<TitledCard title='내가 참여할 발표 세션'>
					<ul className='flex flex-col px-4 gap-4 h-full justify-center'>
						{awaitingSpeechSessions.slice(0, 3).map((session) => {
							return (
								<li key={session.id} className='flex justify-between border-b-2 px-2 pb-2'>
									<div className='flex flex-col justify-between'>
										<p className='text-md font-semibold'>{session.title}</p>
										<p className='text-sm'>
											{session.sessionStart.toLocaleDateString()}{' '}
											{session.sessionStart.toLocaleDateString()}
										</p>
									</div>
									<div className='flex flex-col justify-between items-center'>
										<p className='text-sm font-semibold'>
											/ {session.maxParticipants}
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
						<Calendar/>
					</div>
				</TitledCard>
			</div>
			<div>
				<p className='text-2xl ml-4 mb-4'>이번 주 인기 발표 모집 글</p>
				<div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4'>
					{speechSessions.map((session) => {
						const handleClick = () => {
							navigate(`/speech/${session.id}`);
						};

						return (
							<button key={session.id} onClick={handleClick}>
								<RecruitCard session={session}/>
							</button>
						);
					})}
				</div>
			</div>
		</>
	);
};
