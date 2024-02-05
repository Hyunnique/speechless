import { Button, Card, Checkbox, Label, TextInput, Select, Dropdown } from 'flowbite-react';
import React, { useState } from 'react';
import { Datepicker } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { SearchCriteria } from "../types/SearchCriteria.ts";

interface SpeechSearchProps{
    onSearch: (criteria: SearchCriteria) => void;
}

export const SpeechSearch: React.FC<SpeechSearchProps> = ({ onSearch }) => {
    const [criteria, setCriteria] = useState<SearchCriteria>({});
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCriteria((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("검색:", criteria);
        onSearch(criteria);
    };
    const createSpeech = async () => {
        navigate('/speech/write');
    };

    const handleSessionStartChange = (date: Date | null) => {
        setCriteria(prevCriteria => ({
            ...prevCriteria,
            startDate: date ? date.toISOString() : ''
        }));
    };
    const handleDeadlineChange = (date: Date | null) => {
        setCriteria(prevCriteria => ({
            ...prevCriteria,
            endDate: date ? date.toISOString() : ''
        }));
    };

    const handleMaxParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = parseInt(value, 10);

        if (!isNaN(numericValue) && numericValue >= 0) {
            setCriteria(prevCriteria => ({
                ...prevCriteria,
                maxParticipants: numericValue
            }));
        }
    };


    return (
        <>
            <Card className='max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl'>
                <div className="flex justify-center">
                    <button onClick={createSpeech} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-20 rounded">
                        모집하기
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <Select className="border-black" name="searchType">
                        <option value="title">제목</option>
                        <option value="writer">작성자</option>
                        <option value="content">내용</option>
                    </Select>
                    <div className="flex items-center bg-white rounded px-1 py-1">
                        <input
                            type="text"
                            onChange={handleChange}
                            name="keyword"
                            className="flex-grow px-2 py-1 rounded "
                            placeholder="Search..."
                        />
                        <button className="ml-2 bg-positive-200 text-white px-1 py-1 rounded" type="submit">
                            Search
                        </button>
                    </div>
                    <div>세션 기간</div>
                    <div className='flex items-center gap-2'>
                        <Datepicker showClearButton={false} name="startDate" onSelectedDateChanged={(date) => handleSessionStartChange(date)}/>
                        <Datepicker showClearButton={false} name="endDate" onSelectedDateChanged={(date) => handleDeadlineChange(date)}/>
                    </div>
                    <div>필터</div>
                    <Select className="border-black" name="category" onChange={handleChange}>
                        <option value="IT">IT</option>
                        <option value="자기소개">자기소개</option>
                        <option value="자유">자유</option>
                    </Select>
                    <div>상태</div>
                    <div className='flex items-center gap-2'>
                        <input className='mb-2 block' type='radio' name='status' value='모집 중'/>모집 중
                        <input className='mb-2 block' type='radio' name='status' value='모집 완료'/>모집 완료
                        <input className='mb-2 block' type='radio' name='status' value='모집 종료'/>모집 종료
                    </div>
                    <div>참가 정원</div>
                    <div className='flex items-center gap-2'>
                        <input className='mb-2 block w-1/4' type='number' name='maxParticipants' value={criteria.maxParticipants || ''} onChange={handleMaxParticipantsChange}/>
                    </div>
                </form>
            </Card>
        </>
    );
}