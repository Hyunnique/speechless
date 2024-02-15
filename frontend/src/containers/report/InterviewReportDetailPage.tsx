import React, { useEffect, useState } from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Card} from 'flowbite-react';
import { useLocalAxios } from '../../utils/axios';
import {Link, useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TitledCard } from '../../components/TitledCard.tsx';
import { InterviewReport } from '../../types/Report.ts';

import moment from 'moment';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ChartData,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

import { Bar, Line } from 'react-chartjs-2';
import { useAuthStore } from '../../stores/auth.ts';
import {CustomButton} from "../../components/CustomButton.tsx";

const colorList = [
	'rgba(255, 0, 0, 1)', // 빨강
	'rgba(255, 165, 0, 1)', // 주황
	'rgba(255, 255, 0, 1)', // 황색
	'rgba(154, 205, 50, 1)', // 연두
	'rgba(0, 128, 0, 1)', // 녹색
	'rgba(0, 255, 255, 1)', // 청록
	'rgba(0, 0, 255, 1)', // 청색
	'rgba(128, 0, 128, 1)', // 보라
];

export const InterviewReportDetailPage: React.FC = () => {
	const { id } = useParams();

	const localAxios = useLocalAxios(true);

	const [formData, setFormData] = useState<InterviewReport>();

	const [pronunciationGraphData, setPronunciationGraphData] = useState({
		labels: [],
		datasets: [
			{
				label: '발음 점수',
				data: [],
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
			},
		],
	});
	const [faceGraphData, setFaceGraphData] = useState<ChartData<"line", number[], unknown>>({
		labels: [],
		datasets: [
		],
	});

	const navigate = useNavigate();

	const authStore = useAuthStore();

	useEffect(() => {
		localAxios
			.get(`interview/${id}`)
			.then((res: { data: InterviewReport }) => {
				console.log(res.data);
				setFormData(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		console.log(authStore.accessToken);
		if (formData) {
			let list = JSON.parse(formData.pronunciationGraph);
			let data = {
				labels: list.map((_: unknown, index: number) => `${index + 1}번 문답`),
				datasets: [
					{
						label: '발음 점수',
						data: list,
						backgroundColor: 'rgba(53, 162, 235, 0.5)',
					},
				],
			};
			setPronunciationGraphData(data);

			let ylists = JSON.parse(formData.faceGraph) as number[][];
			let xlists = ylists.map((list) => {
				// 각 ylists 요소의 크기에 맞게 1부터 시작하는 연속된 숫자 배열을 생성
				let xlist = [] as number[];
				for (let i = 1; i <= list.length; i++) {
					xlist.push(i);
				}
				return xlist;
			});
			console.log(xlists);
			console.log(ylists);

			data = {
				labels: xlists.reduce((prev, current) => {
					return current.length > prev.length ? current : prev;
				}, []),
				datasets: ylists.map((ylist, index) => ({
					label: `${index + 1}번 문답`, // 데이터셋의 라벨
					data: ylist.map((y, i) => ({ x: xlists[index][i], y: y })), // x, y 좌표를 매핑
					fill: false, // 선 아래를 채우지 않음
					backgroundColor: colorList[index], // 선 색상
					borderColor: colorList[index],
					pointRadius: 0,
				})),
			};

			setFaceGraphData(data);
		}
	}, [formData]);


	return (
		<>
			<div className='content-header mb-10'>
				<Breadcrumb className='pb-8'>
					<BreadcrumbItem>
						<Link to='/'>홈</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Link to='/interview'>면접 연습하기</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Link to='/interview'>면접 연습 기록 관리</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>
						면접 연습 결과 리포트
					</BreadcrumbItem>
				</Breadcrumb>
				<div className='flex justify-between items-center'>
					<h1 className='text-3xl font-semibold leading-tight text-gray-700'>면접 연습 결과 리포트</h1>
					<div className='flex gap-3'>
						<CustomButton
							bordered
							color='blue'
							onClick={() => {
								navigate('/interview');
							}}
						>
							<div className='flex items-center gap-2'>
								<span className='material-symbols-outlined text-sm'>arrow_back</span>
								<span>목록으로 이동</span>
							</div>
						</CustomButton>
					</div>
				</div>
			</div>
			<Card className='2xl:w-3/4 xl:w-4/5 w-full mx-auto p-10'>
				<div className='flex flex-col space-y-10'>
					<p className='text-black text-3xl font-semibold'>{formData?.topic}</p>
					<div className='pb-6'>
						<div className='flex gap-2'>
							<span className='font-semibold pr-2 border-r-2 border-gray-400'>세션 시간</span>
							<span>{Math.floor(moment.duration(moment(formData?.endTime).diff(moment(formData?.startTime))).asMinutes())}분</span>
							<span>({moment(formData?.startTime).format('YYYY. MM. DD. HH:mm')} ~ {moment(formData?.endTime).format('YYYY. MM. DD. HH:mm')})</span>
						</div>
						<div className='flex gap-2'>
							<span className='font-semibold pr-2 border-r-2 border-gray-400'>질문 갯수</span>
							<span>{formData?.questions.length}개</span>
						</div>
					</div>
					<div>
						<p className='text-2xl font-semibold border-b-2 pb-1 mb-4 border-gray-400'>표정 분석</p>
						<div className='flex mb-4'>
							<p className='text-gray-500'>표정 점수 평균</p>
							<p className='text-gray-700 ml-3'>{formData?.faceScore}</p>
						</div>
						<Line data={faceGraphData} />
					</div>
					<div>
						<p className='text-2xl font-semibold border-b-2 pb-1 mb-4 border-gray-400'>발음 분석</p>
						<div className='flex mb-4'>
							<p className='text-gray-500'>발음 점수 평균</p>
							<p className='text-gray-700 ml-3'>{formData?.pronunciationScore}</p>
						</div>
						<Bar data={pronunciationGraphData} />
					</div>
					<div>
						<p className='text-2xl font-semibold border-b-2 pb-1 mb-4 border-gray-400'>문답과 피드백</p>
						{
							formData?.questions.map((question, index) => (
								<Card key={index} className='mb-5'>
									<div className='w-full border-b-2 border-gray-400 pb-1 flex items-center gap-2'>
										<span className='text-2xl font-semibold'>Q.</span>
										<span className='text-xl'>{question.question}</span>
									</div>
									<div className='w-full border-b-2 border-gray-400 pb-1 flex gap-2'>
										<span className='text-2xl font-semibold'>A.</span>
										<span className='text-md text-gray-700'>{question.answer}</span>
									</div>
									<div className='w-full'>
										<div className='text-xl font-semibold mb-2'>[피드백]</div>
										<div className='ml-3 text-teal-600'>
											{question.feedback}
										</div>
									</div>
								</Card>
							))
						}
					</div>
				</div>
			</Card>
		</>
	);
};