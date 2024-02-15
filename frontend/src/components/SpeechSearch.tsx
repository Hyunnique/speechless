import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchCriteria } from '../types/SearchCriteria';
import { Card, Dropdown } from 'flowbite-react';
import { CustomButton } from './CustomButton.tsx';

interface SpeechSearchProps {
	onSearch: (criteria: SearchCriteria) => void;
}

export const SpeechSearch: React.FC<SpeechSearchProps> = ({ onSearch }) => {
	const [criteria, setCriteria] = useState<SearchCriteria>({});
	const [searchType, setSearchType] = useState<string | null>(null);
	const [keyword, setKeyword] = useState<string>('');
	const navigate = useNavigate();

	const filters = [
		{
			name: '제목',
			value: 'title',
		},
		{
			name: '작성자',
			value: 'writerName',
		},
		{
			name: '내용',
			value: 'content',
		},
	];

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type, checked } = e.target as HTMLInputElement;
		if (type === 'checkbox') {
			setCriteria((prev) => ({ ...prev, [name]: checked }));
		} else {
			setCriteria((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.target.value);
	};

	const handleSubmit = () => {
		let searchParams: Partial<SearchCriteria> = { ...criteria };

		if (searchType && keyword) {
			searchParams[searchType as keyof Pick<SearchCriteria, 'title' | 'writerName' | 'content'>] = keyword;
		}

		console.log('검색 조건:', searchParams);
		onSearch(searchParams as SearchCriteria);
	};

	const writeSpeech = () => {
		navigate('/speech/write');
	};

	return (
		<>
			<Card>
				<p className='font-semibold text-md border-b-2 border-gray-200 mb-2 pb-1'>검색 필터</p>
				<div className='flex flex-col gap-4'>
					<Dropdown
						color='teal'
						label={filters.find((x) => x.value === searchType)?.name || '검색 유형 선택'}
					>
						{filters.map((filter) => (
							<Dropdown.Item
								key={filter.value}
								onClick={() => {
									setSearchType(filter.value);
								}}
							>
								{filter.name}
							</Dropdown.Item>
						))}
					</Dropdown>
					<input
						type='text'
						name='keyword'
						onChange={handleKeywordChange}
						placeholder='검색어'
						className='input'
					/>
					<select name='category' onChange={handleChange} className='select'>
						<option value=''>카테고리 선택</option>
						<option value='IT'>IT</option>
						<option value='인문'>인문</option>
						<option value='언어'>언어</option>
						<option value='사회'>사회</option>
						<option value='역사'>역사</option>
						<option value='과학'>과학</option>
						<option value='디자인'>디자인</option>
						<option value='교육'>교육</option>
						<option value='의예'>의예</option>
						<option value='예체능'>예체능</option>
						<option value='자기소개'>자기소개</option>
						<option value='자유주제'>자유주제</option>
					</select>
					<label>
						<input type='checkbox' name='recruiting' onChange={handleChange} />
						<span className='ml-2'>모집 중</span>
					</label>
					<input
						type='number'
						name='maxParticipants'
						onChange={(e) =>
							setCriteria((prev) => ({ ...prev, maxParticipants: parseInt(e.target.value) }))
						}
						placeholder='최대 참여자 수'
						className='input'
					/>
					<CustomButton color='blue' onClick={handleSubmit}>
						<div className='flex justify-center items-center gap-2'>
							<span className='material-symbols-outlined text-[1.2rem]'>search</span>
							<span>검색</span>
						</div>
					</CustomButton>
				</div>
			</Card>
		</>
	);
};
