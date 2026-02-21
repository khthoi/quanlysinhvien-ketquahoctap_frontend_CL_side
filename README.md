# Hệ thống Quản lý Sinh viên - Kết quả Học tập (Frontend Client-Side)

<p align="center">
    <a href="https://nextjs.org/" target="_blank">
    <img src="https://uploads.teachablecdn.com/attachments/oQIuEdJiQTduJC3OIzKy_nextjs-complete-guide-thumb.jpg" width="200" alt="Next.js Logo" />
  </a>
</p>

<p align="center">
  Frontend Client-Side cho sinh viên - Hệ thống quản lý sinh viên và kết quả học tập
</p>

<p align="center">
  <a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next.js-16.x-black" alt="Next.js Version" /></a>
  <a href="https://react.dev/" target="_blank"><img src="https://img.shields.io/badge/React-19-blue" alt="React Version" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript Version" /></a>
</p>

---

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Các tính năng chính](#các-tính-năng-chính)
- [Các trang chức năng](#các-trang-chức-năng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)

---

## 🎯 Giới thiệu

Frontend Client-Side của hệ thống Quản lý Sinh viên - Kết quả Học tập được xây dựng bằng **Next.js 16** và **React 19**, cung cấp giao diện thân thiện và dễ sử dụng cho sinh viên để:

- Xem thông tin cá nhân và kết quả học tập
- Đăng ký học phần
- Xem lịch học
- Tra cứu chương trình đào tạo
- Xem bảng điểm và thống kê học tập

Ứng dụng được thiết kế với giao diện hiện đại, responsive, hỗ trợ dark mode, và tối ưu hóa cho trải nghiệm người dùng tốt nhất.

---

## 🛠 Công nghệ sử dụng

- **Framework**: Next.js 16.x
- **UI Library**: React 19
- **Ngôn ngữ**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Icons**: React Icons, Font Awesome
- **State Management**: React Context API
- **HTTP Client**: Fetch API

---

## 🏗 Các tính năng chính

### 1. **Trang chủ (Landing Page)**
- Hero section với thông tin giới thiệu
- Achievement section - Thành tựu của trường
- Feature section - Các tính năng nổi bật
- About section - Giới thiệu về trường
- Testimonial section - Phản hồi từ sinh viên
- CTA section - Call to action
- Contact section - Thông tin liên hệ

### 2. **Xác thực người dùng**
- Đăng nhập với mã sinh viên và mật khẩu
- Quản lý phiên đăng nhập
- Bảo mật với JWT token

### 3. **Dashboard Sinh viên**
- Tổng quan thông tin cá nhân
- Thống kê học tập
- Thông báo và cập nhật mới nhất
- Quick access đến các chức năng chính

### 4. **Đăng ký Học phần**
- Xem danh sách lớp học phần có sẵn
- Đăng ký học phần mới
- Hủy đăng ký học phần
- Xem lịch học đã đăng ký
- Lọc và tìm kiếm lớp học phần
- Xem thông tin chi tiết lớp học phần (giảng viên, thời gian, địa điểm)

### 5. **Kết quả Học tập**
- Xem bảng điểm chi tiết
- Thống kê điểm trung bình (GPA)
- Xem điểm theo từng học kỳ
- Xem điểm theo từng môn học
- Thống kê số tín chỉ đã tích lũy
- Xem tiến độ học tập

### 6. **Chương trình Đào tạo**
- Xem chương trình đào tạo của ngành
- Xem danh sách môn học trong chương trình
- Xem thông tin chi tiết từng môn học
- Xem số tín chỉ và học phần

### 7. **Lịch Học**
- Xem lịch học theo tuần/tháng
- Xem thời khóa biểu
- Xem lịch thi
- Lọc theo học kỳ

### 8. **Thông tin Cá nhân**
- Xem và cập nhật thông tin cá nhân
- Xem thông tin tài khoản
- Đổi mật khẩu

### 9. **Giao diện & Trải nghiệm**
- Dark mode / Light mode
- Responsive design (mobile, tablet, desktop)
- Sidebar có thể thu gọn
- UI components tái sử dụng
- Form validation
- Loading states
- Error handling

---

## 📄 Các trang chức năng

### 🏠 Trang chủ
- **Landing Page** (`/`) - Trang chủ với các sections giới thiệu

### 🔐 Xác thực
- **Đăng nhập** (`/login`) - Trang đăng nhập cho sinh viên

### 📊 Dashboard
- **Dashboard** (`/dashboard`) - Trang tổng quan cho sinh viên
  - Thống kê học tập
  - Thông tin cá nhân
  - Quick access

### 📚 Đăng ký Học phần
- **Đăng ký Học** (`/dang-ky-hoc`) - Trang đăng ký học phần
  - Danh sách lớp học phần
  - Đăng ký / Hủy đăng ký
  - Lọc và tìm kiếm
  - Xem chi tiết lớp học phần

### 📈 Kết quả Học tập
- **Kết quả Học tập** (`/ket-qua-hoc-tap`) - Trang xem kết quả học tập
  - Bảng điểm chi tiết
  - Thống kê GPA
  - Xem điểm theo học kỳ
  - Thống kê tín chỉ

### 🎓 Chương trình Đào tạo
- **Chương trình Đào tạo** (`/chuong-trinh-dao-tao`) - Trang xem CTDT
  - Danh sách môn học trong CTDT
  - Thông tin chi tiết môn học
  - Số tín chỉ và học phần

### 📅 Lịch Học
- **Lịch Học** (`/lich-hoc`) - Trang xem lịch học
  - Lịch học theo tuần/tháng
  - Thời khóa biểu
  - Lịch thi

### 👤 Thông tin Cá nhân
- **User Profile** (`/user-profile`) - Trang quản lý thông tin cá nhân
  - Xem thông tin cá nhân
  - Cập nhật thông tin
  - Đổi mật khẩu

### 🧪 Component UI
- **Component UI** (`/component-ui`) - Trang demo các UI components

---

## 💻 Yêu cầu hệ thống

- **Node.js**: phiên bản 18.x trở lên (khuyến nghị 20.x)
- **npm**: phiên bản 9.x trở lên (hoặc yarn)
- **Git**: để clone repository

---

## 📦 Hướng dẫn cài đặt

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd quanlysinhvien-ketquahoctap_frontend_CL_side
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

Hoặc nếu gặp lỗi peer dependency:

```bash
npm install --legacy-peer-deps
```

Lệnh này sẽ cài đặt tất cả các package cần thiết được liệt kê trong `package.json`.

### Bước 3: Tạo file cấu hình môi trường

Tạo file `.env.local` ở thư mục gốc của dự án (cùng cấp với `package.json`). Xem chi tiết ở phần [Cấu hình môi trường](#cấu-hình-môi-trường).

---

## ⚙️ Cấu hình môi trường

Tạo file `.env.local` trong thư mục gốc của dự án với nội dung sau:

```env
# ===== Cấu hình Backend API =====
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000

# ===== Cấu hình Frontend URLs =====
NEXT_PUBLIC_FRONTEND_ADMIN_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_CL_SIDE_URL=http://localhost:3002
```

### Giải thích các biến môi trường:

- **NEXT_PUBLIC_BACKEND_URL**: Địa chỉ URL của backend API (mặc định: `http://localhost:3000`)
- **NEXT_PUBLIC_FRONTEND_ADMIN_URL**: URL của frontend admin (mặc định: `http://localhost:3001`)
- **NEXT_PUBLIC_FRONTEND_CL_SIDE_URL**: URL của frontend client-side (mặc định: `http://localhost:3002`)

⚠️ **Lưu ý**: 
- Trong Next.js, các biến môi trường có prefix `NEXT_PUBLIC_` sẽ được expose ra client-side
- File `.env.local` không nên được commit lên Git (đã có trong `.gitignore`)
- Port mặc định của ứng dụng này là **3002** (khác với frontend admin là 3001)

---

## 🚀 Chạy ứng dụng

### Chế độ Development (có hot-reload)

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3002` (port được cấu hình trong `package.json`).

Khi có thay đổi code, ứng dụng sẽ tự động reload.

### Chế độ Production

**Bước 1: Build ứng dụng**

```bash
npm run build
```

Lệnh này sẽ build ứng dụng Next.js và tối ưu hóa cho production.

**Bước 2: Chạy ứng dụng**

```bash
npm run start
```

Ứng dụng sẽ chạy tại `http://localhost:3002`.

### Kiểm tra ứng dụng đã chạy

Mở trình duyệt và truy cập:

```
http://localhost:3002
```

Nếu thấy trang chủ (landing page) hoặc trang đăng nhập, nghĩa là ứng dụng đã chạy thành công! 🎉

---

## 📁 Cấu trúc dự án

```
quanlysinhvien-ketquahoctap_frontend_CL_side/
├── public/                    # Static files
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth routes (group)
│   │   │   ├── (auth-pages)/
│   │   │   │   └── login/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (other-pages)/    # Other pages (group)
│   │   │   ├── (dashboard)/  # Dashboard routes
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── dang-ky-hoc/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── ket-qua-hoc-tap/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── chuong-trinh-dao-tao/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── lich-hoc/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── user-profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── component-ui/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx      # Landing page
│   │   │
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   ├── favicon.ico
│   │   └── not-found.tsx     # 404 page
│   │
│   ├── components/            # React components
│   │   ├── auth/             # Authentication components
│   │   │   └── LoginPage.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DangKyHoc.tsx
│   │   │   ├── KetQuaHocTap.tsx
│   │   │   ├── ChuongTrinhDaoTao.tsx
│   │   │   ├── LopHocPhanSinhVien.tsx
│   │   │   └── UserProfileInfo.tsx
│   │   ├── ui/               # UI components
│   │   │   ├── Alert.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── DropdownTable.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchableSelect.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── TextArea.tsx
│   │   │   └── Toggle.tsx
│   │   ├── not-found/        # 404 page component
│   │   │   └── NotFoundPage.tsx
│   │   ├── HeroSection.tsx   # Landing page sections
│   │   ├── AchievementSection.tsx
│   │   ├── FeatureSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── Testimonial.tsx
│   │   ├── CTASection.tsx
│   │   └── ContactSection.tsx
│   │
│   ├── config/               # Configuration files
│   │   └── env.ts           # Environment variables
│   │
│   ├── contexts/             # React Context
│   │   └── SidebarContext.tsx
│   │
│   ├── layouts/              # Layout components
│   │   ├── AppHeader.tsx
│   │   ├── AppSidebar.tsx
│   │   └── Footer.tsx
│   │
│   └── utils/                # Utility functions
│       └── auth.ts          # Authentication utilities
│
├── .env.local               # Environment variables (create)
├── .gitignore
├── next.config.ts           # Next.js configuration
├── package.json
├── postcss.config.mjs       # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── README.md
```

---

## 🎨 Tính năng giao diện

### Dark Mode / Light Mode
- Hỗ trợ chuyển đổi giữa dark mode và light mode
- Theme được lưu trong localStorage
- Sử dụng Context API để quản lý theme

### Responsive Design
- Tối ưu cho mobile, tablet, và desktop
- Sidebar tự động thu gọn trên màn hình nhỏ
- Layout linh hoạt với Tailwind CSS

### Components
- **Sidebar**: Sidebar có thể thu gọn với menu navigation
- **Header**: Header với thông tin người dùng
- **Tables**: Bảng dữ liệu với pagination, sorting, filtering
- **Forms**: Form components với validation
- **Modals**: Modal dialogs
- **Alerts**: Thông báo và alerts
- **SearchableSelect**: Dropdown với tìm kiếm
- **DropdownTable**: Bảng với dropdown actions

### Landing Page Sections
- **Hero Section**: Banner chính với CTA
- **Achievement Section**: Thành tựu và số liệu
- **Feature Section**: Giới thiệu tính năng
- **About Section**: Giới thiệu về trường
- **Testimonial Section**: Phản hồi từ sinh viên
- **CTA Section**: Call to action
- **Contact Section**: Thông tin liên hệ

---

## 🔒 Bảo mật

- JWT token được lưu trong localStorage hoặc cookies
- API calls được bảo vệ bằng JWT authentication
- Input validation trên client-side
- XSS protection với Next.js built-in security
- Protected routes - yêu cầu đăng nhập để truy cập các trang dashboard

---

## 🧪 Chạy tests

```bash
# Lint code
npm run lint
```

---

## 📝 Scripts có sẵn

- `npm run dev` - Chạy ứng dụng (development mode với hot-reload) tại port 3002
- `npm run build` - Build ứng dụng cho production
- `npm run start` - Chạy ứng dụng từ thư mục `.next/` (production mode) tại port 3002

---

## 🔗 Kết nối với Backend

Frontend này được thiết kế để kết nối với Backend API tại `http://localhost:3000` (hoặc URL bạn đã cấu hình trong `.env.local`).

Đảm bảo:
1. Backend đã được chạy và có thể truy cập
2. CORS đã được cấu hình đúng trên backend
3. File `.env.local` đã được cấu hình với `NEXT_PUBLIC_BACKEND_URL` đúng

---

## 🔄 Luồng hoạt động

### 1. Trang chủ (Landing Page)
- Người dùng truy cập `/` sẽ thấy landing page với các sections giới thiệu
- Có thể đăng nhập từ header hoặc CTA section

### 2. Đăng nhập
- Sinh viên đăng nhập bằng mã sinh viên và mật khẩu
- Sau khi đăng nhập thành công, được chuyển đến dashboard
- Token được lưu để xác thực các request tiếp theo

### 3. Dashboard
- Hiển thị tổng quan thông tin cá nhân
- Thống kê học tập
- Quick access đến các chức năng

### 4. Đăng ký Học phần
- Xem danh sách lớp học phần có sẵn
- Lọc theo học kỳ, môn học
- Đăng ký hoặc hủy đăng ký
- Xem lịch học đã đăng ký

### 5. Kết quả Học tập
- Xem bảng điểm chi tiết
- Thống kê GPA và tín chỉ
- Xem điểm theo học kỳ

---

## 📞 Hỗ trợ

Nếu gặp vấn đề trong quá trình cài đặt hoặc sử dụng, vui lòng:

1. Kiểm tra lại file `.env.local` đã được cấu hình đúng chưa
2. Đảm bảo Node.js đã được cài đặt đúng phiên bản (18.x trở lên)
3. Kiểm tra port 3002 có bị chiếm dụng không
4. Xem log lỗi trong terminal để biết thêm chi tiết
5. Thử xóa `node_modules` và `.next`, sau đó chạy lại `npm install`

**Liên hệ hỗ trợ:**
- **Facebook**: [https://www.facebook.com/khakham132](https://www.facebook.com/khakham132)
- **Zalo**: [https://zalo.me/0346184217](https://zalo.me/0346184217)

---

## 📄 License

[MIT licensed](LICENSE)

---

## 🙏 Credits

Dự án được xây dựng với Next.js và React, sử dụng Tailwind CSS cho styling.

---

<p align="center">
  Made with ❤️ using Next.js & React
</p>
