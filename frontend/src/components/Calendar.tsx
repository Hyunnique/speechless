import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useLocalAxios } from '../utils/axios.ts';

export const Calendar: React.FC = () => {
	const [ events, setEvents ] = useState([]);
	const [ calendarKey, setCalendarKey ] = useState(0);
	const localAxios = useLocalAxios();

	useEffect(() => {
		getMonthlyData();
	}, []);

	const getMonthlyData = async () => {
		const year = new Date().getFullYear();
		const month = new Date().getMonth() + 1;

		const interviewResponse = await localAxios.get('interview/monthly', {
			params: { year, month }
		});
		const speechResponse = await localAxios.get('participant/current');

		const interviewResult = interviewResponse.data.map((x: { id: number; topic: string; startTime: string; }) => {
			return {
				title: x.topic,
				date: x.startTime.slice(0, 10),
				url: '/interview/report/' + x.id,
				backgroundColor: 'lightseagreen',
				borderColor: 'lightseagreen'
			}
		});

		const speechResult = speechResponse.data.map((x: { id: number; title: string; sessionStart: string; }) => {
			return {
				title: x.title,
				date: x.sessionStart.slice(0, 10),
				url: '/speech/' + x.id,
				backgroundColor: 'lightcoral',
				borderColor: 'lightcoral'
			}
		});

		const result = interviewResult.concat(speechResult);

		setEvents(result);
	}

	return (
		<>
			<FullCalendar
				plugins={[dayGridPlugin]}
				headerToolbar={false}
				titleFormat={{ year: 'numeric', month: 'long' }}
				initialView='dayGridMonth'
				height='100%'
				events={events}
			/>
		</>
	);
};
