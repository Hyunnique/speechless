import { Button, Card, Checkbox, Label, TextInput, Select, Dropdown } from 'flowbite-react';
import { Calendar } from './Calendar.tsx';
import React from 'react';
import { Datepicker } from 'flowbite-react';
import { useEffect, useState } from 'react';


export const SpeechSearch = ( ) => {
    return (
        <>
            <Card className='max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl'>
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
                            className="flex-grow px-2 py-1 rounded" // 수정된 부분: 'px-2'로 패딩 값 지정
                            placeholder="Search..."
                        />
                        <button className="bg-positive-200 text-white px-4 py-1 rounded">
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