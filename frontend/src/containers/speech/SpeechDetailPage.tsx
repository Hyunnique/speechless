import React, { useEffect, useState } from 'react';
import { type CommunityResponse, CommunityView } from '../../types/Community.ts';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLocalAxios } from '../../utils/axios';
import {Breadcrumb, BreadcrumbItem, Card} from 'flowbite-react';
import {useAuthStore} from "../../stores/auth.ts";
import { AxiosError } from 'axios';
import { useSpeechSessionStore } from '../../stores/session.ts';
import {CustomButton} from "../../components/CustomButton.tsx";

import moment from 'moment';
import {Viewer} from "@toast-ui/react-editor";

export const SpeechDetailPage = () => {
	const [speechDetail, setSpeechDetail] = useState<CommunityView | null>(null);
    const [isParticipated, setIsParticipated] = useState(false);
    const [viewerKey, setViewerKey] = useState(0);
	const { id } = useParams();
	const localAxiosWithAuth = useLocalAxios();
	const navigate = useNavigate();

  const { name: userName } = useAuthStore(state => ({
    name: state.name,
  }));

  const updateSpeech = async () => {
    navigate(`/speech/write/${id}`);
  };
  const isOwner = userName === speechDetail?.writer;

  const speechSessionStore = useSpeechSessionStore();

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
          setIsParticipated(communityData.isParticipated ?? false);
        } catch (error) {
          console.error('Error :', error);
          navigate('/error', {
            replace: true,
            state: {
                code: 404,
                message: '존재하지 않는 글입니다.',
            },
         });
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
      const res = await localAxiosWithAuth.post(`/participant/${id}`);
      alert('그룹 참여 완료');
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.status === 400) {
        alert('이미 가입한 그룹입니다');
      } else {
        console.error("Error: ", err.message);
      }
    } finally {
      console.log("Fin");
    }
  };

  const moveSpeech = async  () => {
    const response = await localAxiosWithAuth.post('openvidu/announcement', {
			topic: speechDetail?.title,
      communityId: speechDetail?.id
		});

		if (speechSessionStore.sessionId) {
			try {
				await localAxiosWithAuth.delete(`openvidu/sessions/${speechSessionStore.sessionId}`);
			} catch (e) {
				console.log("session deletion failed");
			}

			speechSessionStore.clearSession();
		}

		speechSessionStore.setSessionId(response.data);

		navigate('/session/speech');
  }

  const deleteGroup = async  () => {
    try {
      const res = await localAxiosWithAuth.delete(`/participant/${id}`);
    }catch(err){
      console.log("err ", err);
    }finally {
      console.log("fin");
    }
  }

  if (!speechDetail) {
    return <div>...</div>;
  }

  const getDiffMinDate = (minute: number) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minute);
    return date;
}

  return (
      <>
          <div className='content-header mb-10'>
              <Breadcrumb className='pb-8'>
                  <BreadcrumbItem>
                      <Link to='/'>홈</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                      <Link to='/speech'>함께 발표하기</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                      발표 그룹 모집
                  </BreadcrumbItem>
              </Breadcrumb>
              <div className='flex justify-between items-center'>
                  <h1 className='text-3xl font-semibold leading-tight text-gray-700'>발표 그룹 모집</h1>
                  <div className='flex gap-3'>
                      <CustomButton
                          bordered
                          color='blue'
                          onClick={() => {
                              navigate('/speech');
                          }}
                      >
                          <div className='flex items-center gap-2'>
                              <span className='material-symbols-outlined text-sm'>arrow_back</span>
                              <span>목록으로 이동</span>
                          </div>
                      </CustomButton>
                  </div>
              </div>
          </div>

          <Card className='2xl:w-3/4 xl:w-4/5 w-full mx-auto p-10'>
              <div className='flex flex-col space-y-10'>
                  <div className='flex justify-between items-center gap-10'>
                      <div className='flex-1'>
                          <p className='text-2xl font-semibold'>{speechDetail.title}</p>
                      </div>
                      <div className='flex items-center gap-3'>
                          {
                              isParticipated
                              ?
                                  <CustomButton
                                      color='blue'
                                      bordered
                                      onClick={moveSpeech}
                                      disabled={getDiffMinDate(10) < new Date(speechDetail.sessionStart)}
                                  >
                                      <div className='flex items-center gap-2'>
                                          <span className='material-symbols-outlined'>arrow_forward</span>
                                          <span>발표 세션 이동</span>
                                      </div>
                                  </CustomButton>
                              :
                                  <CustomButton
                                      color='positive'
                                      bordered
                                      onClick={joinGroup}
                                  >
                                      <div className='flex items-center gap-2'>
                                          <span className='material-symbols-outlined'>check</span>
                                          <span>그룹 참여</span>
                                      </div>
                                  </CustomButton>
                          }
                      </div>
                  </div>
                  <div className='flex items-center gap-8'>
                      <span className='flex items-center gap-3'>
                          <span className='text-2xl text-yellow-400'>
                              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path
                                  fill="currentColor"
                                  d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14z"/></svg>
                          </span>
                          <span className='font-semibold'>{speechDetail.writer}</span>
                      </span>
                      <span className='flex items-center gap-3'>
                          <span className='material-symbols-outlined'>person</span>
                          <span className='font-semibold'>{speechDetail.currentParticipants ? speechDetail.currentParticipants : 0} / {speechDetail.maxParticipants}</span>
                      </span>
                      <span className='flex items-center gap-3'>
                          <span className='material-symbols-outlined'>visibility</span>
                          <span className='font-semibold'>{speechDetail.hit}</span>
                      </span>
                  </div>
                  <div>
                      <div className='flex gap-2'>
                          <span className='font-semibold pr-2 border-r-2 border-gray-400'>발표 주제</span>
                          <span>{speechDetail.category}</span>
                      </div>
                      <div className='flex gap-2'>
                          <span className='font-semibold pr-2 border-r-2 border-gray-400'>발표 세션 시작일</span>
                          <span>{moment(speechDetail.sessionStart).format('YYYY년 MM월 DD일 HH시 mm분')}</span>
                      </div>
                      <div className='flex gap-2'>
                          <span className='font-semibold pr-2 border-r-2 border-gray-400'>모집 기간</span>
                          <span className='flex gap-2'>
                              <span>{moment(speechDetail.createdAt).format('YYYY년 MM월 DD일 HH시 mm분')}</span>
                              <span>~</span>
                              <span>{moment(speechDetail.deadline).format('YYYY년 MM월 DD일 HH시 mm분')}</span>
                          </span>
                      </div>
                  </div>
                  <div className='pt-5'>
                      <Viewer key={viewerKey} initialValue={speechDetail.content} />
                  </div>
                  <div className='flex justify-end gap-5 pt-10'>
                      {
                          speechDetail.isParticipated
                          ? <CustomButton
                                  bordered
                                  color='negative'
                                  onClick={deleteGroup}
                              >
                                  <div className='flex items-center gap-2'>
                                      <span className='material-symbols-outlined text-sm'>logout</span>
                                      <span>그룹 나가기</span>
                                  </div>
                              </CustomButton>
                          : <></>
                      }
                      {
                          isOwner ?
                              <>
                                  <CustomButton
                                      bordered
                                      color='white'
                                      onClick={updateSpeech}
                                  >
                                      <div className='flex items-center gap-2'>
                                          <span className='material-symbols-outlined text-sm'>edit</span>
                                          <span>모집 글 수정</span>
                                      </div>
                                  </CustomButton>
                                  <CustomButton
                                      bordered
                                      color='negative'
                                      onClick={deleteSpeech}
                                  >
                                      <div className='flex items-center gap-2'>
                                          <span className='material-symbols-outlined text-sm'>delete</span>
                                          <span>모집 글 삭제</span>
                                      </div>
                                  </CustomButton>
                              </>
                              :
                              <></>
                      }
                  </div>
              </div>
          </Card>
      </>
  );
};
