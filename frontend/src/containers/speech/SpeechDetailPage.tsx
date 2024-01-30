import React, { useEffect, useState } from 'react';

// 더미 데이터 예시
const detailData = {
  id: 1,
  writer: '김민수',
  category: 'IT',
  title: 'IT 자유주제 5분 스피치',
  content: '스피치 세션에 대한 세부 정보~',
  currentParticipants: 4,
  maxParticipants: 8,
  deadline: '2024-01-31',
  sessionStart: '2024-01-31',
  invisible: false,
  private: false,
  createdAt: '2024-01-01',
  views: 1001
};

export const SpeechDetailPage = () => {
	// || null?
  const [speechDetail, setSpeechDetail] = useState({});

  useEffect(() => {
    setSpeechDetail(detailData);
  }, []);

  return (
    <>
      <div className='bg-primary-50 font-sans leading-normal tracking-normal'>
        <div className='container max-w-4xl px-4 md:px-0 mx-auto pt-6 pb-8'>
          <div className='bg-white rounded shadow'>
            <div className='py-4 px-5 lg:px-8 text-black border-b border-gray-200'>
              <h1 className='font-bold text-2xl mb-2'>{speechDetail.title}</h1>
              <div className='flex justify-between items-center'>
                <div className='flex gap-4 md:gap-10'>
                  <p className='text-sm md:text-base text-gray-600'>작성자: {speechDetail.writer}</p>
                  <p className='text-sm md:text-base text-gray-600'>작성일: {speechDetail.createdAt}</p>
                  <p className='text-sm md:text-base text-gray-600'>조회수: {speechDetail.views}</p>
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
                  <strong>세션 일자:</strong> {speechDetail.sessionStart}
                </div>
                <div>
                  <strong>마감 일자:</strong> {speechDetail.deadline}
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
				<br />
              </div>
              {/* 여기에 추가적인 세션 내용이 들어갈 수 있습니다 */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
