import { useEffect, useState } from 'react';
import { List, Button } from 'flowbite-react';
import { Statement } from '../../types/Statement';
import { useLocalAxios } from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

// StatementView 컴포넌트: 자기소개서을 보여주고 관리하는 뷰입니다.
export const StatementView: React.FC = () => {
    const [statements, setStatements] = useState<Statement[]>([]); // 자기소개서 목록 상태 관리
    
    const localAxios = useLocalAxios(true);

    const navigate = useNavigate();

    useEffect(() => {
        getStatements(); // 컴포넌트 마운트 시 자기소개서 목록 불러오기
    }, []);

    
    const getStatements = () => {
        localAxios.get("statements")
        .then((res) => {
            setStatements(res.data.statements);
        })
        .catch((err) => {
            console.log(err);
            setStatements([
                {id: 1, title: 'title', company: 'company', created_at: new Date('2022-01-01T00:00:00Z'), updated_at: new Date('2022-01-01T00:00:00Z')},
                {id: 2, title: 'title', company: 'company', created_at: new Date('2022-01-01T00:00:00Z'), updated_at: new Date('2022-01-01T00:00:00Z')},
                {id: 3, title: 'title', company: 'company', created_at: new Date('2022-01-01T00:00:00Z'), updated_at: new Date('2022-01-01T00:00:00Z')},
            ]);
        })
    }

    //delete 메소드를 통해 특정 id인 자기소개서를 지운다.
    const deleteStatement = (index: number) => {
        if (confirm("정말로 삭제하시겠습니까?")){
            localAxios.delete(`statements/${index}`)
            .then((res) => {
                getStatements();
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    return(
        <>
            <div className="flex justify-end">
                <Button className='bg-primary-300' onClick={() => navigate('/statement/write')}>
                    추가
                </Button>
            </div>
            <List>
                {statements.map((statement) => (
                    <List.Item key={statement.id} className='mt-4 p-1 flex bg-primary-50 border-2 shadow-sm rounded-3xl'>
                        <div className='basis-1/2'>
                            <p className='m-2 text-lg tracking-tight text-gray-900 dark:text-white w-full'>{statement.title}</p>
                        </div>
                        <div className='basis-1/4'>
                            <p className='m-2 tracking-tight text-gray-900 dark:text-white w-full'>{statement.company}</p>
                        </div>

                        <div className='basis-1/4 flex flex-auto'>
                            <Button className='m-1 bg-primary-300 text-white font-thin' onClick={() => navigate('/statement/write/'+statement.id)}>수정</Button>
                            <Button className='m-1 bg-negative-300 text-white font-thin' onClick={() => {deleteStatement(statement.id)}}>삭제</Button>
                        </div>
                    </List.Item>
                ))}
            </List>
        </>
    );

};
