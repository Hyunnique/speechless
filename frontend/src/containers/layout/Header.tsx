import { Navbar, Dropdown, Avatar } from 'flowbite-react';

import { useAuthStore } from '../../stores/auth.ts';
import {Link, useNavigate} from 'react-router-dom';

const navigationMenus = [
	{
		title: '함께 발표하기',
		href: '/speech',
	},
	{
		title: '혼자 면접 연습하기',
		href: '/interview',
	},
	{
		title: '마이페이지',
		href: '/mypage',
	},
];

const isLoggedIn = false;

export const Header = () => {
	const authStore = useAuthStore();
	const navigate = useNavigate();

	const doLogout = () => {
		navigate('/logout');
	}
	return (
		<Navbar fluid rounded className='py-4 border-b-2'>
			<div className='w-full max-w-[1400px] mx-auto flex flex-wrap items-center justify-between'>
				<Navbar.Brand href='/'>
					<div className='logo font-flubber text-5xl tracking-tighter text-primary-500'>Speechless</div>
				</Navbar.Brand>
				<div className='flex md:order-2'>
					{!authStore.accessToken ? (
						<Link className='text-xl font-medium' to='/login'>
							로그인
						</Link>
					) : (
						<Dropdown
							arrowIcon={false}
							inline
							label={
								<Avatar img={authStore.profileImage} className='border-2 rounded-full' alt='User settings' rounded />
							}
						>
							<Dropdown.Header>
								<span className='block text-sm'>{authStore.name}</span>
								<span className='block truncate text-sm font-medium'>{authStore.email}</span>
							</Dropdown.Header>
							<Dropdown.Item onClick={doLogout}>로그아웃</Dropdown.Item>
						</Dropdown>
					)}

					<Navbar.Toggle />
				</div>
				<Navbar.Collapse>
					{navigationMenus.map((menu, index) => {
						return (
							<Navbar.Link href={menu.href} key={index} className='text-xl'>
								{menu.title}
							</Navbar.Link>
						);
					})}
				</Navbar.Collapse>
			</div>
		</Navbar>
	);
};
