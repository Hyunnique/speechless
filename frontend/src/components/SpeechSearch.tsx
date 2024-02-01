import { Button, Card, Checkbox, Label, TextInput, Select, Dropdown } from 'flowbite-react';
import React from 'react';
import { Datepicker } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export const SpeechSearch = ( ) => {
    const navigate = useNavigate();

    const createSpeech = async () => {
        navigate('/speech/write');
    };

    return (
        <>
            <Card className='max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl'>
                <div className="flex justify-end">
                    <button onClick={createSpeech} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        모집하기
                    </button>
                </div>
                <form className='flex flex-col gap-4'>
                    <div>검색</div>
                    <Select className="border-black">
                    <option>제목</option>
                        <option>France</option>
                        <option>Canada</option>
                        <option>Germany</option>
                    </Select>
                    <div className="flex items-center bg-white rounded px-1 py-1">
                        <input
                            type="text"
                            className="flex-grow px-2 py-1 rounded "
                            placeholder="Search..."
                        />
                        <button className="ml-2 bg-positive-200 text-white px-1 py-1 rounded">
                            Search
                        </button>
                    </div>

                    <div>필터</div>
                    <Select className="border-black" id='category' >
                        <option>IT</option>
                        <option>Canada</option>
                        <option>France</option>
                        <option>Germany</option>
                    </Select>
                    <div>상태</div>
                    <div className='flex items-center gap-2'>
                        <input className='mb-2 block' type='radio' name='' value=''/>모집 중
                        <input className='mb-2 block' type='radio' name='' value=''/>모집 완료
                        <input className='mb-2 block' type='radio' name='' value=''/>종료
                    </div>
                    <div>참가 정원</div>
                    <div className='flex items-center gap-2'>
                        <input className='mb-2 block' type='range' name='' value=''/>
                    </div>
                    <div>공개 여부</div>
                    <div className='flex items-center gap-2'>
                        <input className='mb-2 block' type='radio' name='' value=''/>모집 완료
                        <input className='mb-2 block' type='radio' name='' value=''/>종료
                    </div>
                    <div>세션 기간</div>
                    <div className='flex items-center gap-2'>
                        <Datepicker/>
                        <Datepicker/>
                    </div>
                </form>
            </Card>
        </>
    );
}