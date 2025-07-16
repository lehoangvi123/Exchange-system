import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

const UserInfoButton = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút thông tin người dùng */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 
                   transition-all duration-200 rounded-lg px-4 py-2 text-white
                   border border-white border-opacity-30 hover:border-opacity-50"
      >
        <div className="flex items-center space-x-2">
  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
    <span className="text-sm font-bold text-white">
      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
    </span>
  </div>
  <span className="text-sm text-white font-semibold">
    {user?.name || user?.email}
  </span>
</div>

        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border 
                        border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          
          {/* Thông tin người dùng */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 
                            rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Người dùng'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                // Điều hướng đến trang profile
                window.location.href = '/profile';
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 
                       hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Thông tin cá nhân</span>
            </button>

            <button
              onClick={() => {
                setIsDropdownOpen(false);
                // Điều hướng đến trang settings
                window.location.href = '/settings';
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 
                       hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Cài đặt</span>
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 
                       hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};