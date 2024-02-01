import { useAuthStore } from "../stores/auth";
import Banner1Img from '../assets/images/human_face.png';
import Banner2Img from '../assets/images/human_robot_talk.png';
export const Banner1 = () => {
    return(
    <>
        <div className='border-2 rounded-xl'>
            <div className="flex flex-row">
                <div className='w-1/3'>
                    <img src={Banner1Img} alt='img'/>
                </div>
                <div className='w-2/3'>
                    <p className='text-4xl'>
                        Speechless: <br/>
                        AI 분석과 함께하는 면접, 발표 연습
                    </p>
                </div>
            </div>
		</div>
    </>
    )
}
export const Banner2 = () => {
    const authStore = useAuthStore();
    return(
    <>
        <div className='border-2 rounded-xl'>
            <div className="flex flex-row">
                <div className='w-1/3'>
                    <img src={Banner2Img} alt='img'/>
                </div>
                <div className='w-2/3'>
                    <p className='text-2xl'>
                        기업에 지원한 자기소개서를 기반으로<br/>
                        면접 연습을 할 수 있습니다. <br/>
                        자기소개서를 추가하고 <br/>
                        {authStore.name?authStore.name:'사용자'}님에게 맞는 면접 연습을 시작하세요!
                    </p>
                </div>
            </div>
	    </div>
    </>
    )
}