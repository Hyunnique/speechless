import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useLocalAxios } from '../utils/axios.ts';

export const Calendar: React.FC = () => {
	const localAxios = useLocalAxios();

	useEffect(() => {}, []);

	return (
		<>
			<FullCalendar
				plugins={[dayGridPlugin]}
				headerToolbar={false}
				titleFormat={{ year: 'numeric', month: 'long' }}
				initialView='dayGridMonth'
				height='100%'
				events={[
					{ title: 'event 1', date: '2024-01-23' },
					{ title: 'event 2', date: '2024-01-24' },
				]}
			/>
		</>
	);
};
