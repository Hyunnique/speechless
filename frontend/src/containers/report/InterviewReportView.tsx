import { useEffect, useState } from 'react';
import { List, Button } from 'flowbite-react';
import { InterviewReport } from '../../types/Report';
import { useLocalAxios } from '../../utils/axios';


export const InterviewReportView: React.FC = () => {
    const [reports, setReports] = useState<InterviewReport[]>([]);
    const localAxios = useLocalAxios(true);
    
    useEffect(() => {
        getReports();
    }, []);

    const getReports = () => {
        localAxios.get("interview-reports")
        .then((res) => {
            setReports(res.data.reports);
        })
        .catch((err) => {
            console.log(err);
            setReports([
                {id:0, userId:0, topic: "삼성 상반기 임원 면접 연습"},
                {id:1, userId:1, topic: "삼성 상반기 임원 면접 연습"},
                {id:2, userId:2, topic: "삼성 상반기 임원 면접 연습"},
            ])
        })
    }

    const deleteReport = (index: number) => {
        if (confirm("정말로 삭제하시겠습니까?")){
            localAxios.delete(`interview-reports/${index}`)
            .then((res) => {
                getReports();
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    return(
        <>
            <ul className='flex flex-col gap-3 w-5/6 mx-auto'>
                {reports.map((report) => (
                    <li key={report.id} className='mb-4 px-4 py-2 flex shadow-sm border-b-2' onClick={() => navigate('/statement/detail/'+statement.id)}>
                        <div className='basis-3/4 flex flex-col justify-center'>
                            <p className='text-lg font-semibold tracking-tight text-gray-900 dark:text-white w-full'>{report.topic}</p>
                        </div>
                        <div className='basis-1/4 flex flex-col items-end'>
                            <Button className='w-1/2 bg-primary-400'>다운로드</Button>
                            <Button className='w-1/2 bg-negative-400'>삭제</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );

};
