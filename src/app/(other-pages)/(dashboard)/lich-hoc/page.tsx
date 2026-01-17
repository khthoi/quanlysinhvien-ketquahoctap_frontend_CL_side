import { Metadata } from "next";
import LopHocPhanPage from "@/components/pages/LopHocPhanSinhVien";

export const metadata: Metadata = {
    title: "Lịch học - Hệ thống quản lý sinh viên",
    description: "Xem lịch học của sinh viên.",
};

export default function LopHocPhan() {
    return (
        <>
        <div className="pt-5"></div>
        <div className="pt-5"></div>
        <div className="pt-5"></div>
        <div className="pt-5"></div>
        <div className="pt-5"></div>
        <div className="pt-3"></div>
        
        <LopHocPhanPage />
        </>
    );
}