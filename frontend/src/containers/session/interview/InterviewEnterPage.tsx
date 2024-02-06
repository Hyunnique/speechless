import { useEffect, useState } from 'react';
import { StatementView } from '../../statement/StatementView';
import { InterviewReportView } from '../../report/InterviewReportView';

import { useAuthStore } from '../../../stores/auth';
import { Button, Dropdown, Modal, TextInput} from 'flowbite-react';
import { CustomButton } from '../../../components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { useLocalAxios } from "../../../utils/axios.ts";
import { useInterviewSessionStore } from "../../../stores/session.ts";
import { Statement } from '../../../types/Statement.ts';

import TalkImg from '../../../assets/images/human_robot_talk.png';

interface StatementForm extends Statement {
	id: 0,
	title: '',
	company: '',
	position: '',
	career: '',
	questions: [{ question: '', answer: '' }],
}

export const InterviewEnterPage = () => {

	const authStore = useAuthStore();
	const interviewSessionStore = useInterviewSessionStore();

	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState('');

	const [statements, setStatements] = useState<StatementForm[]>([]);

	const [formData, setFormData] = useState({
		title: '',
		statement: {} as StatementForm,
		questionsNum: 10
	})

	const navigate = useNavigate();
	const localAxios = useLocalAxios();

	useEffect(() => {
		localAxios.get('/statements', {params: {pageNum: 1, pageSize: 10}})
		.then((res) => {
			setStatements(res.data.statements);
		})
		.catch((err) => {
			console.log(err);
		})
	}, [openModal])

	const startInterviewSession = async () => {
		setOpenModal(false);
		const response = await localAxios.post('openvidu/sessions', {
			topic: formData.title
		});

		if (interviewSessionStore.sessionId) {
			try {
				await localAxios.delete(`openvidu/sessions/${interviewSessionStore.sessionId}`);
			} catch (e) {
				console.log("session deletion failed");
			}

			interviewSessionStore.clearSession();
		}

		interviewSessionStore.setSessionId(response.data.sessionId);
		interviewSessionStore.setInterviewId(response.data.interviewId);
		interviewSessionStore.setTitle(formData.title);
		interviewSessionStore.setStatement(formData.statement);
		interviewSessionStore.setQuestionsCount(formData.questionsNum);

		navigate('/session/interview');
	};

	const onChangeFormStatement = (statement: StatementForm) => {
		setSelectedItem(statement.title);

		if (formData.title.trim() === '') formData.title = statement.title;

		formData.statement = statement;
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
				<Modal.Header className="flex items-center">
					면접 연습 시작
				</Modal.Header>
				<Modal.Body className='space-y-6 w-full'>
					<p className="text-md text-gray-600 font-semibold">
						질문을 생성할 자기소개서를 선택해 주세요.
					</p>
					<div className='w-1/2'>
						<Dropdown color='teal' label={selectedItem || "자기소개서를 선택해주세요."}>
							{statements.map((statement, index) => (
								<Dropdown.Item key={ statement.id } onClick={() => { onChangeFormStatement(statement); } }>
									{statement.title}
								</Dropdown.Item>
							))}
						</Dropdown>
					</div>
					<p className="text-md text-gray-600 font-semibold">
						연습의 제목을 입력해주세요.
					</p>
					<TextInput value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
					<p className="text-md text-gray-600 font-semibold">
						맞춤 질문을 몇개 생성할지 정해 주세요.
					</p>
					<TextInput type='number' value={formData.questionsNum} onChange={(e) => setFormData({...formData, questionsNum: Number(e.target.value)})}></TextInput>
				</Modal.Body>
				<Modal.Footer>
					<div className='flex justify-end w-full gap-4'>
						<CustomButton color='negative' size='md' onClick={() => setOpenModal(false)}>취소</CustomButton>
						<CustomButton color='positive' size='md' onClick={ startInterviewSession }>면접 시작</CustomButton>
					</div>
				</Modal.Footer>
			</Modal>
		</div>
	);
};