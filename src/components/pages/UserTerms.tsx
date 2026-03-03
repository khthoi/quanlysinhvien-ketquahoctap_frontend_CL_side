"use client";

import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faFileAlt,
  faUserLock,
  faDatabase,
  faSyncAlt,
  faQuestionCircle,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

const SCROLL_OFFSET = 100;

const scrollToSection = (id: string) => {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const y = rect.top + window.pageYOffset - SCROLL_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
};

const UserTerms: React.FC = () => {
  // Scroll theo hash khi vào trang từ link có #anchor
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const timeout = setTimeout(() => {
      scrollToSection(hash);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  const handleLocalNavClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
    scrollToSection(id);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-24">
      <div className="mt-8"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
        {/* Page Header */}
        <header className="text-center mb-12">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-4">
            <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
            Chính sách & Điều khoản
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Chính sách bảo mật & Điều khoản sử dụng
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Nội dung dưới đây quy định về việc thu thập, sử dụng dữ liệu cá nhân và các điều
            khoản khi bạn sử dụng Cổng thông tin Sinh viên của Đại học Thủ Đô Hà Nội.
          </p>
        </header>

        {/* Local navigation */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={(e) => handleLocalNavClick(e, "terms-of-use")}
            className="inline-flex items-center px-5 py-3 rounded-full text-sm font-semibold bg-white text-gray-800 border border-gray-200 shadow-sm hover:border-red-600 hover:text-red-700 hover:shadow-md transition-all"
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
            Xem Điều khoản sử dụng
            <FontAwesomeIcon icon={faArrowDown} className="ml-2 text-xs" />
          </button>
          <button
            onClick={(e) => handleLocalNavClick(e, "privacy-policy")}
            className="inline-flex items-center px-5 py-3 rounded-full text-sm font-semibold bg-red-700 text-white shadow-md hover:bg-red-800 hover:shadow-lg transition-all"
          >
            <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
            Xem Chính sách bảo mật
            <FontAwesomeIcon icon={faArrowDown} className="ml-2 text-xs" />
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 md:p-10 space-y-12">
          {/* Terms of Use */}
          <section id="terms-of-use">
            <div className="flex items-center mb-4">
              <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faFileAlt} className="text-red-700" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  1. Điều khoản sử dụng
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Áp dụng cho toàn bộ người dùng Cổng thông tin Sinh viên.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
              <p>
                Khi truy cập và sử dụng Cổng thông tin Sinh viên, bạn xác nhận rằng đã đọc,
                hiểu và đồng ý tuân thủ các điều khoản dưới đây. Nếu không đồng ý với bất kỳ
                nội dung nào, vui lòng ngừng sử dụng hệ thống.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">
                1.1. Mục đích sử dụng
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Tra cứu thông tin cá nhân, kết quả học tập, lịch học, lịch thi.</li>
                <li>Đăng ký học phần, xem chương trình đào tạo và thông báo học vụ.</li>
                <li>Tương tác với nhà trường trong phạm vi các chức năng được cung cấp.</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">
                1.2. Trách nhiệm của người dùng
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Bảo mật tên đăng nhập và mật khẩu, không chia sẻ cho bên thứ ba.</li>
                <li>Chịu trách nhiệm với mọi thao tác phát sinh từ tài khoản của mình.</li>
                <li>
                  Cập nhật, cung cấp thông tin chính xác, không giả mạo danh tính hoặc làm sai lệch
                  dữ liệu của hệ thống.
                </li>
                <li>Không can thiệp, phá hoại hoặc thử xâm nhập trái phép vào hệ thống.</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">
                1.3. Quyền của nhà trường
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Tạm khóa hoặc thu hồi quyền truy cập nếu phát hiện hành vi vi phạm quy định,
                  ảnh hưởng đến an toàn hệ thống hoặc quyền lợi người dùng khác.
                </li>
                <li>
                  Cập nhật, thay đổi giao diện, chức năng, nội dung của Cổng thông tin mà không cần
                  thông báo trước nhưng vẫn đảm bảo quyền lợi học tập cốt lõi của sinh viên.
                </li>
              </ul>
            </div>
          </section>

          {/* Privacy Policy */}
          <section id="privacy-policy" className="border-t border-gray-100 pt-10">
            <div className="flex items-center mb-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faUserLock} className="text-blue-700" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  2. Chính sách bảo mật thông tin
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Mô tả cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
              <h3 className="font-semibold text-gray-900">
                2.1. Thông tin được thu thập
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Thông tin định danh: họ tên, mã sinh viên, ngày sinh, giới tính, lớp, khoa.</li>
                <li>Thông tin liên hệ: số điện thoại, email, địa chỉ liên lạc.</li>
                <li>Thông tin học tập: kết quả học tập, lịch sử đăng ký học phần, khen thưởng, kỷ luật.</li>
                <li>Thông tin kỹ thuật: địa chỉ IP, loại trình duyệt, thời gian truy cập (phục vụ bảo mật).</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">
                2.2. Mục đích sử dụng dữ liệu
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Cung cấp và vận hành các chức năng quản lý học tập cho sinh viên.</li>
                <li>
                  Hỗ trợ công tác quản lý đào tạo, thống kê và cải tiến chất lượng dịch vụ của nhà trường.
                </li>
                <li>Đảm bảo an toàn, phát hiện và ngăn chặn các truy cập trái phép.</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">
                2.3. Lưu trữ & bảo vệ dữ liệu
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Dữ liệu được lưu trữ trên hệ thống máy chủ do nhà trường quản lý hoặc ủy quyền.</li>
                <li>
                  Các biện pháp bảo mật kỹ thuật và tổ chức được áp dụng để hạn chế truy cập trái phép,
                  mất mát hoặc lộ lọt dữ liệu.
                </li>
                <li>
                  Chỉ những cán bộ có thẩm quyền mới được phép truy cập dữ liệu phục vụ công tác quản lý.
                </li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">
                2.4. Chia sẻ dữ liệu cho bên thứ ba
              </h3>
              <p>
                Nhà trường không bán hoặc trao đổi dữ liệu cá nhân của bạn cho bên thứ ba vì mục đích
                thương mại. Dữ liệu chỉ có thể được chia sẻ trong các trường hợp:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Theo yêu cầu của cơ quan nhà nước có thẩm quyền.</li>
                <li>Phục vụ công tác kiểm định chất lượng giáo dục theo quy định.</li>
                <li>Khi có sự đồng ý rõ ràng của bạn.</li>
              </ul>
            </div>
          </section>

          {/* Changes & Contact */}
          <section className="border-t border-gray-100 pt-10">
            <div className="flex items-center mb-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faSyncAlt} className="text-amber-700" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  3. Cập nhật & liên hệ
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
              <p>
                Nhà trường có thể cập nhật Điều khoản sử dụng và Chính sách bảo mật theo từng thời
                điểm để phù hợp với quy định pháp luật và quy chế nội bộ. Phiên bản mới nhất sẽ luôn
                được công bố trên trang này.
              </p>
              <div className="flex items-start space-x-3 bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <FontAwesomeIcon icon={faQuestionCircle} className="mt-1 text-red-600" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    Nếu bạn có câu hỏi hoặc yêu cầu liên quan đến dữ liệu cá nhân:
                  </p>
                  <p className="text-sm text-gray-700">
                    Vui lòng liên hệ Phòng Công nghệ thông tin hoặc Phòng Đào tạo của Đại học Thủ Đô Hà
                    Nội qua email{" "}
                    <a
                      href="mailto:support@hnmu.edu.vn"
                      className="text-red-700 font-medium hover:underline"
                    >
                      support@hnmu.edu.vn
                    </a>{" "}
                    để được hỗ trợ.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default UserTerms;

