import DangKyHocPage from "@/components/pages/DangKyHoc";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng ký học",
    description: "Đăng ký học",
};

export default function DangKyHoc() {
    return <DangKyHocPage />;
}