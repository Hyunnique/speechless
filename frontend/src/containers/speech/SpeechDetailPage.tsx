import React, { useEffect, useState } from 'react';
import {CommunityView} from "../../types/Community.ts";
import { useParams } from 'react-router-dom';
import { useLocalAxios } from '../../utils/axios';

const dummyDetailData: CommunityView[] = [
  {
    id: 1,
    writer: '김민수',
    category: 'IT',
    title: 'IT 자유주제 5분 스피치',
    content: '스피치 세션에 대한 세부 정보~',
    currentParticipants: 4,
    maxParticipants: 8,
    deadline: new Date('2024-01-31'),
    sessionStart: new Date('2024-01-31'),
    invisible: false,
    private: false,
    createdAt: new Date('2024-01-01'),
},
  {
    id: 2,
    writer: '김민수',
    category: 'IT',
    title: 'IT 자유주제 5분 스피치',
    content: '스피치 세션에 대한 세부 정보~',
    currentParticipants: 4,
    maxParticipants: 8,
    deadline: new Date('2024-01-31'),
    sessionStart: new Date('2024-01-31'),
    invisible: false,
    private: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 3,
    writer: '김민수',
    category: 'IT',
    title: 'IT 자유주제 5분 스피치',
    content: '스피치 세션에 대한 세부 정보~',
    currentParticipants: 4,
    maxParticipants: 8,
    deadline: new Date('2024-01-31'),
    sessionStart: new Date('2024-01-31'),
    invisible: false,
    private: false,
    createdAt: new Date('2024-01-01'),
  }
]


export const SpeechDetailPage = () => {
  const [speechDetail, setSpeechDetail] = useState<CommunityView | null>(null);
  const { id } = useParams();
  const localAxiosWithAuth = useLocalAxios();

  useEffect(() => {
    if (id) {
      localAxiosWithAuth.get(`/community/speechDetail/${id}`)
          .then(res => {
            setSpeechDetail(res.data);
          })
          .catch((err) => {
            // 백엔드 연결이 실패 시 더미 사용
            const detailData = dummyDetailData.find(item => item.id === parseInt(id));
            if (detailData) {
              setSpeechDetail(detailData);
            } else {
              console.error("Error: 데이터 없음");
            }
          });
    }
  }, []);

  if (!speechDetail) {
    return <div>Loading...</div>;
  }

  return (
      <div className='bg-primary-50 font-sans leading-normal tracking-normal'>
        <div className='container max-w-4xl px-4 md:px-0 mx-auto pt-6 pb-8'>
          <div className='bg-white rounded shadow'>
            <div className='py-4 px-5 lg:px-8 text-black border-b border-gray-200'>
              <h1 className='font-bold text-2xl mb-2'>{speechDetail.title}</h1>
              <div className='flex justify-between items-center'>
                <div className='flex gap-4 md:gap-10'>
                  <p className='text-sm md:text-base text-gray-600'>작성자: {speechDetail.writer}</p>
                  <p className='text-sm md:text-base text-gray-600'>작성일: {speechDetail.createdAt.toLocaleString()}</p>
                  <p className='text-sm md:text-base text-gray-600'>조회수: 5</p>
                </div>
                <button className='bg-primary-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                  발표 세션 이동
                </button>
              </div>
            </div>

            <div className='flex flex-wrap -mx-3 mb-6 p-5 lg:px-8'>
              <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                <div className='mb-2'>
                  <strong>신청 현황:</strong> {speechDetail.currentParticipants}/{speechDetail.maxParticipants}
                </div>
                <div className='mb-2'>
                  <strong>세션 일자:</strong> {speechDetail.sessionStart.toLocaleString()}
                </div>
                <div>
                  <strong>마감 일자:</strong> {speechDetail.deadline.toLocaleString()}
                </div>
              </div>
              <div className='w-full md:w-1/2 px-3'>
                <div className='mb-2'>
                  <strong>발표 주제: </strong>{speechDetail.category}
                </div>
                <div>
                  <strong>승인 여부: </strong>{speechDetail.private ? '비공개' : '공개'}
                </div>
              </div>
            </div>

            <div className='py-4 px-5 lg:px-8 border-t border-gray-200'>
              <div className='mb-4'>
                <h2 className='font-bold text-xl mb-2'>그룹 소개</h2>
                <p className='text-gray-700'>{speechDetail.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};