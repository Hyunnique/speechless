import React, { useEffect, useState } from 'react';
import { useLocalAxios } from '../../utils/axios';
import { TitledCard } from '../../components/TitledCard.tsx';

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
	PointElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement,  BarElement, LineElement, Title, Tooltip, Legend);

import { Line } from 'react-chartjs-2';

export const RecentScoreChart = () => {

	const localAxios = useLocalAxios(true);

	const [graphData, setGraphData] = useState<ChartData<"line", number[], unknown>>({
        labels: [],
        datasets: [
            {
                label: '표정 점수',
                data: [],
                backgroundColor: getRandomColor(),
                borderColor: getRandomColor(),
                pointRadius: 0,
                fill: false,
            },
        ],
    });

	useEffect(() => {
		localAxios
            .get('interview', { params: { pageSize: 10, pageNum: 1 } })
            .then((res) => {
                const infos = res.data.interviewInfos;
                const faceYlist =  infos.map((info: { faceScore: number; }) => info.faceScore).reverse();
				const pronunciationYlist =  infos.map((info: { pronunciationScore: number; }) => info.pronunciationScore).reverse();
                const faceColor = getRandomColor();
				const pronunciationColor = getRandomColor();
                const xlist = new Array(faceYlist.length).fill('');
                xlist[0] = '이전';
                xlist[xlist.length-1] = '현재';

                setGraphData({
                    labels: xlist,
                    datasets: [
                        {
                            label: '표정 점수',
                            data: faceYlist,
							borderColor: faceColor,
                            backgroundColor: faceColor,
                            pointRadius: 0,
                            fill: false,
                        },
						{
                            label: '발음 점수',
                            data: pronunciationYlist,
							borderColor: pronunciationColor,
                            backgroundColor: pronunciationColor,
                            pointRadius: 0,
                            fill: false,
                        },
                    ],
                })
            })
	}, []);

	function getRandomColor() {
		const colorList = [
			'rgba(255, 0, 0, 1)', // 빨강
			'rgba(255, 165, 0, 1)', // 주황
			'rgba(255, 255, 0, 1)', // 황색
			'rgba(154, 205, 50, 1)', // 연두
			'rgba(0, 128, 0, 1)', // 녹색
			'rgba(0, 255, 255, 1)', // 청록
			'rgba(0, 0, 255, 1)', // 청색
			'rgba(128, 0, 128, 1)', // 보라
			'rgba(0, 0, 0, 1)', // 검정
		];

		return colorList[Math.floor(Math.random() * colorList.length)];
	}

	return (
		<div>
			<p className='text-2xl font-semibold'>최근 점수 변화</p>
            <Line data={graphData}></Line>
		</div>
	);
};
