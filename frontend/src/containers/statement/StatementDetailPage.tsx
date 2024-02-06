import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { Statement } from '../../types/Statement';
import { useLocalAxios } from '../../utils/axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {TitledCard} from "../../components/TitledCard.tsx";

interface StatementForm extends Statement {
	questions: { question: string; answer: string }[];
}

export const StatementDetailPage: React.FC = () =>  {

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
	  
	return (
		<TitledCard className='!bg-white p-8' title="면접 사전 정보 확인">
			<div className='flex flex-col w-2/3 mx-auto'>
				<div className='flex flex-row gap-3'>
					<Button className='bg-negative-400 mt-5' onClick={() => navigate("/interview")}>뒤로 가기</Button>
					<Button className='bg-primary-400 mt-5' onClick={() => navigate("/statement/write/"+id)}>수정</Button>
				</div>
				<div className='mt-5'>
					<div className='space-y-6'>
						<p className='w-1/2 font-bold text-3xl'> {formData.title} </p>
						<div className='w-1/2'>
							<div className='grid grid-cols-2'>
								<p className=' text-gray-500 dark:text-gray-400'>기업 이름</p>
								<p> {formData.company} </p>
							</div>
							<div className='grid grid-cols-2 mt-7'>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>지원 포지션</p>
								<p> {formData.position} </p>
							</div>
							<div className='grid grid-cols-2 mt-7'>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>경력</p>
								<p> {formData.career} </p>
							</div>
						</div>
						<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>자기소개서</p>
						{formData.questions.map((_, index) => (
							<div key={index} className='p-3 bg-primary-50'>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>문항</p>
								<p> {formData.questions[index].question} </p>
								<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>답변</p>
								<p> {formData.questions[index].answer} </p>
							</div>
						))}
					</div>
				</div>
			</div>
		</TitledCard>
		// <div className='flex flex-col w-2/3 mx-auto'>
		// 	<h1 className="text-4xl font-bold leading-tight text-gray-900">자기소개서 확인</h1>
		// 	<div className='flex flex-row gap-3'>
		// 		<Button className='bg-negative-400 mt-5' onClick={() => navigate("/interview")}>뒤로 가기</Button>
		// 		<Button className='bg-primary-400 mt-5' onClick={() => navigate("/statement/write/"+id)}>수정</Button>
		// 	</div>
		// 	<div className='mt-5'>
		// 		<div className='space-y-6'>
		// 			<p className='w-1/2 font-bold text-3xl'> {formData.title} </p>
		//
		// 			<div className='w-1/2'>
		// 				<div className='grid grid-cols-2'>
		// 					<p className=' text-gray-500 dark:text-gray-400'>기업 이름</p>
		// 					<p> {formData.company} </p>
		// 				</div>
		// 				<div className='grid grid-cols-2 mt-7'>
		// 					<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>지원 포지션</p>
		// 					<p> {formData.position} </p>
		// 				</div>
		// 				<div className='grid grid-cols-2 mt-7'>
		// 					<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>경력</p>
		// 					<p> {formData.career} </p>
		// 				</div>
		// 			</div>
		//
		// 			<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>자기소개서</p>
		// 			{formData.questions.map((_, index) => (
		// 				<div key={index} className='p-3 bg-primary-50'>
		// 					<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>문항</p>
		// 					<p> {formData.questions[index].question} </p>
		// 					<p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>답변</p>
		// 					<p> {formData.questions[index].answer} </p>
		// 				</div>
		// 			))}
		// 		</div>
		// 	</div>
		// </div>
	);
};
