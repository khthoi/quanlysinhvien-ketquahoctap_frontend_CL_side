import { Metadata } from "next";
import LoginPage from "@/components/auth/LoginPage";

export const metadata: Metadata = {
  title: "Trang đăng nhập - Hệ thống quản lý sinh viên ĐH Thủ Đô Hà Nội",
  description: "Trang đăng nhập của hệ thống quản lý sinh viên Đại học Thủ Đô Hà Nội",
};

export default function Login() {
  return <LoginPage />;
}