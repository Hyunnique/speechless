import { useNavigate, useParams } from "react-router-dom";
import { CustomButton } from "./components/CustomButton";


export default function ErrorPage() {
    const { id } = useParams();
    const navigate = useNavigate();

	return (
		<>
			<p>에러가 발생했습니다.</p>
            <p>에러 코드 { id }</p>

            <CustomButton color="blue" onClick={()=>navigate("/")}> 메인으로 돌아가기 </CustomButton>
		</>
	);
}
