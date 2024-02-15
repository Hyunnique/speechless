import React, { useEffect, useState } from 'react';
import { useLocalAxios } from '../../utils/axios.ts';
import { TitledCard } from '../../components/TitledCard.tsx';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'flowbite-react';
import { useSpeechSessionStore } from '../../stores/session.ts';

interface Group {
	id: string;
	title: string;
	sessionStart: string;
}

export const ReservedSpeechView = () => {
	const [groups, setGroups] = useState<Group[]>();

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const onPageChange = (page: number) => setCurrentPage(page);
	const amountPerPage = 3;

	const localAxios = useLocalAxios(true);

	const navigate = useNavigate();

	const speechSessionStore = useSpeechSessionStore();

	useEffect(() => {
		localAxios
			.get('/participant/reserved', { params: { pageSize: amountPerPage, pageNum: currentPage } })
			.then((res) => {
				setCurrentPage(res.data.currentPage);
				setTotalPages(res.data.totalPage);

				setGroups(res.data.participants);
			});
	}, [currentPage]);

	const moveSpeech = async (index: number) => {
		const response = await localAxios.post('openvidu/announcement', {
			topic: groups?.[index].title,
			communityId: groups?.[index].id,
		});

		if (speechSessionStore.sessionId) {
			try {
				await localAxios.delete(`openvidu/sessions/${speechSessionStore.sessionId}`);
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
		<TitledCard title='예정된 발표 연습'>
			<ul className='mt-5 h-full flex flex-col gap-3 w-11/12 mx-auto'>
				{groups && groups.length > 0 ? (
					groups.map((group, index) => (
						<li
							key={group.id}
							className='px-8 py-4 flex border-b-2 hover:bg-gradient-to-l from-white to-gray-50 cursor-pointer'
							onClick={() => navigate('/speech/' + group.id)}
						>
							<div className='flex-1 flex flex-col justify-center'>
								<p className='text-lg font-semibold tracking-tight text-gray-900 dark:text-white w-full'>
									{group.title}
								</p>
								<p className='text-md tracking-tight text-gray-600 dark:text-white w-full'>
									{new Date(group.sessionStart).toLocaleDateString()}
								</p>
							</div>

							<button
								className='bg-primary-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
								onClick={() => moveSpeech(Number(index))}
								disabled={getDiffMinDate(10) < new Date(group.sessionStart)}
							>
								발표 세션 이동
							</button>
						</li>
					))
				) : (
					<p className='h-full flex justify-center items-center'>예정된 발표 연습이 없습니다.</p>
				)}
				{totalPages > 1 ? (
					<div className='flex overflow-x-auto sm:justify-center'>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={onPageChange}
							nextLabel='다음'
							previousLabel='이전'
						/>
					</div>
				) : (
					<></>
				)}
			</ul>
		</TitledCard>
	);
};
