import React, { useEffect, useRef, useState } from 'react';
import { Button, TextInput, Textarea, Breadcrumb, BreadcrumbItem, FloatingLabel, Card, Badge } from 'flowbite-react';
import { Statement } from '../../types/Statement';
import { useLocalAxios } from '../../utils/axios';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Editor } from '@toast-ui/react-editor';
import { CustomButton } from '../../components/CustomButton.tsx';
import { CustomBadge } from '../../components/CustomBadge.tsx';

interface StatementForm extends Statement {
	questions: { question: string; answer: string }[];
}

export const StatementWritePage: React.FC = () => {
	const { id } = useParams();

	const localAxios = useLocalAxios(true);

	const editorRef = useRef<Editor | null>(null);

	//내부적으로 사용하는 Statement 데이터. 만약 update 모드면 기존 데이터를 가져온다.
	const [formData, setFormData] = useState<StatementForm>({
		id: 0,
		title: '',
		company: '',
		position: '',
		career: '0',
		questions: [{ question: '', answer: '' }],
	});

	const [editorKey, setEditorKey] = useState(0);

	const [questionCursor, setQuestionCursor] = useState(1);

	const navigate = useNavigate();

	//id가 존재할 경우 기존 데이터를 가져온다.
	useEffect(() => {
		if (id) {
			localAxios
				.get(`statements/${id}`)
				.then((res: { data: StatementForm }) => {
					setFormData(res.data);
					setEditorKey(editorKey + 1);
				})
				.catch((err) => {
					console.log(err);
				});
		}

		return () => {};
	}, []);

	const changeTitle = (title: string) => {
		if (title.length > 20) {
			alert('제목의 최대 길이는 20자입니다.');
		} else {
			setFormData((prev) => ({ ...prev, ['title']: title }));
		}
	};

	const changeCompany = (company: string) => {
		if (company.length > 20) {
			alert('회사 이름의 최대 길이는 20자입니다.');
		} else {
			setFormData((prev) => ({ ...prev, ['company']: company }));
		}
	};

	const changePosition = (position: string) => {
		if (position.length > 30) {
			alert('지원 포지션의 최대 길이는 30자입니다.');
		} else {
			setFormData((prev) => ({ ...prev, ['position']: position }));
		}
	};

	const changeCareer = (career: string) => {
		if (career !== '' && isNaN(Number(career))) {
			const numericCareer = career.replace(/\D/g, '');
			setFormData((prev) => ({ ...prev, career: numericCareer }));
		} else if (Number(career) < 0) {
			alert('경력은 0 이상의 값만 입력 가능합니다.');
		} else {
			setFormData((prev) => ({ ...prev, ['career']: career }));
		}
	};

	const decreaseCursor = () => {
		if (questionCursor > 1) {
			setQuestionCursor(questionCursor - 1);
			setEditorKey(editorKey + 1);
		}
	};

	const increaseCursor = () => {
		if (questionCursor < formData.questions.length) {
			setQuestionCursor(questionCursor + 1);
			setEditorKey(editorKey + 1);
		}
	};

	const addQuestion = () => {
		if (formData.questions.length >= 5) {
			alert('문항은 최대 5개 까지만 입력 가능합니다.');
			return;
		}

		setFormData((prev) => ({
			...prev,
			questions: [...(prev.questions || []), { question: '', answer: '' }],
		}));

		setQuestionCursor(formData.questions.length + 1);

		setEditorKey(editorKey + 1);
	};

	const removeQuestion = () => {
		if (formData.questions.length <= 1) {
			alert('최소한 하나의 문항은 존재해야 합니다.');
			return;
		}

		setFormData((prev) => ({
			...prev,
			questions: prev.questions ? prev.questions.filter((_, i) => i !== questionCursor - 1) : [],
		}));

		if (questionCursor >= formData.questions.length) {
			setQuestionCursor(questionCursor - 1);
		}

		setEditorKey(editorKey + 1);
	};

	//post 메소드를 통해 벡엔드에 새로운 자기소개서 생성을 요청한다.
	const createStatement = () => {
		if (!checkValidation()) {
			return;
		}
		localAxios
			.post('statements', formData)
			.then((res) => {
				console.log(res);
				navigate('/statement/detail/' + res.data.id);
			})
			.catch((err) => {
				alert('자기소개서 등록에 실패했습니다.');
				console.log(err);
			});
	};

	//put 메소드를 통해 벡엔드에 특정 id의 자기소개서 수정을 요청한다.
	const updateStatement = () => {
		if (!checkValidation()) {
			return;
		}
		localAxios
			.put(`statements`, formData)
			.then((res) => {
				console.log(res);
				navigate('/statement/detail/' + res.data.id);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const checkValidation = () => {
		if (formData.title === '') {
			alert('제목를 입력해야 합니다.');
			return false;
		} else if (formData.company === '') {
			alert('기업 이름를 입력해야 합니다.');
			return false;
		} else if (formData.position === '') {
			alert('지원 포지션를 입력해야 합니다.');
			return false;
		} else if (formData.career === '') {
			alert('경력을 입력해야 합니다.');
			return false;
		} else if (formData.questions?.length === 0) {
			alert('문항을 입력해야 합니다.');
			return false;
		} else {
			return true;
		}
	};

	return (
		<>
			<div className='content-header mb-10'>
				<Breadcrumb className='pb-8'>
					<BreadcrumbItem>
						<Link to='/interview'>면접 연습하기</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Link to='/interview'>면접 사전 정보 관리</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>면접 사전 정보 {id ? '수정' : '생성'}</BreadcrumbItem>
				</Breadcrumb>
				<div className='flex justify-between items-center'>
					<h1 className='text-3xl font-semibold leading-tight text-gray-700'>
						면접 사전 정보 {id ? '수정' : '생성'}
					</h1>
					<CustomButton
						bordered
						color='blue'
						onClick={() => {
							navigate('/interview');
						}}
					>
						<div className='flex items-center gap-2'>
							<span className='material-symbols-outlined text-sm'>arrow_back</span>
							<span>목록으로 이동</span>
						</div>
					</CustomButton>
				</div>
			</div>
			<Card className='2xl:w-3/4 xl:w-4/5 w-full mx-auto p-10'>
				<div className='flex flex-col space-y-10'>
					<p className='text-black text-lg font-semibold'>기본 정보</p>
					<div className='flex flex-col space-y-8'>
						<FloatingLabel
							className='w-full pl-1'
							variant='standard'
							label='제목'
							value={formData.title}
							onChange={(e) => changeTitle(e.target.value)}
						/>
						<div className='grid xl:grid-cols-3 grid-cols-1 xl:gap-10 gap-5'>
							<FloatingLabel
								variant='standard'
								label='기업 이름'
								className='pl-1'
								value={formData.company}
								onChange={(e) => changeCompany(e.target.value)}
							/>
							<FloatingLabel
								variant='standard'
								label='지원 포지션'
								className='pl-1'
								value={formData.position}
								onChange={(e) => changePosition(e.target.value)}
							/>
							<div className='flex items-center gap-4'>
								<FloatingLabel
									variant='standard'
									label='경력'
									className='pl-1'
									value={formData.career}
									onChange={(e) => changeCareer(e.target.value)}
								/>
								년
							</div>
						</div>
					</div>
					<p className='text-gray-700 text-lg font-semibold'>자기소개서 문답</p>
					<div className='bg-gray-50 border-2 border-gray-200 rounded-md p-10 flex flex-col space-y-6'>
						<p className='text-gray-700 text-md'>질문</p>
						<div className='flex items-center gap-3'>
							<CustomBadge color='purple' size='md' bordered>
								{questionCursor}
							</CustomBadge>
							<TextInput
								className='w-full'
								color='white'
								placeholder='질문을 입력해주세요.'
								value={formData.questions[questionCursor - 1].question}
								onChange={(e) => {
									const newQuestions = formData.questions.map((q, idx) =>
										idx === questionCursor - 1 ? { ...q, question: e.target.value } : q,
									);
									setFormData({ ...formData, questions: newQuestions });
								}}
							/>
						</div>
						<p className='text-gray-700 text-md'>답변</p>
						<Editor
							key={editorKey}
							initialValue={formData.questions[questionCursor - 1].answer}
							placeholder='답변을 입력해주세요.'
							initialEditType='wysiwyg'
							onChange={() => {
								const newQuestions = formData.questions.map((q, idx) =>
									idx === questionCursor - 1
										? { ...q, answer: editorRef.current?.getInstance().getMarkdown() }
										: q,
								);
								setFormData({ ...formData, questions: newQuestions });
							}}
							ref={editorRef}
							hideModeSwitch={true}
							toolbarItems={[
								['heading', 'bold', 'italic', 'strike'],
								['hr', 'quote'],
								['ul', 'ol', 'task', 'indent', 'outdent'],
								['table', 'link'],
							]}
						/>
						<div className='flex items-center justify-center gap-2'>
							<CustomButton color='blue' className='!py-3 !px-5' onClick={addQuestion}>
								<div className='flex items-center gap-2'>
									<span className='material-symbols-outlined text-sm'>add</span>
									<span>문항 추가</span>
								</div>
							</CustomButton>
							<CustomButton color='negative' className='!py-3 !px-5' onClick={removeQuestion}>
								<div className='flex items-center gap-2'>
									<span className='material-symbols-outlined text-sm'>delete</span>
									<span>문항 삭제</span>
								</div>
							</CustomButton>
						</div>
						<span className='flex items-center justify-center gap-2 p-2 rounded-full bg-white w-fit mx-auto border-2'>
							<button className='material-symbols-outlined' onClick={decreaseCursor}>
								chevron_left
							</button>
							<span className='text-sm tracking-widest'>
								{questionCursor} / {formData.questions.length}
							</span>
							<button className='material-symbols-outlined' onClick={increaseCursor}>
								chevron_right
							</button>
						</span>
					</div>
				</div>
				<CustomButton
					className='w-1/3 mt-10 mx-auto'
					color='blue'
					onClick={id ? updateStatement : createStatement}
				>
					{id ? '수정' : '저장'}
				</CustomButton>
			</Card>
		</>
	);
};
