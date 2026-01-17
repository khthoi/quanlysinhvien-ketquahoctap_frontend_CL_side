import { Metadata } from "next";
import DashboardPage from "@/components/pages/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard - Hệ thống quản lý sinh viên",
  description: "Xem tổng quan kết quả học tập và thông tin sinh viên.",
};

export default function Dashboard() {
  return <DashboardPage />;
}