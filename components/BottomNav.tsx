
import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { screen: Screen.HOME, label: 'Trang chủ', icon: 'home' },
    { screen: Screen.ACTIVITY_REG, label: 'Hoạt động', icon: 'calendar_month' },
    { screen: Screen.ATTENDANCE, label: 'Điểm danh', icon: 'qr_code_scanner', isCenter: true },
    { screen: Screen.NEWS, label: 'Tin tức', icon: 'newspaper' },
    { screen: Screen.SETTINGS, label: 'Cá nhân', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-dark/95 backdrop-blur-lg border-t border-white/5 pb-safe pt-2 px-6">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => (
          item.isCenter ? (
            <div key={item.screen} className="relative -top-6">
              <button 
                onClick={() => onNavigate(item.screen)}
                className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
              </button>
            </div>
          ) : (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                currentScreen === item.screen ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <span className={`material-symbols-outlined ${currentScreen === item.screen ? 'material-symbols-fill' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
