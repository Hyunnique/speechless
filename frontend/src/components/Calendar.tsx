import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export const Calendar: React.FC = () => {
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
