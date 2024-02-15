import React, { useEffect, useRef, useState } from 'react';
import { useLocalAxios } from '../../utils/axios';
import {Breadcrumb, BreadcrumbItem, Card, Datepicker, Dropdown, FloatingLabel, TextInput} from 'flowbite-react';
import classNames from 'classnames';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {CustomButton} from "../../components/CustomButton.tsx";
import moment from "moment";
import {Editor} from "@tinymce/tinymce-react";

const EDITOR_API_KEY = import.meta.env.VITE_TINY_API_KEY;
export const SpeechCreatePage = () => {

	const categories = [
		'자유주제',
		'자기소개',
		'IT',
		'인문',
		'언어',
		'사회',
		'역사',
		'과학',
		'디자인',
		'교육',
		'의예',
		'예체능',
	];

	const [formData, setFormData] = useState({
		title: '',
		content: '',
		sessionStart: new Date().toISOString(),
		deadline: new Date().toISOString(),
		category: '자유주제',
		maxParticipants: 2,
	});

	const [ editorKey, setEditorKey ] = useState(0);
	// const editorRef = useRef<Editor | null>(null);
	const { id } = useParams();
	const localAxios = useLocalAxios(true);
	const navigate = useNavigate();
	//id 존재여부로 write, update 구분
	// date 형태?
	useEffect(() => {
		console.log(new Date().toISOString());
		if (id) {
			const fetchData = async () => {
				try {
					const response = await localAxios.get(`/community/${id}`);
					setFormData({ ...response.data });
					setEditorKey(editorKey + 1);
				} catch (error) {
					console.error('데이터 로딩 실패:', error);
					navigate('/error', {
						replace: true,
						state: {
							code: 404,
							message: '존재하지 않는 글입니다.',
						},
					});
				}
			};
			fetchData();
		}
	}, []);

	const submitData = async () => {
		const requiredFields = ['title', 'content', 'sessionStart', 'deadline', 'category', 'maxParticipants'];

		const emptyFields = requiredFields.filter((field) => {
			const value = formData[field as keyof typeof formData];
			return value === '' || value === 0;
		});

		if (emptyFields.length > 0) {
			alert(`${emptyFields.join(', ')} 입력이 필요합니다!`);
			return;
		}
		try {
			if (id) {
				// 업데이트 요청
				await localAxios.put(`/community/${id}`, formData);
				alert('수정 완료');
				navigate(`/speech/${id}`);
			} else {
				// 생성 요청
				const res = await localAxios.post('/community', formData);
				console.log(formData);
				alert('작성 완료');
				navigate(`/speech/${res.data.id}`);
			}
		} catch (error) {
			console.error('글 작성 or 수정 에러:', error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		validateField(name, value);
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSessionStartChange = (date: Date) => {
		const dateIso = date.toISOString();
		validateField('sessionStart', dateIso);
		setFormData((prev) => ({ ...prev, sessionStart: dateIso }));
	};

	const handleDeadlineChange = (date: Date) => {
		const dateIso = date.toISOString();
		validateField('deadline', dateIso);
		setFormData((prev) => ({ ...prev, deadline: dateIso }));
	};

	const validateField = (name: string, value: string | number) => {
		let sessionStart = new Date(formData.sessionStart);

		switch (name) {
			case 'sessionStart':
				if (new Date(value) < new Date()) {
					alert('세션 시작 시간은 현재 시간보다 이후여야 합니다.');
					return false;
				}
				break;
			case 'deadline':
				// 모집 마감일은 세션 시작 시간 이후
				if (new Date(value) > sessionStart) {
					alert('모집 마감일은 세션 시작 시간 이전이어야 합니다.');
					return false;
				}
				break;
			case 'maxParticipants':
				// 최대 참가자 수는 정수
				if (typeof value === 'number' && (isNaN(value) || value <= 1)) {
					alert('최대 참가자 수는 1보다 커야 합니다.');
					return false;
				}
				break;
			default:
				break;
		}
		return true;
	};

	return (
		<>
			<div className='content-header mb-10'>
				<Breadcrumb className='pb-8'>
					<BreadcrumbItem>
						<Link to='/'>홈</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Link to='/speech'>함께 발표하기</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Link to='/speech'>{id ? '모집 글 수정' : '새 모집 글 작성'}</Link>
					</BreadcrumbItem>
				</Breadcrumb>
				<div className='flex justify-between items-center'>
					<h1 className='text-3xl font-semibold leading-tight text-gray-700'>
						{id ? '모집 글 수정' : '새 모집 글 작성'}
					</h1>
					<CustomButton
						bordered
						color='blue'
						onClick={() => {
							navigate('/speech');
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
					<div>
						<div className='text-gray-700 font-semibold pl-2 pb-3'>제목</div>
						<TextInput
							value={formData.title}
							name='title'
							onChange={handleChange}
						/>
					</div>
					<div>
						<div className='text-gray-700 font-semibold pl-2 pb-3'>내용</div>
						<Editor
							apiKey={EDITOR_API_KEY}
							// initialValue={formData.questions[questionCursor - 1].answer}
							value={formData.content}
							plugins={'autosave wordcount'}
							onEditorChange={(val, editor) => {
								setFormData({ ...formData, content: val });
							}}
						/>
						{/*<Editor*/}
						{/*	key={editorKey}*/}
						{/*	initialValue={formData.content}*/}
						{/*	placeholder='내용을 입력해주세요.'*/}
						{/*	initialEditType='wysiwyg'*/}
						{/*	onChange={() => {*/}
						{/*		setFormData({...formData, content: editorRef.current?.getInstance().getMarkdown()});*/}
						{/*	}}*/}
						{/*	ref={editorRef}*/}
						{/*	hideModeSwitch={true}*/}
						{/*	toolbarItems={[*/}
						{/*		['heading', 'bold', 'italic', 'strike'],*/}
						{/*		['hr', 'quote'],*/}
						{/*		['ul', 'ol', 'task', 'indent', 'outdent'],*/}
						{/*		['table', 'link'],*/}
						{/*	]}*/}
						{/*/>*/}
					</div>
					<div>
						<div className='text-gray-700 font-semibold pl-2 pb-3'>카테고리</div>
						<div className='flex flex-wrap gap-2'>
							{categories.map((category) => (
								<CustomButton
									key={category}
									color={formData.category === category ? 'blue' : 'indigo'}
									bordered
									className={formData.category === category ? 'opacity-100' : 'opacity-80'}
									// className={classNames(
									// 	'hover:bg-positive-500 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
									// 	formData.category === category ? 'bg-positive-500' : 'bg-teal-100',
									// )}
									onClick={() => setFormData((prev) => ({...prev, category}))}
								>
									{category}
								</CustomButton>
							))}
						</div>
					</div>
					<div className='flex gap-5'>
						<div className='w-1/2'>
							<div className='text-gray-700 font-semibold pl-2 pb-3'>모집 마감 시간</div>
							<input type='datetime-local'
								   name='deadline'
								   value={moment(formData.deadline).toISOString(true).substring(0, 16)}
								   onChange={(e) => {
									   setFormData({ ...formData, deadline: moment(e.target.value).toISOString() });
								   }}
							/>
						</div>
						<div className='w-1/2'>
							<div className='text-gray-700 font-semibold pl-2 pb-3'>세션 시작 시간</div>
							<input type='datetime-local'
								   name='sessionStart'
								   value={moment(formData.sessionStart).toISOString(true).substring(0, 16)}
								   onChange={(e) => {
									   setFormData({ ...formData, sessionStart: moment(e.target.value).toISOString() });
								   }}
							/>
						</div>
					</div>
					<div>
						<div className='text-gray-700 font-semibold pl-2 pb-3'>최대 참가 인원</div>
						<div className='flex items-center gap-3'>
							<Dropdown color='teal' label={formData.maxParticipants}>
								{
									[2, 3, 4, 5, 6, 7, 8].map(num => (
										<Dropdown.Item
											key={num}
											onClick={() => {
												setFormData({...formData, maxParticipants: num});
											}}
										>
											{num}
										</Dropdown.Item>
									))
								}
							</Dropdown>
							<span>명</span>
						</div>
					</div>
					<CustomButton
						className='w-1/3 mt-10 mx-auto'
						color='blue'
						onClick={submitData}
					>
						{id ? '수정' : '저장'}
					</CustomButton>
				</div>
			</Card>
		</>
	);
};
