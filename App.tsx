
import React, { useState, useEffect } from 'react';
import { Screen, Member, ActivityPlan, NewsItem, Document, SystemNotification } from './types';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import ActivityRegistrationScreen from './screens/ActivityRegistrationScreen';
import ProfileScreen from './screens/ProfileScreen';
import NewsScreen from './screens/NewsScreen';
import ActivityScreen from './screens/ActivityScreen';
import AIScreen from './screens/AIScreen';
import SettingsScreen from './screens/SettingsScreen';
import MembersScreen from './screens/MembersScreen';
import LibraryScreen from './screens/LibraryScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import ReportsScreen from './screens/ReportsScreen';
import BottomNav from './components/BottomNav';

interface ToastData {
  message: string;
  type: 'success' | 'error';
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ONBOARDING);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [initialTargetId, setInitialTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ivac_settings');
    if (saved) return JSON.parse(saved);
    return { aiEnabled: true, notifEnabled: true, darkMode: true };
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('ivac_members');
    if (saved) return JSON.parse(saved);
    return [
      { 
        id: 'admin_1', 
        code: 'IVAC001', 
        name: 'Nguyễn Thái Hùng', 
        gender: 'Nam',
        dob: '1990-03-26',
        joinDate: '2024-03-26',
        position: 'Bí thư đoàn cơ sở',
        branch: 'Hậu Cần',
        phone: '0987654321',
        email: 'thaihung.ivac@gmail.com',
        notes: '',
        status: 'active', 
        avatar: 'https://picsum.photos/200/200?random=100',
        role: 'admin'
      },
      { 
        id: 'user_1', 
        code: 'IVAC002', 
        name: 'Đoàn Viên IVAC', 
        gender: 'Nam',
        dob: '1995-05-20',
        joinDate: '2024-01-01',
        position: 'Đoàn viên',
        branch: 'Sản Xuất',
        phone: '0123456789',
        email: 'doanthanhnienivac@gmail.com',
        notes: '',
        status: 'active', 
        avatar: 'https://picsum.photos/200/200?random=101',
        role: 'user'
      }
    ];
  });

  const [systemNotifications, setSystemNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('ivac_system_notifs');
    return saved ? JSON.parse(saved) : [];
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('ivac_news');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: '1',
        title: 'Thanh niên IVAC quyết tâm thực hiện thắng lợi nhiệm vụ Số hóa phong trào Đoàn',
        content: 'Trong bối cảnh cách mạng công nghiệp 4.0, Đoàn thanh niên IVAC đã triển khai mạnh mẽ các giải pháp số hóa. Hệ thống quản lý mới giúp giảm thiểu 70% thủ tục giấy tờ...',
        image: 'https://picsum.photos/800/400?random=10',
        date: new Date().toISOString(),
        author: 'Nguyễn Thái Hùng',
        category: 'Tin tức',
        views: 125,
        likes: [],
        comments: []
      }
    ];
  });

  const [activities, setActivities] = useState<ActivityPlan[]>(() => {
    const saved = localStorage.getItem('ivac_activities');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'act1',
        name: 'Sinh hoạt Chi đoàn Tháng 3',
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '23:59',
        points: 10,
        branch: 'Hậu Cần',
        status: 'upcoming',
        participants: [],
        attendees: []
      }
    ];
  });

  const [docs, setDocs] = useState<Document[]>(() => {
    const saved = localStorage.getItem('ivac_docs');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ivac_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ivac_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('ivac_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('ivac_system_notifs', JSON.stringify(systemNotifications));
  }, [systemNotifications]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    // Xử lý đăng xuất triệt để
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentScreen(Screen.LOGIN);
    showToast("Đã đăng xuất hệ thống", "success");
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    if (currentUser?.id === updatedMember.id) setCurrentUser(updatedMember);
  };

  const handleSendNotification = (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setSystemNotifications(prev => [newNotif, ...prev]);
  };

  const handleBack = () => {
    setCurrentScreen(Screen.HOME);
    setInitialTargetId(null);
  };

  const navigateToWithTarget = (screen: Screen, targetId?: string) => {
    setInitialTargetId(targetId || null);
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.ONBOARDING:
        return <OnboardingScreen onNext={() => setCurrentScreen(Screen.LOGIN)} />;
      case Screen.LOGIN:
        return <LoginScreen members={members} onLogin={(user) => { setCurrentUser(user); setIsAuthenticated(true); setCurrentScreen(Screen.HOME); }} onShowToast={showToast} />;
      case Screen.HOME:
        return <HomeScreen currentUser={currentUser} members={members} news={news} activities={activities} docs={docs} settings={settings} systemNotifications={systemNotifications} onNavigate={navigateToWithTarget} />;
      case Screen.ATTENDANCE:
        return <AttendanceScreen currentUser={currentUser} members={members} activities={activities} onUpdateActivities={setActivities} onBack={handleBack} onShowToast={showToast} />;
      case Screen.ACTIVITY_REG:
        return <ActivityRegistrationScreen currentUser={currentUser} members={members} activities={activities} onUpdateActivities={setActivities} onBack={handleBack} onShowToast={showToast} />;
      case Screen.PROFILE:
        return <ProfileScreen currentUser={currentUser} members={members} activities={activities} onUpdate={handleUpdateMember} onLogout={handleLogout} onBack={() => setCurrentScreen(Screen.SETTINGS)} onShowToast={showToast} />;
      case Screen.NEWS:
        return <NewsScreen currentUser={currentUser} news={news} setNews={setNews} onBack={handleBack} onShowToast={showToast} />;
      case Screen.ACTIVITY:
        return <ActivityScreen onBack={handleBack} currentUser={currentUser} onSendNotification={handleSendNotification} initialId={initialTargetId} onShowToast={showToast} />;
      case Screen.AI:
        return <AIScreen onBack={handleBack} membersCount={members.length} aiEnabled={settings.aiEnabled} />;
      case Screen.SETTINGS:
        return <SettingsScreen currentUser={currentUser} members={members} settings={settings} onUpdateSettings={setSettings} onBack={handleBack} onLogout={handleLogout} onNavigate={setCurrentScreen} onUpdateMember={handleUpdateMember} onShowToast={showToast} />;
      case Screen.MEMBERS:
        return <MembersScreen currentUser={currentUser} members={members} onAddMember={(m) => setMembers(p => [m, ...p])} onUpdateMember={handleUpdateMember} onDeleteMember={(id) => setMembers(p => p.filter(x => x.id !== id))} onBack={handleBack} onShowToast={showToast} />;
      case Screen.LIBRARY:
        return <LibraryScreen currentUser={currentUser} docs={docs} setDocs={setDocs} onBack={handleBack} onShowToast={showToast} />;
      case Screen.ANALYTICS:
        return <AnalyticsScreen onBack={handleBack} members={members} activities={activities} currentUser={currentUser} onSendNotification={handleSendNotification} onShowToast={showToast} />;
      case Screen.REPORTS:
        return <ReportsScreen onBack={handleBack} members={members} activities={activities} onShowToast={showToast} />;
      default:
        return <HomeScreen currentUser={currentUser} members={members} news={news} activities={activities} docs={docs} settings={settings} systemNotifications={systemNotifications} onNavigate={navigateToWithTarget} />;
    }
  };

  const showNav = isAuthenticated && ![Screen.ONBOARDING, Screen.LOGIN, Screen.AI].includes(currentScreen);

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div className="relative w-full max-w-md h-screen bg-background-light dark:bg-background-dark overflow-hidden flex flex-col shadow-2xl border-x border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {renderScreen()}
        </div>
        {showNav && <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />}

        {/* Global Toast Notification System */}
        {toast && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-xs animate-in slide-in-from-top duration-300">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-[2rem] shadow-2xl backdrop-blur-xl border ${
              toast.type === 'success' 
                ? 'bg-primary/90 border-white/20 text-white' 
                : 'bg-rose-500/90 border-white/20 text-white'
            }`}>
              <span className="material-symbols-outlined text-2xl font-black">
                {toast.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <p className="text-sm font-black uppercase tracking-tight flex-1">{toast.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
