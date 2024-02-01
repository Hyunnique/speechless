import React, { useEffect, useState, useRef } from 'react';
import { SpeechSearch } from '../../components/SpeechSearch';
import { RecruitCard } from '../../components/RecruitCard';
import { CommunityView } from '../../types/Community.ts';
import { useLocalAxios } from '../../utils/axios.ts';
import {Link} from "react-router-dom";

const awaitingSpeechSessions: CommunityView[] = [
      //향후, Custom hook으로 변환 useEffect 정리, 스크롤 바가 밀리는 현상 해결해야함(SpeechSearch 컴포넌트 플로팅이 이유로 추정)=>일단 해결..
    {
        id: 1,
        writer: '김민수',
        category: 'IT',
        title: 'IT 자유주제 5분 스피치',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 4,
        maxParticipants: 8,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: false,
        createdAt: new Date()
    },
    {
        id: 2,
        writer: '김민수',
        category: '자기소개',
        title: '자소서 기반 자기소개 피드백',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 3,
        maxParticipants: 4,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: false,
        createdAt: new Date()
    },
    {
        id: 3,
        writer: '김민수',
        category: '자유',
        title: '싸피 PT 면접 준비하실분!!',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 6,
        maxParticipants: 6,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: true,
        createdAt: new Date()
    },
    {
        id: 4,
        writer: '김민수',
        category: '게임',
        title: '본인이 하는 게임 소개하기',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 2,
        maxParticipants: 4,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: false,
        createdAt: new Date()
    },
    {
        id: 5,
        writer: '김민수',
        category: '게임',
        title: '본인이 하는 게임 소개하기',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 2,
        maxParticipants: 4,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: false,
        createdAt: new Date()
    },
    {
        id: 6,
        writer: '김민수',
        category: '게임',
        title: '본인이 하는 게임 소개하기',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 2,
        maxParticipants: 4,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: false,
        createdAt: new Date()
    },
    {
        id: 7,
        writer: '김민수',
        category: 'IT',
        title: 'IT 자유주제 5분 스피치',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 4,
        maxParticipants: 8,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: false,
        createdAt: new Date()
    },
    {
        id: 8,
        writer: '김민수',
        category: 'IT',
        title: 'IT 자유주제 5분 스피치',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 4,
        maxParticipants: 8,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: false,
        createdAt: new Date()
    },
    {
        id: 9,
        writer: '김민수',
        category: 'IT',
        title: 'IT 자유주제 5분 스피치',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 4,
        maxParticipants: 8,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: false,
        createdAt: new Date()
    },
    {
        id: 10,
        writer: '김민수',
        category: 'IT',
        title: 'IT 자유주제 5분 스피치',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 4,
        maxParticipants: 8,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: false,
        createdAt: new Date()
    },
    {
        id: 11,
        writer: '김민수',
        category: 'IT',
        title: 'IT 자유주제 5분 스피치',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 4,
        maxParticipants: 8,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: false,
        createdAt: new Date()
    },
    {
        id: 12,
        writer: '김민수',
        category: 'IT',
        title: 'IT 자유주제 5분 스피치',
        content: '안녕하세요. 싸피 6기 김민수입니다. 이번에 IT 자유주제 5분 스피치를 진행하려고 합니다. 자유주제라서 뭐든지 다 가능합니다. 자유롭게 말씀해주세요.',
        currentParticipants: 4,
        maxParticipants: 8,
        deadline: new Date(),
        sessionStart: new Date(),
        invisible: false,
        private: false,
        createdAt: new Date()
    }
];
export const SpeechListPage = () => {
    const [speechSessions, setSpeechSessions] = useState<CommunityView[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const loadingRef = useRef(null);
    const localAxios = useLocalAxios();

    // 데이터 로딩을 위한 useEffect
    useEffect(() => {
        localAxios.get('/community/speechlist')
            .then((res) => {
                setSpeechSessions(res.data);
            })
            .catch((err) => {
                console.log("err");
                setSpeechSessions(awaitingSpeechSessions.slice(0, 9));
            });
    }, []);

    // 무한 스크롤 기능 구현을 위한 useEffect, Intersection Observer api로 구현
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const firstEntry = entries[0];
            if (firstEntry.isIntersecting) {
                loadMoreSpeechSessions();
            }
        }, { threshold: 0.5 });

        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }

        return () => {
            if (loadingRef.current) {
                observer.unobserve(loadingRef.current);
            }
        };
    }, []);

    // 백엔드 로직 구현 이후 반환값 고려하여 수정 필요
    const loadMoreSpeechSessions = () => {
        const nextPage = pageIndex + 1;
        const nextSpeechSessions = awaitingSpeechSessions.slice(nextPage * 3, (nextPage + 1) * 3);
        if (nextSpeechSessions.length > 0) {
            setSpeechSessions(prev => [...prev, ...nextSpeechSessions]);
            setPageIndex(nextPage);
        }
    };

    return (
        <>
            <div className="flex">
                <div>
                    <div className="sticky top-0 z-10">
                        <SpeechSearch></SpeechSearch>
                    </div>
                </div>
                <div className="ml-4 grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
                    {speechSessions.map((session) => (
                        <Link to={`/speech/${session.id}`} key={session.id}>
                            <RecruitCard session={session}/>
                        </Link>
                    ))}
                    <div ref={loadingRef}>Loading...</div>
                </div>
            </div>
        </>
    );
};

