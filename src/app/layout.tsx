// src/app/layout.tsx
import type { Metadata } from "next";
import './globals.css';

export const metadata: Metadata = {
  title: "Trang chủ trường ĐH Thủ Đô Hà Nội",
  description: "Hệ thống quản lý sinh viên - Kết quả học tập",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        {children}
      </body>
    </html>
  );
}
