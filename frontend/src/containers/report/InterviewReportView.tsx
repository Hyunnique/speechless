import { useEffect, useState } from 'react';
import { List, Button } from 'flowbite-react';
import { InterviewReport } from '../../types/Report';
import { useLocalAxios } from '../../utils/axios';
import { useNavigate } from 'react-router-dom';


export const InterviewReportView: React.FC = () => {
    const [reports, setReports] = useState<InterviewReport[]>([]);
    const localAxios = useLocalAxios(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        getReports();
    }, []);

    const getReports = () => {
        // localAxios.get("interview-reports")
        // .then((res) => {
        //     setReports(res.data.reports);
        // })
        // .catch((err) => {
        //     console.log(err);
        // })
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
            <ul className='mt-5 h-full flex flex-col gap-3 w-11/12 mx-auto'>
                {
                    reports.length > 0 ?
                    reports.map((report) => (
                        <li key={report.id} className='mb-4 px-4 py-2 flex shadow-sm border-b-2' >
                            <div className='basis-3/4 flex flex-col justify-center'>
                                <p className='text-lg font-semibold tracking-tight text-gray-900 dark:text-white w-full'>{report.topic}</p>
                            </div>
                            <div className='basis-1/4 flex flex-col items-end'>
                                <Button className='w-1/2 bg-primary-400'>다운로드</Button>
                                <Button className='w-1/2 bg-negative-400' onClick={() => deleteReport(report.id)}>삭제</Button>
                            </div>
                        </li>
                    ))
                    :
                    <p className='h-full flex justify-center items-center'>현재 저장된 면접 리포트가 없습니다.</p>
                }
                {/*{reports.map((report) => (*/}
                {/*    <li key={report.id} className='mb-4 px-4 py-2 flex shadow-sm border-b-2' >*/}
                {/*        <div className='basis-3/4 flex flex-col justify-center'>*/}
                {/*            <p className='text-lg font-semibold tracking-tight text-gray-900 dark:text-white w-full'>{report.topic}</p>*/}
                {/*        </div>*/}
                {/*        <div className='basis-1/4 flex flex-col items-end'>*/}
                {/*            <Button className='w-1/2 bg-primary-400'>다운로드</Button>*/}
                {/*            <Button className='w-1/2 bg-negative-400'>삭제</Button>*/}
                {/*        </div>*/}
                {/*    </li>*/}
                {/*))}*/}
            </ul>
        </>
    );

};
