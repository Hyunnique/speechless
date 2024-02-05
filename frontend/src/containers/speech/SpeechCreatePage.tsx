import React, { useEffect, useState } from 'react';
import { useLocalAxios } from '../../utils/axios';
import { Datepicker} from 'flowbite-react';
import classNames  from "classnames";


export const SpeechCreatePage = () => {
    // 폼 데이터..... 날짜에 new Date()...
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isPrivate: true,
        sessionStart: '',
        deadLine: '',
        category: 'IT',
        maxParticipants: 2,
    });

    const localAxios = useLocalAxios(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    // 폼 제출
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await localAxios.post('/community', formData);
            alert('작성 완료');
        } catch (error) {
            console.log(formData);
            alert('작성 실패');
        }
    };

    const privateButtonClick = (value:boolean) => {
        setFormData((prev) => ({
            ...prev,
            isPrivate: value,
        }));
    };

    const handleSessionStartChange = (date: Date) => {
        setFormData((prev) => ({
            ...prev,
            sessionStart: date.toISOString(),
        }));
    };

    const handleDeadlineChange = (date: Date) => {
        setFormData((prev) => ({
            ...prev,
            deadLine: date.toISOString(),
        }));
    };

    return (
        <>
            <div className="container max-w-xl mx-auto p-4">
                <h2 className="text-xl font-semibold mb-4">새 모집 글 작성</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                            제목
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                            내용
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <p className="block text-gray-700 text-sm font-bold mb-2">
                            승인 필요 여부
                        </p>
                        <div className="space-x-3">
                            <button
                                className={classNames(
                                    'hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
                                    (formData.isPrivate ? 'bg-positive-500' : 'bg-negative-500')
                                )}
                                name="isPrivate"
                                onClick={() => privateButtonClick(true)}
                                type="button"
                            >
                                승인 참여
                            </button>
                            <button
                                className={classNames(
                                    'hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
                                    (formData.isPrivate ? 'bg-negative-500' : 'bg-positive-500')
                                )}
                                name="isPrivate"
                                onClick={() => privateButtonClick(false)}
                                type="button"
                            >
                                자율 참여
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="block text-gray-700 text-sm font-bold mb-2">
                            세션 시작 시간
                        </p>
                        <Datepicker onSelectedDateChanged={handleSessionStartChange} />
                    </div>
                    <div className="mb-4">
                        <p className="block text-gray-700 text-sm font-bold mb-2">
                            모집 마감일
                        </p>
                        <Datepicker onSelectedDateChanged={handleDeadlineChange} />
                    </div>
                    <div className="mb-4  w-1/6">
                        <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                            카테고리
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="IT">IT</option>
                            <option value="Education">Education</option>
                            <option value="Science">Science</option>
                        </select>
                    </div>
                    <div className="mb-4 w-1/6">
                        <label htmlFor="maxParticipants" className="block text-gray-700 text-sm font-bold mb-2">
                            최대 참가자 수
                        </label>
                        <input
                            type="number"
                            id="maxParticipants"
                            name="maxParticipants"
                            value={formData.maxParticipants}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        등록하기
                    </button>
                </form>
            </div>
        </>
    );
};
