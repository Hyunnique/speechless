import { useEffect, useState } from 'react';
import { Button, Pagination } from 'flowbite-react';
import { Statement } from '../../types/Statement';
import { useLocalAxios } from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import {CustomButton} from "../../components/CustomButton.tsx";

// StatementView 컴포넌트: 자기소개서을 보여주고 관리하는 뷰입니다.
export const StatementView: React.FC = () => {
    const [statements, setStatements] = useState<Statement[]>([]); // 자기소개서 목록 상태 관리

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const onPageChange = (page: number) => setCurrentPage(page);
    const amountPerPage = 3;
    
    const localAxios = useLocalAxios(true);

    const navigate = useNavigate();

    useEffect(() => {
        getStatements();
    }, [currentPage]);

    
    const getStatements = () => {
        localAxios.get("statements", {params: {pageSize: amountPerPage, pageNum: currentPage}})
        .then((res) => {

            setCurrentPage(res.data.currentPage);
            setTotalPages(res.data.totalPage);

            setStatements(res.data.statements);
            console.log(res.data);
            console.log("current: "+ currentPage + "/// totalPage: " + res.data.totalPage);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    //delete 메소드를 통해 특정 id인 자기소개서를 지운다.
    const deleteStatement = (index: number) => {
        if (confirm("정말로 삭제하시겠습니까?")){
            localAxios.delete(`statements/${index}`)
            .then(() => {
                if(currentPage==totalPages && statements.length==1){
                    setCurrentPage(currentPage-1);
                }
                getStatements();
            })
            .catch(() => {
            })
        }
    }

    return(
        <ul className='mt-5 h-full flex flex-col gap-3 w-5/6 mx-auto'>
            {
                statements.length > 0 ?
                    statements.map((statement) => (
                        <li key={statement.id} className='px-8 py-4 flex border-b-2 hover:bg-gradient-to-l from-white to-gray-50 cursor-pointer' onClick={() => navigate('/statement/detail/'+statement.id)}>
                            <div className='flex-1 flex flex-col justify-center'>
                                <p className='text-lg font-semibold tracking-tight text-gray-900 dark:text-white w-full'>{statement.title}</p>
                                <p className='text-md tracking-tight text-gray-600 dark:text-white w-full'>{statement.company}</p>
                            </div>
                            <div className='flex flex-row items-end gap-2'>
                                <CustomButton color='blue' size='md' className='flex items-center gap-2' onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        navigate('/statement/write/' + statement.id);
                                    }
                                }>
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    <span>수정</span>
                                </CustomButton>
                                <CustomButton color='negative' size='md' className='flex items-center gap-2' onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        deleteStatement(statement.id);
                                    }
                                }>
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                    <span>삭제</span>
                                </CustomButton>
                            </div>
                        </li>
                    ))
                    :
                    <p className='h-full flex justify-center items-center'>자기소개서가 없습니다.</p>
            }
            {
                totalPages > 1 ?
                    <div className="flex overflow-x-auto sm:justify-center">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange}
                                    nextLabel='다음' previousLabel='이전'/>
                    </div>
                    :
                    <></>
            }
        </ul>
    );

};
