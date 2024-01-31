import { useEffect, useState } from 'react';
import { StatementView } from '../../statement/StatementView';
import { InterviewReportView } from '../../report/InterviewReportView';

import { useAuthStore } from '../../../stores/auth';
import { Button, Dropdown, Modal, TextInput} from 'flowbite-react';
import { CustomButton } from '../../../components/CustomButton';
import { useNavigate } from 'react-router-dom';

export const InterviewEnterPage = () => {

	const authStore = useAuthStore();

	const [openModal, setOpenModal] = useState(false);

	const [selectedItem, setSelectedItem] = useState('');

	const navigate = useNavigate();

	useEffect(() => {}, []);

	const handleSelect = (item: string) => {
		setSelectedItem(item);
	  };

	return (
		<div className='p-10'>
			<div className='flex items-center w-5/6 p-12 m-5 gap-10 border-2 rounded-3xl mx-auto'>
				<div className='w-1/3'>
					<img src='/src/assets/images/human_robot_talk.png' alt='img' />
				</div>
				<div className='w-2/3'>
					<p className='text-2xl'>
						기업에 지원한 자기소개서를 기반으로<br/>
						면접 연습을 할 수 있습니다. <br/>
						자기소개서를 추가하고 <br/>
						{authStore.name?authStore.name:'사용자'}님에게 맞는 면접 연습을 시작하세요!
					</p>
					<div className='flex justify-center mt-8'>
						<CustomButton className='w-1/4 text-lg' color='green' onClick={() => setOpenModal(true)}>연습 시작</CustomButton>
					</div>
				</div>
			</div>

			<div className='items-center w-5/6 p-12 m-5 border-2 rounded-3xl mx-auto'>
				<p className='text-2xl ml-4 mb-4'>자기소개서 관리</p>
				<StatementView/>
			</div>

			<div className='items-center w-5/6 p-12 m-5 border-2 rounded-3xl mx-auto'>
				<p className='text-2xl ml-4 mb-4'>완료한 면접 연습</p>
				<InterviewReportView/>
			</div>


			<Modal show={openModal} onClose={() => setOpenModal(false)}>
				<Modal.Header>면접 연습 시작</Modal.Header>
				<Modal.Body>
				<div className="space-y-6">
					<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
						연습의 제목을 입력해 주세요.
					</p>
					<TextInput></TextInput>
					<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
						질문을 생성할 자기소개서를 선택해 주세요.
					</p>
					<Dropdown label={selectedItem || "Select an option"}>
						<Dropdown.Item onClick={() => handleSelect('Dashboard')}>Dashboard</Dropdown.Item>
						<Dropdown.Item onClick={() => handleSelect('Settings')}>Settings</Dropdown.Item>
						<Dropdown.Item onClick={() => handleSelect('Earnings')}>Earnings</Dropdown.Item>
						<Dropdown.Item onClick={() => handleSelect('Sign out')}>Sign out</Dropdown.Item>
					</Dropdown>
					<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
						맞춤 질문을 몇개 생성할지 정해 주세요.
					</p>
					<TextInput></TextInput>
				</div>
				</Modal.Body>
				<Modal.Footer>
				<div className='flex justify-end'>
					<Button className='bg-primary-300' onClick={() => {setOpenModal(false); navigate("/session/interview") }}>
						면접 시작
					</Button>
					<Button className='bg-primary-300' onClick={() => setOpenModal(false)}>
						나가기
					</Button>
				</div>
				</Modal.Footer>
			</Modal>
		</div>
	);
};