import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SpeechSearch } from '../../components/SpeechSearch';
import { RecruitCard } from '../../components/RecruitCard';
import { CommunityResponse, CommunityView } from '../../types/Community';
import { useLocalAxios } from '../../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { SearchCriteria } from '../../types/SearchCriteria';
import { Breadcrumb, BreadcrumbItem } from 'flowbite-react';
import { CustomButton } from '../../components/CustomButton.tsx';

export const SpeechListPage: React.FC = () => {
	const [speechSessions, setSpeechSessions] = useState<CommunityView[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [nextCursor, setNextCursor] = useState<number | null>(null);
	const observer = useRef<IntersectionObserver | null>(null);
	const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({});
	const localAxios = useLocalAxios();
	const navigate = useNavigate();

	//의존성 배열에 등록된 변수 바뀔 때만 렌더링 되도록 useCallback 사용
	const fetchSpeechSessions = useCallback(async () => {
		if (loading) return;
		setLoading(true);

		const params: Record<string, string | number | boolean | null> = {
			cursor: nextCursor,
			limit: 4,
			...searchCriteria,
		};
		console.log(params);

		try {
			const res = await localAxios.get('/community', { params });

			//중복 키 검사
			const newFetchedData = res.data.getCommunityResponses.filter(
				(newItem: CommunityView) => !speechSessions.some((existingItem) => existingItem.id === newItem.id),
			);

			const newData = newFetchedData.map((item: CommunityResponse) => ({
				...item,
				sessionStart: new Date(item.sessionStart),
				deadline: new Date(item.deadline),
				createdAt: new Date(item.createdAt),
			}));
			setSpeechSessions((prev) => [...prev, ...newData]);
			setHasMore(newData.length > 0 && res.data.nextCursor !== undefined);
			setNextCursor(res.data.nextCursor ?? null);
		} catch (error) {
			console.error('Fetching sessions failed:', error);
		} finally {
			setLoading(false);
		}
	}, [loading, nextCursor, searchCriteria]);

	const lastElementRef = useCallback(
		(node: Element | null) => {
			if (loading || !hasMore) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					fetchSpeechSessions();
				}
			});

			if (node) observer.current.observe(node);
		},
		[loading, hasMore, fetchSpeechSessions],
	);

	// //의존성 배열에 등록된 변수 바뀔 때만 렌더링 되도록 useCallback 사용
	// const fetchSpeechSessions = useCallback(async () => {
	//     if (loading) return;
	//     setLoading(true);
	//
	//     const params: Record<string, string | number | boolean | null> = {
	//         cursor: nextCursor,
	//         limit: 4,
	//         ...searchCriteria,
	//     };
	//
	//     try {
	//         const [res, res2] = await Promise.all([
	//             localAxios.get('/community', { params }),
	//             localAxios.get('/reserved')
	//         ]);
	//
	//         // 중복 키 검사
	//         const newFetchedData = res.data.getCommunityResponses.filter(
	//             (newItem: CommunityView) => !speechSessions.some(existingItem => existingItem.id === newItem.id)
	//         );
	//
	//         const newData = newFetchedData.map((item: CommunityResponse) => ({
	//             ...item,
	//             sessionStart: new Date(item.sessionStart),
	//             deadline: new Date(item.deadline),
	//             createdAt: new Date(item.createdAt),
	//             currentParticipants: res2.data.currentParticipants
	//         }));
	//
	//         setSpeechSessions(prev => [...prev, ...newData]);
	//         setHasMore(newData.length > 0 && res.data.nextCursor !== undefined);
	//         setNextCursor(res.data.nextCursor ?? null);
	//     } catch (error) {
	//         console.error('err:', error);
	//     } finally {
	//         setLoading(false);
	//     }
	// }, [loading, nextCursor, searchCriteria]);

	//Promise 수정 필요?
	useEffect(() => {
		fetchSpeechSessions();
	}, [searchCriteria]);

	//클린업
	useEffect(() => {
		return () => observer.current?.disconnect();
	}, []);

	return (
		<>
			<div className='content-header mb-10'>
				<Breadcrumb className='pb-8'>
					<BreadcrumbItem>
						<Link to='/'>홈</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Link to='/speech'>함께 발표하기</Link>
					</BreadcrumbItem>
				</Breadcrumb>
				<div className='flex justify-between items-center'>
					<h1 className='text-3xl font-semibold leading-tight text-gray-700'>모집 글 목록</h1>
					<div className='flex gap-3'>
						<CustomButton
							bordered
							color='blue'
							onClick={() => {
								navigate('/speech/write');
							}}
						>
							<div className='flex items-center gap-2'>
								<span className='material-symbols-outlined text-sm'>add</span>
								<span>새 모집 글 작성</span>
							</div>
						</CustomButton>
					</div>
				</div>
			</div>
			<div className='flex'>
				<div className='sticky top-0 z-10'>
					<SpeechSearch
						onSearch={(newCriteria: SearchCriteria) => {
							setSearchCriteria(newCriteria);
							setSpeechSessions([]);
							setNextCursor(null);
						}}
					/>
				</div>
				<div className='ml-4 grid 2xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-4'>
					{speechSessions.map((session, index) => (
						<div
							className='h-full'
							key={session.id}
							ref={index === speechSessions.length - 1 ? lastElementRef : null}
						>
							<Link to={`/speech/${session.id}`} className='h-full block'>
								<RecruitCard session={session} />
							</Link>
						</div>
					))}
					{loading && <p>Loading...</p>}
				</div>
			</div>
		</>
	);
};
