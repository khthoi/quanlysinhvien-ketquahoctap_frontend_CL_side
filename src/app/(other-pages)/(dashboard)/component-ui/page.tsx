'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faTrash, 
  faEdit, 
  faSearch, 
  faEnvelope,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Toggle from '@/components/ui/Toggle';
import Alert from '@/components/ui/Alert';
import Modal from '@/components/ui/Modal';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';

const DemoPage:  React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  // Sample table data
  const columns = [
    { key: 'maSV', header: 'Mã SV', sortable: true },
    { key: 'hoTen', header: 'Họ tên', sortable: true },
    { key: 'lop', header: 'Lớp' },
    { 
      key: 'tinhTrang', 
      header:  'Trạng thái',
      render: (value:  string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'DANG_HOC' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {value === 'DANG_HOC' ? 'Đang học' : 'Khác'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      align: 'center' as const,
      render: () => (
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={faEdit}>Sửa</Button>
          <Button variant="ghost" size="sm" leftIcon={faTrash}>Xóa</Button>
        </div>
      )
    }
  ];

  const data = [
    { maSV: '222001459', hoTen: 'Trần Tấn Khá', lop: 'CNTT_K2021_B', tinhTrang: 'DANG_HOC' },
    { maSV: '222001460', hoTen:  'Nguyễn Văn A', lop: 'CNTT_K2021_A', tinhTrang: 'DANG_HOC' },
    { maSV: '222001461', hoTen:  'Lê Thị B', lop: 'CNTT_K2021_B', tinhTrang: 'DANG_HOC' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <h1 className="text-3xl font-bold text-gray-900">UI Component Library</h1>

        {/* Buttons */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" leftIcon={faPlus}>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger" leftIcon={faTrash}>Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Inputs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Input 
              label="Email" 
              placeholder="Nhập email..."
              leftIcon={faEnvelope}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input 
              label="Mật khẩu" 
              type="password"
              placeholder="Nhập mật khẩu..."
            />
            <Input 
              label="Có lỗi" 
              error="Trường này không hợp lệ"
              defaultValue="invalid"
            />
            <Input 
              label="Thành công" 
              success="Trường hợp lệ"
              defaultValue="valid@email.com"
            />
          </div>
        </section>

        {/* TextArea */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">TextArea</h2>
          <TextArea 
            label="Mô tả"
            placeholder="Nhập mô tả..."
            rows={4}
            maxLength={200}
            showCount
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target. value)}
            helperText="Nhập mô tả chi tiết"
          />
        </section>

        {/* Toggle */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Toggle</h2>
          <div className="space-y-4">
            <Toggle 
              checked={toggleValue}
              onChange={setToggleValue}
              label="Nhận thông báo"
              description="Bật để nhận thông báo qua email"
            />
            <Toggle 
              checked={true}
              onChange={() => {}}
              label="Đã bật"
              size="lg"
            />
          </div>
        </section>

        {/* Alerts */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alerts</h2>
          <div className="space-y-4">
            <Alert type="success" title="Thành công!" message="Đã lưu thông tin thành công." dismissible />
            <Alert type="error" title="Lỗi!" message="Đã xảy ra lỗi khi xử lý yêu cầu." />
            <Alert type="warning" message="Vui lòng kiểm tra lại thông tin trước khi gửi." />
            <Alert 
              type="info" 
              title="Thông tin" 
              message="Hệ thống sẽ bảo trì vào cuối tuần này."
              action={{ label: 'Xem chi tiết', onClick: () => {} }}
            />
          </div>
        </section>

        {/* Modal */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Modal</h2>
          <Button onClick={() => setIsModalOpen(true)}>Mở Modal</Button>
          
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Xác nhận hành động"
            description="Bạn có chắc chắn muốn thực hiện hành động này?"
            icon={faExclamationTriangle}
            iconColor="bg-yellow-100 text-yellow-600"
            footer={
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  Xác nhận
                </Button>
              </div>
            }
          >
            <p className="text-gray-600">
              Hành động này không thể hoàn tác.  Vui lòng xác nhận để tiếp tục.
            </p>
          </Modal>
        </section>

        {/* Table */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Table</h2>
          <Table 
            columns={columns}
            data={data}
            hoverable
            striped
          />
          <Pagination 
            currentPage={currentPage}
            totalPages={10}
            totalItems={100}
            onPageChange={setCurrentPage}
          />
        </section>
      </div>
    </div>
  );
};

export default DemoPage;