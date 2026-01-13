
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

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ONBOARDING);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [initialTargetId, setInitialTargetId] = useState<string | null>(null);

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
      }
    ];
  });

  const [activities, setActivities] = useState<ActivityPlan[]>(() => {
    const saved = localStorage.getItem('ivac_activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('ivac_news');
    return saved ? JSON.parse(saved) : [];
  });

  const [docs, setDocs] = useState<Document[]>(() => {
    const saved = localStorage.getItem('ivac_docs');
    return saved ? JSON.parse(saved) : [];
  });

  const [systemNotifications, setSystemNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('ivac_system_notifs');
    return saved ? JSON.parse(saved) : [];
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
    localStorage.setItem('ivac_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('ivac_docs', JSON.stringify(docs));
  }, [docs]);

  useEffect(() => {
    localStorage.setItem('ivac_system_notifs', JSON.stringify(systemNotifications));
  }, [systemNotifications]);

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    if (currentUser?.id === updatedMember.id) setCurrentUser(updatedMember);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    if (currentUser?.id === id) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setCurrentScreen(Screen.LOGIN);
    }
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

  const handleClearNotifications = () => {
    if (window.confirm("Đồng chí có chắc chắn muốn xóa tất cả thông báo hệ thống không?")) {
      setSystemNotifications([]);
      alert("Đã xóa toàn bộ thông báo.");
    }
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
        return <LoginScreen members={members} onLogin={(user) => { setCurrentUser(user); setIsAuthenticated(true); setCurrentScreen(Screen.HOME); }} />;
      case Screen.HOME:
        return <HomeScreen currentUser={currentUser} members={members} news={news} activities={activities} docs={docs} settings={settings} systemNotifications={systemNotifications} onNavigate={navigateToWithTarget} onClearNotifs={handleClearNotifications} />;
      case Screen.ATTENDANCE:
        return <AttendanceScreen currentUser={currentUser} members={members} activities={activities} onUpdateActivities={setActivities} onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.ACTIVITY_REG:
        return <ActivityRegistrationScreen currentUser={currentUser} members={members} activities={activities} onUpdateActivities={setActivities} onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.PROFILE:
        return <ProfileScreen currentUser={currentUser} members={members} activities={activities} onUpdate={handleUpdateMember} onLogout={() => {setIsAuthenticated(false); setCurrentScreen(Screen.LOGIN);}} onBack={() => setCurrentScreen(Screen.SETTINGS)} />;
      case Screen.NEWS:
        return <NewsScreen currentUser={currentUser} news={news} setNews={setNews} onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.ACTIVITY:
        return <ActivityScreen onBack={() => setCurrentScreen(Screen.HOME)} currentUser={currentUser} onSendNotification={handleSendNotification} initialId={initialTargetId} />;
      case Screen.AI:
        return <AIScreen onBack={() => setCurrentScreen(Screen.HOME)} members={members} activities={activities} news={news} docs={docs} aiEnabled={settings.aiEnabled} />;
      case Screen.SETTINGS:
        return <SettingsScreen currentUser={currentUser} members={members} settings={settings} onUpdateSettings={setSettings} onBack={() => setCurrentScreen(Screen.HOME)} onLogout={() => {setIsAuthenticated(false); setCurrentScreen(Screen.LOGIN);}} onNavigate={setCurrentScreen} onUpdateMember={handleUpdateMember} />;
      case Screen.MEMBERS:
        return <MembersScreen currentUser={currentUser} members={members} onAddMember={(m) => setMembers(p => [m, ...p])} onUpdateMember={handleUpdateMember} onDeleteMember={handleDeleteMember} onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.LIBRARY:
        return <LibraryScreen currentUser={currentUser} docs={docs} setDocs={setDocs} onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.ANALYTICS:
        return <AnalyticsScreen onBack={() => setCurrentScreen(Screen.HOME)} members={members} activities={activities} currentUser={currentUser} onSendNotification={handleSendNotification} />;
      case Screen.REPORTS:
        return <ReportsScreen onBack={() => setCurrentScreen(Screen.HOME)} members={members} activities={activities} currentUser={currentUser} />;
      default:
        return <HomeScreen currentUser={currentUser} members={members} news={news} activities={activities} docs={docs} settings={settings} systemNotifications={systemNotifications} onNavigate={navigateToWithTarget} onClearNotifs={handleClearNotifications} />;
    }
  };

  const showNav = isAuthenticated && ![Screen.ONBOARDING, Screen.LOGIN, Screen.AI].includes(currentScreen);

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div className="relative w-full max-w-md h-screen bg-background-light dark:bg-background-dark overflow-hidden flex flex-col shadow-2xl transition-colors duration-300">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {renderScreen()}
        </div>
        {showNav && <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />}
      </div>
    </div>
  );
};

export default App;
