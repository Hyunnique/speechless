import React, { useEffect, useState } from 'react';
import {type CommunityResponse, CommunityView} from "../../types/Community.ts";
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalAxios } from '../../utils/axios';


export const SpeechDetailPage = () => {
  const [speechDetail, setSpeechDetail] = useState<CommunityView | null>(null);
  const { id } = useParams();
  const localAxiosWithAuth = useLocalAxios();
  const navigate = useNavigate();

  const updateSpeech = async () => {
    navigate(`/speech/write/${id}`);
  };

  //형 변환 할 것들(date...)
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await localAxiosWithAuth.get(`/community/${id}`);
          const communityData: CommunityView = {
              ...res.data,
              sessionStart: new Date(res.data.sessionStart),
              deadline: new Date(res.data.deadline),
              createdAt: new Date(res.data.createdAt)
          };
          setSpeechDetail(communityData);
        } catch (error) {
          console.error('Error :', error);
        }
      }
    };

    fetchData();
  }, []);

  const deleteSpeech = async () => {
    const confirmDelete = window.confirm('정말로 글을 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await localAxiosWithAuth.delete(`/community/${id}`);
        alert('글 삭제 완료');
        navigate('/speech');
      } catch (error) {
        console.error('err :', error);
        alert('실패');
      }
    }
  };

  const joinGroup = async () => {
    try {
      const res = await localAxiosWithAuth.get('/');
    }catch (err){
      console.log("err ", err)
    }finally {
      console.log("fin")
    }
  };

  const moveSpeech = async  () => {
    try {
      const res = await localAxiosWithAuth.get('/');
    }catch (err){
      console.log("err ", err)
    }finally {
      console.log("fin")
    }
  }

  if (!speechDetail) {
    return <div>Loading...</div>;
  }

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
                    <p className='text-sm md:text-base text-gray-600'>작성일: {speechDetail.createdAt.toLocaleString()}</p>
                    <p className='text-sm md:text-base text-gray-600'>조회수: {speechDetail.hit}</p>
                  </div>
                  <button className='bg-primary-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded' onClick={joinGroup}>
                    그룹 참여
                  </button>
                  <button className='bg-primary-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={moveSpeech}>
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
                </div>
              </div>

              <div className='py-4 px-5 lg:px-8 border-t border-gray-200'>
                <div className='mb-4'>
                  <h2 className='font-bold text-xl mb-2'>그룹 소개</h2>
                  <p className='text-gray-700'>{speechDetail.content}</p>
                </div>
                <div className="">
                  <button onClick={updateSpeech}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                  >
                    글 수정
                  </button>
                  <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={deleteSpeech}
                  >
                    글 삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};