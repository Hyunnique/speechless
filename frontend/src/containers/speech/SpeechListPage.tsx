import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SpeechSearch } from '../../components/SpeechSearch';
import { RecruitCard } from '../../components/RecruitCard';
import { CommunityResponse, CommunityView } from '../../types/Community';
import { useLocalAxios } from '../../utils/axios';
import { Link } from "react-router-dom";
import { SearchCriteria } from "../../types/SearchCriteria";

export const SpeechListPage: React.FC = () => {
    const [speechSessions, setSpeechSessions] = useState<CommunityView[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({});
    const localAxios = useLocalAxios();

    //의존성 배열에 등록된 변수 바뀔 때만 렌더링 되도록 useCallback 사용
    const fetchSpeechSessions = useCallback(async () => {
        if (loading) return;
        setLoading(true);

        const params: Record<string, string | number | boolean | null> = {
            cursor: nextCursor ,
            limit: 4,
            ...searchCriteria,
        };
        console.log(params);

        try {
            const res = await localAxios.get('/community', { params });

            //중복 키 검사
            const newFetchedData = res.data.getCommunityResponses.filter(
                (newItem:CommunityView) => !speechSessions.some(existingItem => existingItem.id === newItem.id)
            );

            const newData = newFetchedData.map((item:CommunityResponse) => ({
                ...item,
                sessionStart: new Date(item.sessionStart),
                deadline: new Date(item.deadline),
                createdAt: new Date(item.createdAt),
            }));
            setSpeechSessions(prev => [...prev, ...newData]);
            setHasMore(newData.length > 0 && res.data.nextCursor !== undefined);
            setNextCursor(res.data.nextCursor ?? null);
        } catch (error) {
            console.error('Fetching sessions failed:', error);
        } finally {
            setLoading(false);
        }
    }, [loading, nextCursor, searchCriteria]);

    const lastElementRef = useCallback((node: Element | null) => {
        if (loading || !hasMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchSpeechSessions();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchSpeechSessions]);

    // //의존성 배열에 등록된 변수 바뀔 때만 렌더링 되도록 useCallback 사용
    // const fetchSpeechSessions = useCallback(async () => {
    //     if (loading) return;
    //     setLoading(true);
    //
    //     const params: Record<string, string | number | boolean | null> = {
    //         cursor: nextCursor,
    //         limit: 4,
    //         ...searchCriteria,
    //     };
    //
    //     try {
    //         const [res, res2] = await Promise.all([
    //             localAxios.get('/community', { params }),
    //             localAxios.get('/reserved')
    //         ]);
    //
    //         // 중복 키 검사
    //         const newFetchedData = res.data.getCommunityResponses.filter(
    //             (newItem: CommunityView) => !speechSessions.some(existingItem => existingItem.id === newItem.id)
    //         );
    //
    //         const newData = newFetchedData.map((item: CommunityResponse) => ({
    //             ...item,
    //             sessionStart: new Date(item.sessionStart),
    //             deadline: new Date(item.deadline),
    //             createdAt: new Date(item.createdAt),
    //             currentParticipants: res2.data.currentParticipants
    //         }));
    //
    //         setSpeechSessions(prev => [...prev, ...newData]);
    //         setHasMore(newData.length > 0 && res.data.nextCursor !== undefined);
    //         setNextCursor(res.data.nextCursor ?? null);
    //     } catch (error) {
    //         console.error('err:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [loading, nextCursor, searchCriteria]);


    //Promise 수정 필요?
    useEffect(() => {
        fetchSpeechSessions();
    }, [searchCriteria]);

    //클린업
    useEffect(() => {
        return () => observer.current?.disconnect();
    }, []);

    return (
        <>
            <div className="flex">
                <div className="sticky top-0 z-10">
                    <SpeechSearch onSearch={(newCriteria: SearchCriteria) => {
                        setSearchCriteria(newCriteria);
                        setSpeechSessions([]);
                        setNextCursor(null);
                    }} />
                </div>
                <div className="ml-4 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
                    {speechSessions.map((session, index) => (
                        <div key={session.id} ref={index === speechSessions.length - 1 ? lastElementRef : null}>
                            <Link to={`/speech/${session.id}`}>
                                <RecruitCard session={session} />
                            </Link>
                        </div>
                    ))}
                    {loading && <p>Loading...</p>}
                </div>
            </div>
        </>
    );
};
