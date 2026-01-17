import { Metadata } from "next";
import ChuongTrinhDaoTaoPage from "@/components/pages/ChuongTrinhDaoTao";

export const metadata: Metadata = {
    title: "Chương trình đào tạo - Hệ thống quản lý sinh viên",
    description: "Xem chi tiết chương trình đào tạo của sinh viên.",
};

export default function ChuongTrinhDaoTao() {
    return (
        <>
        <div className="pb-8"></div>
        <div className="pb-8"></div>
        <div className="pb-8"></div>
        <div className="pb-2"></div>
            <ChuongTrinhDaoTaoPage />
        </>
    );
}