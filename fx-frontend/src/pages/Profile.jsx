import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Giả sử bạn đã lưu token hoặc user info trong localStorage sau khi đăng nhập
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  if (!user) {
    return <p>Đang tải thông tin người dùng...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Thông tin cá nhân</h2>
      <div className="space-y-2">
        <p><strong>👤 Họ và tên:</strong> {user.name}</p>
        <p><strong>📧 Email:</strong> {user.email}</p>
        <p><strong>📄 Vai trò:</strong> {user.role || 'Người dùng'}</p>
        <p><strong>🕒 Đăng nhập lần cuối:</strong> {user.lastLogin || 'Không rõ'}</p>
      </div>
    </div>
  );
};

export default Profile;
