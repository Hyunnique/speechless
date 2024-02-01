import React, { useEffect, useState } from 'react';
import { useLocalAxios } from '../../utils/axios';
import { Datepicker} from 'flowbite-react';
import classNames  from "classnames";


export const SpeechCreatePage = () => {
    // 폼 데이터.....
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        content: '',
        currentParticipants: 0,
        maxParticipants: 0,
        deadline: '',
        sessionStart: '',
        invisible: true,
        private: true,
        createdAt: '',
    });

    const localAxios = useLocalAxios();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newFormData = { ...prev, [name]: value };
            console.log(newFormData); //
            return newFormData;
        });
    };
    // 폼 제출
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await localAxios.post('/community/createSpeech', formData);
            alert('작성 완료');
        } catch (error) {
            console.log(formData);
            alert('작성 실패');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await localAxios.get('/'); // 카테고리 불러오기

                setFormData((prev) => ({
                    ...prev,
                    ...response.data, //
                }));
            } catch (error) {
                console.error('카테고리 불러오기 실패', error);
            }
        };

        fetchData();
    }, []);

    const privateButtonClick = (value: boolean) => {
        setFormData((prev) => ({
            ...prev,
            private: value,
        }));
    };
    const invisibleButtonClick = (value: boolean) => {
        setFormData((prev) => ({
            ...prev,
            invisible: value,
        }));
    };

    const handleSessionStartChange = (date: Date) => {
        setFormData((prev) => {
            const newFormData = { ...prev, sessionStart: date.toISOString() };
            console.log('Session Start:', newFormData.sessionStart); // 선택된 날짜를 콘솔에 출력
            return newFormData;
        });
    };


    const handleDeadlineChange = (date: Date) => {
        setFormData((prev) => ({
            ...prev,
            deadline: date.toISOString(),
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
                                    'bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
                                    {
                                        'bg-blue-500': formData.private, // private 값에 따라 클래스 추가
                                    }
                                )}
                                name="private"
                                onClick={() => privateButtonClick(true)}
                                type="button"
                            >
                                승인 참여
                            </button>
                            <button
                                className={classNames(
                                    'bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
                                    {
                                        'bg-blue-500': !formData.private, // private 값에 따라 클래스 추가
                                    }
                                )}
                                name="private"
                                onClick={() => privateButtonClick(false)}
                                type="button"
                            >
                                자율 참여
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="block text-gray-700 text-sm font-bold mb-2">
                            공개 여부
                        </p>
                        <div className="space-x-3">
                            <button
                                className={classNames(
                                    'bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
                                    {
                                        'bg-blue-500': formData.invisible, // invisible 값에 따라 클래스 추가
                                    }
                                )}
                                name="invisible"
                                onClick={() => invisibleButtonClick(true)}
                                type="button"
                            >
                                공개
                            </button>
                            <button
                                className={classNames(
                                    'bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
                                    {
                                        'bg-blue-500': !formData.invisible, // invisible 값에 따라 클래스 추가
                                    }
                                )}
                                name="private"
                                onClick={() => invisibleButtonClick(false)}
                                type="button"
                            >
                                비공개
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
                            id="category"
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
                        <label htmlFor="minParticipants" className="block text-gray-700 text-sm font-bold mb-2">
                            최소 참가자 수
                        </label>
                        <input
                            type="number"
                            id="currentParticipants"
                            name="currentParticipants"
                            value={formData.currentParticipants}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
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
