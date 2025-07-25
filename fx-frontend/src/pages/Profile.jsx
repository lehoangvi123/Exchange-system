import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // trạng thái đang tải

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Lỗi khi parse user từ localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <p>⏳ Đang tải thông tin người dùng...</p>;
  } 


  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 font-semibold">⚠️ Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin cá nhân.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Thông tin cá nhân</h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>👤 Họ và tên:</strong> {user.name}</p>
        <p><strong>📧 Email:</strong> {user.email}</p>
        <p><strong>📄 Vai trò:</strong> {user.role || 'Người dùng'}</p>
        <p><strong>🕒 Đăng nhập lần cuối:</strong> {user.lastLogin || 'Không rõ'}</p>
      </div>
    </div>
  );
};

export default Profile;
