import { useEffect, useState } from 'react';
import { StatementView } from '../../statement/StatementView';
import { InterviewReportView } from '../../report/InterviewReportView';

import { useAuthStore } from '../../../stores/auth';
import { Button, Dropdown, Modal, TextInput} from 'flowbite-react';
import { CustomButton } from '../../../components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { useLocalAxios } from "../../../utils/axios.ts";
import { useInterviewSessionStore } from "../../../stores/session.ts";

import TalkImg from '../../../assets/images/human_robot_talk.png';

export const InterviewEnterPage = () => {

	const authStore = useAuthStore();
	const interviewSessionStore = useInterviewSessionStore();

	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState('');

	const navigate = useNavigate();
	const localAxios = useLocalAxios();

	const handleSelect = (item: string) => {
		setSelectedItem(item);
	};

	const startInterviewSession = async () => {
		setOpenModal(false);
		const response = await localAxios.post('openvidu/sessions');

		if (interviewSessionStore.sessionId) {
			try {
				await localAxios.delete(`openvidu/sessions/${interviewSessionStore.sessionId}`);
			} catch (e) {
				console.log("session deletion failed");
			}

			interviewSessionStore.clearSession();
		}

		interviewSessionStore.setSessionId(response.data);
		interviewSessionStore.setTitle('면접 연습');
		//interviewSessionStore.setStatement();

		navigate('/session/interview');
	};

	return (
		<div className='p-10'>
			<div className='flex items-center w-5/6 p-12 m-5 gap-10 border-2 rounded-3xl mx-auto'>
				<div className='w-1/3'>
					<img src={TalkImg} alt='img' />
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
					<Button className='bg-primary-300' onClick={ startInterviewSession }>
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