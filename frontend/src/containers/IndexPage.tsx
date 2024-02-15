import { Button, Card, Carousel } from 'flowbite-react';
import { TitledCard } from '../components/TitledCard.tsx';
import { Calendar } from '../components/Calendar.tsx';

import type { CommunityResponse, CommunityView } from '../types/Community.ts';
import { RecruitCard } from '../components/RecruitCard.tsx';

import Banner1 from '../assets/images/banner-1.jpg';
import Banner2 from '../assets/images/banner-2.jpg';
import Banner3 from '../assets/images/banner-3.jpg';

import { useEffect, useState } from 'react';
import { useLocalAxios } from '../utils/axios.ts';
import { useNavigate } from 'react-router-dom';
import { useSpeechSessionStore } from '../stores/session.ts';

interface SpeechSummary {
	id: number;
	title: string;
	sessionStart: string;
}

export const IndexPage = () => {
	const localAxiosWithAuth = useLocalAxios();
	const navigate = useNavigate();
	const [speechSessions, setSpeechSessions] = useState<CommunityView[]>([]);
	const [awaitingSessions, setAwaitingSessions] = useState<SpeechSummary[]>([]);

	const speechSessionStore = useSpeechSessionStore();

	useEffect(() => {
		localAxiosWithAuth
			.get('/community/popular')
			.then((res) => {
				// TODO: 백엔드에서 받은 response로 글을 채워준다
				const communityData: CommunityView[] = res.data.getCommunityResponses.map(
					(communityView: CommunityResponse) => {
						return {
							...communityView,
							sessionStart: new Date(communityView.sessionStart),
							deadline: new Date(communityView.deadline),
							createdAt: new Date(communityView.createdAt),
						};
					},
				);

				setSpeechSessions(communityData);
			})
			.catch((err) => {
				console.error('데이터 로딩 실패:', err);
			});

		localAxiosWithAuth.get('/participant/next').then((res) => {
			setAwaitingSessions(res.data);
		});
	}, []);

	const moveSpeech = async (topic: string, id: number) => {
		const response = await localAxiosWithAuth.post('openvidu/announcement', {
			topic: topic,
			communityId: id,
		});

		if (speechSessionStore.sessionId) {
			try {
				await localAxiosWithAuth.delete(`openvidu/sessions/${speechSessionStore.sessionId}`);
			} catch (e) {
				console.log('session deletion failed');
			}

			speechSessionStore.clearSession();
		}

		speechSessionStore.setSessionId(response.data);

		navigate('/session/speech');
	};

	const getDiffMinDate = (minute: number) => {
		const date = new Date();
		date.setMinutes(date.getMinutes() + minute);
		return date;
	};

	return (
		<>
			<div className='relative h-56 sm:h-64 xl:h-80 2xl:h-96 mb-8'>
				<Carousel slideInterval={5000}>
					<img src={Banner1} alt='banner1' className='w-full h-full object-cover' />
					<img src={Banner2} alt='banner2' className='w-full h-full object-cover' />
					<img src={Banner3} alt='banner3' className='w-full h-full object-cover' />
				</Carousel>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 mb-20 h-[400px]'>
				<TitledCard title='내가 참여 중인 발표 그룹'>
					<ul className='flex flex-col px-4 gap-4 h-full justify-center'>
						{awaitingSessions.map((session) => {
							return (
								<li key={session.id} className='flex justify-between border-b-2 px-2 pb-2'>
									<div className='flex flex-col justify-between'>
										<p className='text-md font-semibold'>{session.title}</p>
										<p className='text-sm'>
											{new Date(session.sessionStart).toLocaleDateString()}{' '}
											{new Date(session.sessionStart).toLocaleTimeString()}
										</p>
										<p className='text-sm'></p>
									</div>
									<div className='flex flex-col justify-center items-center'>
										{/*<p className='text-sm font-semibold'>/ {session.maxParticipants}</p>*/}
										<Button
											size='xs'
											color='purple'
											onClick={() => moveSpeech(session.title, session.id)}
											disabled={getDiffMinDate(10) < new Date(session.sessionStart)}
										>
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
						const handleClick = () => {
							navigate(`/speech/${session.id}`);
						};

						return (
							<button key={session.id} onClick={handleClick}>
								<RecruitCard session={session} />
							</button>
						);
					})}
				</div>
			</div>
		</>
	);
};
