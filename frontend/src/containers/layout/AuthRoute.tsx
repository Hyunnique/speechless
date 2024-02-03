import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth";

// 로그인한 유저는 접근 불가능
export const AuthRoute = () => {
  const authStore = useAuthStore();

  if (authStore.accessToken) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};