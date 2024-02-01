import React, { useEffect, useState } from 'react';
import { Button, TextInput, Textarea } from 'flowbite-react';
import { Statement } from '../../types/Statement';
import { useLocalAxios } from '../../utils/axios';
import { useParams } from 'react-router-dom';

interface StatementForm extends Statement {
	questions: { question: string; answer: string }[];
}

//id == -1: create 모드로 작동한다.
//id != -1: update 모드로 작동한다.
export const StatementWritePage: React.FC = () =>  {

	const { id } = useParams();
	//const { beforeRoute } = useParams();
	
	const localAxios = useLocalAxios(true);
	
	//내부적으로 사용하는 Statement 데이터. 만약 update 모드면 기존 데이터를 가져온다.
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
	
	const [disableUpdate, setDisableUpdate] = useState(true);

	//id가 존재할 경우 기존 데이터를 가져온다.
	useEffect(() => {
		if (id && disableUpdate){
			localAxios.get(`statements/${id}`)
			.then((res:{data:StatementForm}) => {
				setFormData(res.data);
			})
			.catch((err) => {
				console.log(err);
			})
		}
	}, [disableUpdate])
	  
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
			console.log(res);
		})
		.catch((err) => {
			alert("자기소개서 등록에 실패했습니다.")
			console.log(err);
		});
	}

	//patch 메소드를 통해 벡엔드에 특정 id의 자기소개서 수정을 요청한다.
	const updateStatement = () => {
		localAxios.patch(`statements/${id}`, formData)
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});
	}

	return (
		<div className='flex flex-col items-center justify-center'>
			<div className='basis-4/5'>
				<h1 className="text-4xl font-bold leading-tight text-gray-900">자기소개서 {disableUpdate?"확인":"수정"}</h1>
				<div className='flex gap-3'>
					<Button className='bg-negative-400 mt-5' onClick={() => window.history.back()}>뒤로 가기</Button>
					<Button className='bg-positive-400 mt-5' onClick={() => setDisableUpdate(!disableUpdate)}>{disableUpdate?"수정":"수정취소"}</Button>
				</div>
					<div className='mt-5'>
						<div className='space-y-6'>
							<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>제목</p>
							<TextInput disabled={disableUpdate} className='w-1/2' value={formData.title} onChange={(e) => updateStringField('title', e.target.value)}/>

							<div className='grid grid-cols-3 gap-5 w-1/2'>
								<div>
									<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>기업 이름</p>
									<TextInput disabled={disableUpdate} value={formData.company} onChange={(e) => updateStringField('company', e.target.value)}/>
								</div>
								<div>
									<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>지원 포지션</p>
									<TextInput disabled={disableUpdate} value={formData.position} onChange={(e) => updateStringField('position', e.target.value)}/>
								</div>
								<div>
									<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>경력</p>
									<TextInput type='number' disabled={disableUpdate} value={formData.career} onChange={(e) => updateStringField('career', e.target.value)}/>
									
								</div>
							</div>

							<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>자기소개서</p>
							{formData.questions.map((_, index) => (
								<div key={index} className='p-3 bg-primary-50'>
									<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>문항</p>
									<TextInput
										disabled={disableUpdate}
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
										disabled={disableUpdate}
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
											<Button disabled={disableUpdate} onClick={() => removeQuestion(index)} className='bg-negative-300 mt-2'>
												삭제
											</Button>
										</div>
									)}
								</div>
							))}
							<div className="flex justify-end">
								<Button disabled={disableUpdate} className='bg-primary-300' onClick={addQuestion}>
									문항 추가
								</Button>
							</div>
						</div>
					</div>
					
				<div className="flex justify-end mt-10">
					<Button disabled={disableUpdate} className='bg-positive-300' onClick={id ? updateStatement: createStatement}>
						저장
					</Button>
				</div>
			</div>
		</div>
	);
};
