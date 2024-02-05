import React, { useEffect, useState } from 'react';
import { Button, TextInput, Textarea } from 'flowbite-react';
import { Statement } from '../../types/Statement';
import { useLocalAxios } from '../../utils/axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface StatementForm extends Statement {
	questions: { question: string; answer: string }[];
}

export const StatementWritePage: React.FC = () =>  {

	const { id } = useParams();
	
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

	const navigate = useNavigate();

	//id가 존재할 경우 기존 데이터를 가져온다.
	useEffect(() => {
		if (id){
			localAxios.get(`statements/${id}`)
			.then((res:{data:StatementForm}) => {
				setFormData(res.data);
			})
			.catch((err) => {
				console.log(err);
			})
		}
	}, [])
	  
	const changeTitle = (title: string) =>{
		if(title.length > 20) {
			alert("제목의 최대 길이는 20자입니다.");
		}
		else {
			setFormData(prev => ({ ...prev, ['title']: title }));
		}
	}

	const changeCompany = (company: string) =>{
		if(company.length > 20) {
			alert("회사 이름의 최대 길이는 20자입니다.");
		}
		else {
			setFormData(prev => ({ ...prev, ['company']: company }));
		}
	}

	const changePosition = (position: string) =>{
		if(position.length > 30) {
			alert("지원 포지션의 최대 길이는 30자입니다.");
		}
		else {
			setFormData(prev => ({ ...prev, ['position']: position }));
		}
	}
	
	const changeCareer = (career: string) =>{
		if (career!=="" && isNaN(Number(career))) {
			const numericCareer = career.replace(/\D/g, '');
			setFormData(prev => ({ ...prev, career: numericCareer }));
			alert("경력은 숫자를 입력해야 합니다.");
		}
		else if(Number(career) <0) {
			alert("경력은 0 이상의 값만 입력 가능합니다.")
		}
		else {
			setFormData(prev => ({ ...prev, ['career']: career }));
		}
		
	}

	//questions에 항목을 추가하는 함수
	const addQuestion = () => {
		if(formData.questions.length >=5) {
			alert("문항은 최대 5개 까지만 입력 가능합니다.");
			return;
		}
		setFormData(prev => ({
		  ...prev,
		  questions: [...(prev.questions || []), { question: '', answer: '' }],
		}));
	};

	//questions의 특정 항목을 제거하는 함수
	const removeQuestion = (index: number) => {
		if(formData.questions.length <=1) {
			alert("최소한 하나의 문항은 존재해야 합니다.");
			return;
		}
		setFormData(prev => ({
			...prev,
			questions: prev.questions ? prev.questions.filter((_, i) => i !== index) : [],
		}));
	};

	//post 메소드를 통해 벡엔드에 새로운 자기소개서 생성을 요청한다.
	const createStatement = () => {
		if (!checkValidation()) {
			return;
		}
		localAxios.post("statements", formData)
		.then((res) => {
			console.log(res);
			navigate("/statement/detail/" + res.data.id);
		})
		.catch((err) => {
			alert("자기소개서 등록에 실패했습니다.")
			console.log(err);
		});
	}

	//put 메소드를 통해 벡엔드에 특정 id의 자기소개서 수정을 요청한다.
	const updateStatement = () => {
		if (!checkValidation()) {
			return;
		}
		localAxios.put(`statements`, formData)
		.then((res) => {
			console.log(res);
			navigate("/statement/detail/" + res.data.id);
		})
		.catch((err) => {
			console.log(err);
		});
	}

	const checkValidation = () => {
		if(formData.title === "") {
			alert("제목를 입력해야 합니다.");
			return false;
		}
		else if(formData.company === "") {
			alert("기업 이름를 입력해야 합니다.");
			return false;
		}
		else if(formData.position === "") {
			alert("지원 포지션를 입력해야 합니다.");
			return false;
		}
		else if(formData.career === "") {
			alert("경력을 입력해야 합니다.");
			return false;
		}
		else if(formData.questions?.length === 0) {
			alert("문항을 입력해야 합니다.");
			return false;
		}
		else {
			return true;
		}
	}

	return (
		<div className='flex flex-col w-2/3 mx-auto'>
			<h1 className="text-4xl font-bold leading-tight text-gray-900">자기소개서 {id?"수정":"생성"}</h1>
			<div className='flex gap-3'>
				<Button className='bg-negative-400 mt-5' onClick={() => navigate("/interview")}>뒤로 가기</Button>
			</div>
				<div className='mt-5'>
					<div className='space-y-6'>
						<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>제목</p>
						<TextInput className='w-1/2' value={formData.title} onChange={(e) => changeTitle(e.target.value)}/>

						<div className='grid grid-cols-3 gap-5 w-1/2'>
							<div>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>기업 이름</p>
								<TextInput value={formData.company} onChange={(e) => changeCompany(e.target.value)}/>
							</div>
							<div>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>지원 포지션</p>
								<TextInput value={formData.position} onChange={(e) => changePosition(e.target.value)}/>
							</div>
							<div>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>경력</p>
								<TextInput value={formData.career} onChange={(e) => changeCareer(e.target.value)}/>
								
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
									className='h-40 resize-none'
									
									maxLength={1000}
								/>
								<div className="text-sm text-gray-500 dark:text-gray-400">
									{formData.questions[index].answer.length} / 1000
								</div>
								{formData.questions.length > 1 && (
									<div className="flex jusfy-end">
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
				</div>
				
			<div className="flex justify-end mt-10">
				<Button className='bg-positive-300' onClick={id ? updateStatement: createStatement}>
					저장
				</Button>
			</div>
		</div>
	);
};
