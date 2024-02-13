import React, { useEffect, useState } from 'react';
import { useLocalAxios } from '../../utils/axios';
import { Datepicker} from 'flowbite-react';
import classNames  from "classnames";
import { useParams,useNavigate  } from 'react-router-dom';

export const SpeechCreatePage = () => {
    // 폼 데이터..... 날짜에 new Date()...
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        sessionStart: '',
        deadline: '',
        category: '자유주제',
        maxParticipants: 2,
    });

    const { id } = useParams();
    const localAxios = useLocalAxios(true);
    const navigate = useNavigate();
    //id 존재여부로 write, update 구분
    // date 형태?
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const response = await localAxios.get(`/community/${id}`);
                    setFormData({ ...response.data });
                } catch (error) {
                    console.error('데이터 로딩 실패:', error);
                }
            };
            fetchData();
        }
    }, []);

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const requiredFields = ['title', 'content', 'sessionStart', 'deadline', 'category', 'maxParticipants'];

        const emptyFields = requiredFields.filter(field => {
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSessionStartChange = (date:Date) => {
        const dateIso = date.toISOString();
        validateField('sessionStart', dateIso);
        setFormData(prev => ({ ...prev, sessionStart: dateIso }));
    };

    const handleDeadlineChange = (date:Date) => {
        const dateIso = date.toISOString();
        validateField('deadline', dateIso);
        setFormData(prev => ({ ...prev, deadline: dateIso }));
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
                            카테고리
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['자유주제', '자기소개', 'IT', '인문', '언어', '사회', '역사', '과학', '디자인', '교육', '의예', '예체능', '오락', '기타'].map((category) => (
                                <button
                                    key={category}
                                    className={classNames(
                                        'hover:bg-positive-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
                                        formData.category === category ? 'bg-positive-500' : 'bg-negative-500'
                                    )}
                                    onClick={() => setFormData((prev) => ({...prev, category}))}
                                    type="button"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                    </div>
                    <div className="mb-4">
                        <p className="block text-gray-700 text-sm font-bold mb-2">
                            모집 마감일
                        </p>
                        <Datepicker
                            onSelectedDateChanged={(date) => handleDeadlineChange(date)}
                        />
                    </div>
                    <div className="mb-4">
                        <p className="block text-gray-700 text-sm font-bold mb-2">
                            세션 시작 시간
                        </p>
                        <Datepicker
                            onSelectedDateChanged={(date) => handleSessionStartChange(date)}
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
                        완료
                    </button>
                </form>
            </div>
        </>
    );
};
