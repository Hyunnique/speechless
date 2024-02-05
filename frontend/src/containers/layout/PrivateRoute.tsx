import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth";

// 로그인 유저만 접근 가능
// 비로그인 유저 접근 불가
export const PrivateRoute = () => {
  const authStore = useAuthStore();

  if (!authStore.accessToken) {
    alert("로그인이 필요한 기능입니다.");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};