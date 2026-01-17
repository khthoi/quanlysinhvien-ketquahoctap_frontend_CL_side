import { Metadata } from "next";
import KetQuaHocTapPage from "@/components/pages/KetQuaHocTap";


export const metadata: Metadata = {
    title: "Kết quả học tập - Hệ thống quản lý sinh viên",
    description: "Xem kết quả học tập chi tiết của sinh viên.",
};

export default function KetQuaHocTap() {
    return (
        <>
        <div className="pb-8"></div>
        <div className="pb-8"></div>
        <div className="pb-8"></div>
        <div className="pb-3"></div>
            <KetQuaHocTapPage />
        </>
    );
}