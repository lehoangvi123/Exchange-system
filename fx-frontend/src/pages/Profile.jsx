import React, { useEffect, useState } from 'react'; 
import '../css/Profile.css'

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Get user initials for avatar
  const getUserInitials = (name, email) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Không rõ';
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>⏳ Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <div className="profile-error-icon">⚠️</div>
          <h3>Bạn chưa đăng nhập</h3>
          <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {getUserInitials(user.name, user.email)}
          </div>
          <h2 className="profile-title">Thông tin cá nhân</h2>
          <p className="profile-subtitle">Xem và quản lý thông tin tài khoản của bạn</p>
        </div>

        {/* Profile Information */}
        <div className="profile-info">
          <div className="profile-info-item">
            <div className="profile-info-label">
              <svg className="profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Họ và tên
            </div>
            <div className="profile-info-value">
              {user.name || 'Chưa cập nhật'}
            </div>
          </div>

          <div className="profile-info-item">
            <div className="profile-info-label">
              <svg className="profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </div>
            <div className="profile-info-value">
              {user.email}
            </div>
          </div>

          <div className="profile-info-item">
            <div className="profile-info-label">
              <svg className="profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Vai trò
            </div>
            <div className="profile-info-value">
              {user.role || 'Người dùng'}
            </div>
          </div>

          <div className="profile-info-item">
            <div className="profile-info-label">
              <svg className="profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Đăng nhập lần cuối
            </div>
            <div className="profile-info-value">
              {formatDate(user.lastLogin)}
            </div>
          </div>

          {user.createdAt && (
            <div className="profile-info-item">
              <div className="profile-info-label">
                <svg className="profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Ngày tạo tài khoản
              </div>
              <div className="profile-info-value">
                {formatDate(user.createdAt)}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button className="profile-btn profile-btn-primary">
            <svg style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Chỉnh sửa thông tin
          </button>
          
          <button className="profile-btn profile-btn-secondary">
            <svg style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Cài đặt tài khoản
          </button>
        </div>
      </div>

      <style jsx>{`
        /* Profile Specific Styles */
        .profile-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .profile-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          animation: float 8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        .profile-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 8px 32px rgba(102, 126, 234, 0.2),
            inset 0 1px 2px rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.3);
          max-width: 480px;
          width: 100%;
          transform: translateY(0);
          animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .profile-card:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 35px 70px rgba(0, 0, 0, 0.2),
            0 12px 40px rgba(102, 126, 234, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .profile-header {
          text-align: center;
          margin-bottom: 2.5rem;
          position: relative;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 3rem;
          font-weight: bold;
          color: white;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          box-shadow: 
            0 15px 35px rgba(102, 126, 234, 0.4),
            0 5px 15px rgba(0, 0, 0, 0.1);
          position: relative;
          transition: all 0.3s ease;
        }

        .profile-avatar::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
          border-radius: 50%;
          z-index: -1;
          animation: avatarGlow 3s linear infinite;
        }

        @keyframes avatarGlow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        .profile-avatar:hover {
          transform: scale(1.05);
        }

        .profile-avatar::after {
          content: '';
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          background: #10b981;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .profile-title {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #2c3e50, #667eea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .profile-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .profile-info {
          display: grid;
          gap: 1.5rem;
        }

        .profile-info-item {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 16px;
          padding: 1.5rem;
          border-left: 4px solid;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .profile-info-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.6s ease;
        }

        .profile-info-item:hover::before {
          left: 100%;
        }

        .profile-info-item:hover {
          transform: translateX(8px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .profile-info-item:nth-child(1) { border-left-color: #3b82f6; }
        .profile-info-item:nth-child(2) { border-left-color: #10b981; }
        .profile-info-item:nth-child(3) { border-left-color: #f59e0b; }
        .profile-info-item:nth-child(4) { border-left-color: #ef4444; }
        .profile-info-item:nth-child(5) { border-left-color: #8b5cf6; }

        .profile-info-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .profile-info-value {
          color: #1f2937;
          font-size: 1.1rem;
          font-weight: 500;
          margin-left: 2rem;
        }

        .profile-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #6b7280;
        }

        .profile-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          color: white;
          font-size: 1.25rem;
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .profile-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          color: #dc2626;
          max-width: 400px;
          margin: 0 auto;
          backdrop-filter: blur(10px);
        }

        .profile-error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .profile-actions {
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .profile-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .profile-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .profile-btn-secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #374151;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .profile-btn-secondary:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-container {
            padding: 1rem;
          }
          
          .profile-card {
            padding: 2rem;
            margin: 1rem;
          }
          
          .profile-avatar {
            width: 100px;
            height: 100px;
            font-size: 2.5rem;
          }
          
          .profile-title {
            font-size: 1.875rem;
          }
          
          .profile-info-item {
            padding: 1.25rem;
          }
          
          .profile-actions {
            flex-direction: column;
          }
          
          .profile-btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .profile-card {
            padding: 1.5rem;
          }
          
          .profile-avatar {
            width: 80px;
            height: 80px;
            font-size: 2rem;
          }
          
          .profile-title {
            font-size: 1.5rem;
          }
          
          .profile-info-item {
            padding: 1rem;
          }
          
          .profile-info-value {
            margin-left: 1.5rem;
            font-size: 1rem;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .profile-container::before,
          .profile-avatar::before,
          .profile-avatar::after,
          .loading-spinner {
            animation: none;
          }
          
          .profile-card,
          .profile-info-item,
          .profile-btn {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;