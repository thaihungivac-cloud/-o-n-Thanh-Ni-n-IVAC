
import React, { useState, useEffect } from 'react';
import { Screen } from './types';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import NewsScreen from './screens/NewsScreen';
import ProfileScreen from './screens/ProfileScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import ActivityScreen from './screens/ActivityScreen';
import AIScreen from './screens/AIScreen';
import SettingsScreen from './screens/SettingsScreen';
import MembersScreen from './screens/MembersScreen';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ONBOARDING);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle back navigation for specific screens
  const handleBack = () => {
    if (currentScreen === Screen.HOME) return;
    setCurrentScreen(Screen.HOME);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.ONBOARDING:
        return <OnboardingScreen onNext={() => setCurrentScreen(Screen.LOGIN)} />;
      case Screen.LOGIN:
        return <LoginScreen onLogin={() => {
          setIsAuthenticated(true);
          setCurrentScreen(Screen.HOME);
        }} />;
      case Screen.HOME:
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case Screen.ATTENDANCE:
        return <AttendanceScreen onBack={handleBack} />;
      case Screen.NEWS:
        return <NewsScreen onBack={handleBack} />;
      case Screen.PROFILE:
        return <ProfileScreen onBack={handleBack} />;
      case Screen.ANALYTICS:
        return <AnalyticsScreen onBack={handleBack} />;
      case Screen.ACTIVITY:
        return <ActivityScreen onBack={handleBack} />;
      case Screen.AI:
        return <AIScreen onBack={handleBack} />;
      case Screen.SETTINGS:
        return <SettingsScreen onBack={handleBack} onLogout={() => {
          setIsAuthenticated(false);
          setCurrentScreen(Screen.LOGIN);
        }} />;
      case Screen.MEMBERS:
        return <MembersScreen onBack={handleBack} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  const showNav = isAuthenticated && 
    ![Screen.ONBOARDING, Screen.LOGIN, Screen.AI].includes(currentScreen);

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <div className="relative w-full max-w-md h-screen bg-background-dark overflow-hidden flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {renderScreen()}
        </div>
        {showNav && (
          <BottomNav 
            currentScreen={currentScreen} 
            onNavigate={setCurrentScreen} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
