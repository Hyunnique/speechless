import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { useLocalAxios } from '../../utils/axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {TitledCard} from "../../components/TitledCard.tsx";
import { InterviewReport } from '../../types/Report.ts';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);
  
import { Bar, Line } from 'react-chartjs-2';
import { useAuthStore } from '../../stores/auth.ts';

export const InterviewReportDetailPage: React.FC = () =>  {

	const { id } = useParams();
	
	const localAxios = useLocalAxios(true);
	
	const [formData, setFormData] = useState<InterviewReport>();

	const [pronunciationGraphData, setPronunciationGraphData] = useState({
		labels: [],
		datasets: [
			{
			//label: 'test',
			data: [],
			backgroundColor: 'rgba(53, 162, 235, 0.5)',
			},
		],
	}
	);
	const [faceGraphData, setFaceGraphData] = useState(
		{
			labels: [],
			datasets: [
				{
				//label: 'test',
				data: [],
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
				},
			],
		}
	);

	const navigate = useNavigate();

	const authStore = useAuthStore();

	useEffect(() => {
		localAxios.get(`interview/${id}`)
		.then((res:{data:InterviewReport}) => {
			console.log(res.data);
			setFormData(res.data);
		})
		.catch((err) => {
			console.log(err);
		})


	}, [])

	useEffect(() => {
		console.log(authStore.accessToken)
		if(formData){
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
			console.log(xlists)
			console.log(ylists)

			data = {
				labels: xlists.reduce((prev, current) => {
						return (current.length > prev.length) ? current : prev;
				  	}, []),
				datasets: ylists.map((ylist, index) => ({
					label: `${index + 1}번 문답`, // 데이터셋의 라벨
					data: ylist.map((y, i) => ({ x: xlists[index][i], y: y })), // x, y 좌표를 매핑
					fill: false, // 선 아래를 채우지 않음
					backgroundColor: getRandomColor(), // 선 색상
				}))
			}

			setFaceGraphData(data);

		}
	}, [formData])

	function getRandomColor() {
		const colorList = [
			'rgba(255, 0, 0, 1)',     // 빨강
			'rgba(255, 165, 0, 1)',   // 주황
			'rgba(255, 255, 0, 1)',   // 황색
			'rgba(154, 205, 50, 1)',  // 연두
			'rgba(0, 128, 0, 1)',     // 녹색
			'rgba(0, 255, 255, 1)',   // 청록
			'rgba(0, 0, 255, 1)',     // 청색
			'rgba(128, 0, 128, 1)',   // 보라
			'rgba(0, 0, 0, 1)',       // 검정
		];

		return colorList[Math.floor(Math.random() * colorList.length)];
	  }
	  
	return (
		<TitledCard className='!bg-white p-8' title="면접 연습 결과 리포트">
			<div className='flex flex-col w-2/3 mx-auto'>
				<div className='flex flex-row gap-3'>
					<Button className='bg-negative-400 mt-5' onClick={() => navigate("/interview")}>뒤로 가기</Button>
				</div>
				<div className='mt-5'>
					<div className='space-y-6'>
						<p className='font-bold text-3xl'> {formData?.topic} </p>
						<div className='flex flex-justify-between'>
							<p className=' text-gray-500 dark:text-gray-400'>표정 점수 평균</p>
							<p className=' text-gray-700 dark:text-gray-400 ml-5'> {formData?.faceScore} </p>
						</div>
						<Line data={faceGraphData} />
						<div className='flex flex-justify-between mt-7'>
							<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>발음 점수 평균</p>
							<p className=' text-gray-700 dark:text-gray-400 ml-5'> {formData?.pronunciationScore} </p>
						</div>
						<Bar data={pronunciationGraphData} />
						<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>문답과 피드백</p>
						{formData?.questions.map((_, index) => (
							<div key={index} className='p-3'>
								<div className='bg-primary-50'>
									<p className='text-2xl leading-relaxed text-gray-500 dark:text-gray-400'>문항</p>
									<p> {formData.questions[index].question} </p>
								</div>
								<div className='bg-primary-100'>
									<p className='text-2xl leading-relaxed text-gray-500 dark:text-gray-400'>답변</p>
									<p> {formData.questions[index].answer} </p>
								</div>
								<div className='bg-primary-200'>
									<p className='text-2xl leading-relaxed text-gray-500 dark:text-gray-400'>피드백</p>
									<p> {formData.questions[index].feedback} </p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</TitledCard>
	);
};
