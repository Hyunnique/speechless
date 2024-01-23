import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput, Textarea } from 'flowbite-react';
import { Statement } from '../../types/Statement';
import { useLocalAxios} from '../../utils/axios';

interface StatementForm extends Statement {
	questions: { question: string; answer: string }[];
}


//dataIndex == -1: create 모드로 작동한다.
//dataIndex != -1: update 모드로 작동한다.
export const StatementInputModal: 
						React.FC<{ openModal: boolean, setOpenModal: (openModal: boolean) => void, dataIndex: number, getStatements: () => void }> 
						= ({ openModal, setOpenModal, dataIndex, getStatements }) => {
	
	const localAxios = useLocalAxios(true);
	
	//ModalForm이 내부적으로 사용하는 Statement 데이터. useEffect를 이용해서 openModal이 열릴때만 데이터를 가져온다. 만약 create모드면 가져오지 않는다.
	const [formData, setFormData] = useState<StatementForm>(
		{
			id: 0,
			title: '',
			company: '',
			position: '',
			career: '',
			questions: [{ question: '', answer: '' }],
		}
	);

	//get 메소드를 통해 모달이 열릴 때마다 자기소개서들 리스트를 백엔드에서 가져온다.
	useEffect(() => {
		if (dataIndex!=-1 && openModal){
			localAxios.get(`statements/${dataIndex}`)
			.then((res:{data:StatementForm}) => {
				setFormData(res.data);
			})
			.catch((err) => {
				console.log(err);
			})
		}
	}, [openModal])
	  
	//questions 이외의 필드를 수정하기 위한 함수
	const updateStringField = (field:string, value:string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	//questions에 항목을 추가하는 함수
	const addQuestion = () => {
		setFormData(prev => ({
		  ...prev,
		  questions: [...(prev.questions || []), { question: '', answer: '' }],
		}));
	};

	//questions의 특정 항목을 제거하는 함수
	const removeQuestion = (index: number) => {
		setFormData(prev => ({
			...prev,
			questions: prev.questions ? prev.questions.filter((_, i) => i !== index) : [],
		}));
	};

	//post 메소드를 통해 벡엔드에 새로운 자기소개서 생성을 요청한다.
	const createStatement = () => {
		localAxios.post("statements", formData)
		.then((res) => {
			getStatements();
			setOpenModal(false);
			console.log(res);
		})
		.catch((err) => {
			alert("자기소개서 등록에 실패했습니다.")
			console.log(err);
		});
	}

	//patch 메소드를 통해 벡엔드에 특정 id의 자기소개서 수정을 요청한다.
	const updateStatement = () => {
		localAxios.patch(`statements/${dataIndex}`, formData)
		.then((res) => {
			getStatements();
			setOpenModal(false);
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});
	}

	return (
		<>
		<Modal show={openModal} onClose={() => setOpenModal(false)} size="full">
				<Modal.Header>면접 사전 정보 편집</Modal.Header>
				<Modal.Body>
					<div className='space-y-6'>
						<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>제목</p>
						<TextInput value={formData.title} onChange={(e) => updateStringField('title', e.target.value)}/>

						<div className='grid grid-cols-3 gap-4'>
							<div>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>기업 이름</p>
								<TextInput value={formData.company} onChange={(e) => updateStringField('company', e.target.value)}/>
							</div>
							<div>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>지원 포지션</p>
								<TextInput value={formData.position} onChange={(e) => updateStringField('position', e.target.value)}/>
							</div>
							<div>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>경력</p>
								<TextInput value={formData.career} onChange={(e) => updateStringField('career', e.target.value)}/>
							</div>
						</div>

						<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>자기소개서</p>
						{formData.questions.map((_, index) => (
							<div key={index} className='p-3 bg-primary-50'>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>문항</p>
								<TextInput
									id={`question-${index}`}
									value={formData.questions[index].question}
										onChange={(e) => {
											const newQuestions = formData.questions.map((q, idx) =>
												idx === index ? { ...q, question: e.target.value } : q
											);
											setFormData({ ...formData, questions: newQuestions });
										}}
								/>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>답변</p>
								<Textarea
									id={`answer-${index}`}
									value={formData.questions[index].answer}
									onChange={(e) => {
										const newQuestions = formData.questions.map((q, idx) =>
											idx === index ? { ...q, answer: e.target.value } : q
										);
										setFormData({ ...formData, questions: newQuestions });
									}}
									className='h-40'
								/>
								{formData.questions.length > 1 && (
									<div className="flex justify-end">
										<Button onClick={() => removeQuestion(index)} className='bg-negative-300 mt-2'>
											삭제
										</Button>
									</div>
								)}
							</div>
						))}
						<div className="flex justify-end">
							<Button className='bg-primary-300' onClick={addQuestion}>
								문항 추가
							</Button>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="flex justify-end">
					<Button className='bg-positive-300' onClick={dataIndex!=-1 ? updateStatement: createStatement}>
						저장
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
