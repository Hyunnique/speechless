import { Header } from './Header.tsx';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer.tsx';

export const DefaultLayout = () => {
	return (
		<>
			<Header />
			<div className='w-full max-w-[1400px] mx-auto my-10'>
				<Outlet />
			</div>
			<Footer />
		</>
	);
};
