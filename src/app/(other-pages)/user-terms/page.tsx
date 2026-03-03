import { Metadata } from "next";
import UserTerms from "@/components/pages/UserTerms";

export const metadata: Metadata = {
  title: "Chính sách bảo mật & Điều khoản sử dụng - Đại học Thủ Đô Hà Nội",
  description:
    "Trang tổng hợp Điều khoản sử dụng và Chính sách bảo mật dành cho người dùng Cổng thông tin Sinh viên Đại học Thủ Đô Hà Nội.",
};

export default function UserTermsPage() {
  return <UserTerms />;
}

