import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchCriteria } from '../types/SearchCriteria';

interface SpeechSearchProps {
	onSearch: (criteria: SearchCriteria) => void;
}

export const SpeechSearch: React.FC<SpeechSearchProps> = ({ onSearch }) => {
	const [criteria, setCriteria] = useState<SearchCriteria>({});
	const [searchType, setSearchType] = useState<string>('');
	const [keyword, setKeyword] = useState<string>('');
	const navigate = useNavigate();

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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

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
			<div className='card max-w-full'>
				<div className='flex justify-center'>
					<button onClick={writeSpeech} className='btn'>
						모집하기
					</button>
				</div>
				<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
					<select name='searchType' onChange={(e) => setSearchType(e.target.value)} className='select'>
						<option value=''>검색 유형 선택</option>
						<option value='title'>제목</option>
						<option value='writerName'>작성자</option>
						<option value='content'>내용</option>
					</select>
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
						<option value='기타'>기타</option>
						<option value='자기소개'>자기소개</option>
						<option value='자유'>자유</option>
					</select>
					<label>
						<input type='checkbox' name='recruiting' onChange={handleChange} /> 모집 중
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
					<button type='submit' className='btn'>
						검색
					</button>
				</form>
			</div>
		</>
	);
};
