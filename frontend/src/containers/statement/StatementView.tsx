import { useEffect, useState } from 'react';
import { Button, Pagination } from 'flowbite-react';
import { Statement } from '../../types/Statement';
import { useLocalAxios } from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

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
        <>
            <div className="flex justify-end">
                <Button color='blue' onClick={() => navigate('/statement/write')}>
                    추가
                </Button>
            </div>

            <ul className='flex flex-col gap-3 w-5/6 mx-auto'>
                {statements.map((statement) => (
                    <li key={statement.id} className='mb-4 px-4 py-2 flex shadow-sm border-b-2' onClick={() => navigate('/statement/detail/'+statement.id)}>
                        <div className='basis-3/4 flex flex-col justify-center'>
                            <p className='text-lg font-semibold tracking-tight text-gray-900 dark:text-white w-full'>{statement.title}</p>
                            <p className='text-md tracking-tight text-gray-600 dark:text-white w-full'>{statement.company}</p>
                        </div>
                        <div className='basis-1/4 flex flex-col items-end'>
                            <Button className='w-1/2 bg-primary-400' onClick={(e) => {e.stopPropagation(); navigate('/statement/write/'+statement.id)}}>수정</Button>
                            <Button className='w-1/2 bg-negative-400' onClick={(e) => {e.stopPropagation(); deleteStatement(statement.id)}}>삭제</Button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="flex overflow-x-auto sm:justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} nextLabel='다음' previousLabel='이전' />
    </div>
        </>
    );

};
