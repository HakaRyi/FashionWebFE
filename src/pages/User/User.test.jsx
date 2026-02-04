import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UserManagement from './index';

describe('UserManagement', () => {
  it('render tiêu đề trang', () => {
    render(<UserManagement />);

    expect(
      screen.getByText('Quản Lý Người Dùng')
    ).toBeInTheDocument();
  });

  it('render danh sách user ban đầu', () => {
    render(<UserManagement />);

    // kiểm tra 1 user bất kỳ
    expect(
      screen.getByText('Nguyễn Văn A')
    ).toBeInTheDocument();

    expect(
      screen.getByText('vana@gmail.com')
    ).toBeInTheDocument();
  });

  it('lọc user theo ô tìm kiếm', () => {
    render(<UserManagement />);

    const input = screen.getByPlaceholderText(
      'Tìm theo tên, email...'
    );

    // gõ tìm kiếm
    fireEvent.change(input, {
      target: { value: 'Trần Thị B' },
    });

    // user đúng còn
    expect(
      screen.getByText('Trần Thị B')
    ).toBeInTheDocument();

    // user khác biến mất
    expect(
      screen.queryByText('Nguyễn Văn A')
    ).not.toBeInTheDocument();
  });
});
