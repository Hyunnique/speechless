import { useEffect, useState } from 'react';
import { Button, Pagination } from 'flowbite-react';
import { InterviewReport } from '../../types/Report';
import { useLocalAxios } from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import { CustomButton } from '../../components/CustomButton';

export const InterviewReportView: React.FC = () => {
	const [reports, setReports] = useState<InterviewReport[]>([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const onPageChange = (page: number) => setCurrentPage(page);
	const amountPerPage = 3;

	const localAxios = useLocalAxios(true);

	const navigate = useNavigate();

	useEffect(() => {
		getReports();
	}, [currentPage]);

	const getReports = () => {
		localAxios
			.get('interview', { params: { pageSize: amountPerPage, pageNum: currentPage } })
			.then((res) => {
				setCurrentPage(res.data.currentPage);
				setTotalPages(res.data.totalPage);

				setReports(res.data.interviewInfos);
				console.log(res.data);
				console.log('current: ' + currentPage + '/// totalPage: ' + res.data.totalPage);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const deleteReport = (index: number) => {
		// if (confirm("정말로 삭제하시겠습니까?")){
		//     localAxios.delete(`interview-reports/${index}`)
		//     .then((res) => {
		//         getReports();
		//         console.log(res);
		//     })
		//     .catch((err) => {
		//         console.log(err);
		//     })
		// }
	};

	return (
		<>
			<ul className='mt-5 h-full flex flex-col gap-3 w-11/12 mx-auto'>
				{reports.length > 0 ? (
					reports.map((report) => (
						<li
							key={report.id}
							className='px-8 py-4 flex border-b-2 hover:bg-gradient-to-l from-white to-gray-50 cursor-pointer'
							onClick={() => navigate('/interview/report/' + report.id)}
						>
							<div className='flex-1 flex flex-col justify-center'>
								<p className='text-lg font-semibold tracking-tight text-gray-900 dark:text-white w-full'>
									{report.topic}
								</p>
							</div>
							<div className='flex flex-row items-end gap-2'>
								<p></p>
							</div>
						</li>
					))
				) : (
					<p className='h-full flex justify-center items-center'>현재 저장된 면접 리포트가 없습니다.</p>
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
		</>
	);
};
