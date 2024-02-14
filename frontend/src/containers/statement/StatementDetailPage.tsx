import React, { useEffect, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Button, Card, TextInput } from 'flowbite-react';
import { Statement } from '../../types/Statement';
import { useLocalAxios } from '../../utils/axios';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TitledCard } from '../../components/TitledCard.tsx';
import { CustomButton } from '../../components/CustomButton.tsx';
import { CustomBadge } from '../../components/CustomBadge.tsx';
import { Viewer } from '@toast-ui/react-editor';

interface StatementForm extends Statement {
	questions: { question: string; answer: string }[];
}

export const StatementDetailPage: React.FC = () => {
	const { id } = useParams();

	const localAxios = useLocalAxios(true);

	//내부적으로 사용하는 Statement 데이터. 만약 update 모드면 기존 데이터를 가져온다.
	const [formData, setFormData] = useState<StatementForm>({
		id: 0,
		title: '',
		company: '',
		position: '',
		career: '',
		questions: [{ question: '', answer: '' }],
	});

	const [viewerKey, setViewerKey] = useState(0);
	const [questionCursor, setQuestionCursor] = useState(1);

	const navigate = useNavigate();

	//id가 존재할 경우 기존 데이터를 가져온다.
	useEffect(() => {
		if (id) {
			localAxios
				.get(`statements/${id}`)
				.then((res: { data: StatementForm }) => {
					setFormData(res.data);
					setViewerKey(viewerKey + 1);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, []);

	const increaseCursor = () => {
		if (questionCursor < formData.questions.length) {
			setQuestionCursor(questionCursor + 1);
			setViewerKey(viewerKey + 1);
		}
	};

	const decreaseCursor = () => {
		if (questionCursor > 1) {
			setQuestionCursor(questionCursor - 1);
			setViewerKey(viewerKey + 1);
		}
	};

	return (
		<>
			<div className='content-header mb-10'>
				<Breadcrumb className='pb-8'>
					<BreadcrumbItem>
						<Link to='/'>홈</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Link to='/interview'>면접 연습하기</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Link to='/interview'>면접 사전 정보 관리</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>면접 사전 정보 확인</BreadcrumbItem>
				</Breadcrumb>
				<div className='flex justify-between items-center'>
					<h1 className='text-3xl font-semibold leading-tight text-gray-700'>면접 사전 정보 확인</h1>
					<div className='flex gap-3'>
						<CustomButton
							bordered
							color='white'
							onClick={() => {
								navigate('/statement/write/' + id);
							}}
						>
							<div className='flex items-center gap-2'>
								<span className='material-symbols-outlined text-sm'>edit</span>
								<span>사전 정보 수정</span>
							</div>
						</CustomButton>
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
			</div>

			<Card className='2xl:w-3/4 xl:w-4/5 w-full mx-auto p-10'>
				<div className='flex flex-col space-y-10'>
					<p className='text-black text-lg font-semibold'>기본 정보</p>
					<div className='flex flex-col space-y-8 items-center'>
						<div className='w-1/2'>
							<div className='grid grid-cols-2 mb-5 pb-1 border-gray-300 border-b-2'>
								<p className='text-gray-500'>기업 이름</p>
								<p>{formData.company}</p>
							</div>
							<div className='grid grid-cols-2 mb-5 pb-1 border-gray-300 border-b-2'>
								<p className='text-gray-500'>지원 포지션</p>
								<p>{formData.position}</p>
							</div>
							<div className='grid grid-cols-2 mb-5 pb-1 border-gray-300 border-b-2'>
								<p className='text-gray-500'>경력</p>
								<p>{formData.career + '년'}</p>
							</div>
						</div>
					</div>
					<p className='text-gray-700 text-lg font-semibold'>자기소개서 문답</p>
					<div className='bg-gray-50 border-2 border-gray-200 rounded-md p-10 flex flex-col space-y-6'>
						<div className='flex items-center gap-3'>
							<CustomBadge color='purple' size='md' bordered>
								{questionCursor}
							</CustomBadge>
							<span className='w-full font-semibold' color='white'>
								{formData.questions[questionCursor - 1].question}
							</span>
						</div>
						<div className='bg-gray-200 rounded-md px-4 py-6'>
							<Viewer key={viewerKey} initialValue={formData.questions[questionCursor - 1].answer} />
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
						{/*{formData.questions.map((_, index) => (*/}
						{/*	<div key={index} className='p-3 bg-primary-50'>*/}
						{/*		<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>문항</p>*/}
						{/*		<p> {formData.questions[index].question} </p>*/}
						{/*		<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>답변</p>*/}
						{/*		<p> {formData.questions[index].answer} </p>*/}
						{/*	</div>*/}
						{/*))}*/}
					</div>
				</div>
			</Card>
		</>
	);
};
