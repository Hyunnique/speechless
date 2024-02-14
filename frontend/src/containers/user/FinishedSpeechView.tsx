import React, { useEffect, useState } from 'react';
import { useLocalAxios } from '../../utils/axios.ts';
import { TitledCard } from '../../components/TitledCard.tsx';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'flowbite-react';

interface Group {
    id: string;
    title: string;
    sessionStart: string;
}

export const FinishedSpeechView = () => {

    const [groups, setGroups] = useState<Group[]>();

    const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const onPageChange = (page: number) => setCurrentPage(page);
	const amountPerPage = 3;

	const localAxios = useLocalAxios(true);

    const navigate = useNavigate();

	useEffect(() => {
		localAxios
        .get('/participant/finished', { params: { pageSize: amountPerPage, pageNum: currentPage } })
        .then((res) => {
            setCurrentPage(res.data.currentPage);
			setTotalPages(res.data.totalPage);

            setGroups(res.data.participants);
        })
        
            
	}, [currentPage]);

	return (
		<TitledCard title='완료한 발표 연습'>
            <ul className='mt-5 h-full flex flex-col gap-3 w-11/12 mx-auto'>
                {groups && groups.length > 0 ? (
                    groups.map((group) => (
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
                        </li>
                    ))
                ) : (
                    <p className='h-full flex justify-center items-center'>
                        완료한 발표 연습이 없습니다.
                    </p>
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
