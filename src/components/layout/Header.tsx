import React, { useState, useEffect, useRef } from 'react';
import { Menu, Moon, Sun, User, Globe, Home, BarChart2, Activity, User as UserIcon, BookOpen, Accessibility } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { useAuthStore } from '../../stores/authStore';

export function Header() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { t } = useTranslation();
  const { signOut } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [accessibilityMenuOpen, setAccessibilityMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const accessibilityMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setLanguageMenuOpen(false);
  };

  const handleUserMenuClick = () => {
    setUserMenuOpen(!userMenuOpen);
    setLanguageMenuOpen(false);
    setAccessibilityMenuOpen(false);
  };

  const handleAccessibilityMenuClick = () => {
    setAccessibilityMenuOpen(!accessibilityMenuOpen);
    setUserMenuOpen(false);
    setLanguageMenuOpen(false);
  };

  const increaseFontSize = () => {
    document.documentElement.style.fontSize = '18px';
  };

  const decreaseFontSize = () => {
    document.documentElement.style.fontSize = '14px';
  };

  const resetFontSize = () => {
    document.documentElement.style.fontSize = '16px';
  };

  const toggleGrayscale = () => {
    document.documentElement.classList.toggle('grayscale');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
      if (accessibilityMenuRef.current && !accessibilityMenuRef.current.contains(event.target as Node)) {
        setAccessibilityMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="ml-12 text-xl font-bold text-gray-800 dark:text-white">
                QuantumHealth++
              </h1>
              <div className={`sm:ml-10 sm:flex sm:space-x-8 ${menuOpen ? 'block' : 'hidden'}`}>
                <Link to="/" className="text-gray-900 dark:text-white font-bold hover:shadow-md">
                  <Home className="h-6 w-6 inline-block mr-2" />
                  {t('Dashboard')}
                </Link>
                <Link to="/profile" className="text-gray-900 dark:text-white font-bold hover:shadow-md">
                  <UserIcon className="h-6 w-6 inline-block mr-2" />
                  {t('Profile')}
                </Link>
                <Link to="/metrics" className="text-gray-900 dark:text-white font-bold hover:shadow-md">
                  <BarChart2 className="h-6 w-6 inline-block mr-2" />
                  {t('Metrics')}
                </Link>
                <Link to="/activity" className="text-gray-900 dark:text-white font-bold hover:shadow-md">
                  <Activity className="h-6 w-6 inline-block mr-2" />
                  {t('Activity')}
                </Link>
                <Link to="/health-guide" className="text-gray-900 dark:text-white font-bold hover:shadow-md">
                  <BookOpen className="h-6 w-6 inline-block mr-2" />
                  {t('Health Guide')}
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4 relative">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ml-4"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <button onClick={() => setLanguageMenuOpen(!languageMenuOpen)} className="ml-2">
                <Globe className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
              {languageMenuOpen && (
                <div ref={languageMenuRef} className="absolute right-0 mt-8 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <button onClick={() => changeLanguage('fr')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{t('French')}</button>
                  <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{t('English')}</button>
                  <button onClick={() => changeLanguage('es')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{t('Spanish')}</button>
                  <button onClick={() => changeLanguage('de')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{t('German')}</button>
                  <button onClick={() => changeLanguage('ar')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{t('Arabic')}</button>
                </div>
              )}
              <button onClick={handleAccessibilityMenuClick} className="ml-2">
                <Accessibility className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
              {accessibilityMenuOpen && (
                <div ref={accessibilityMenuRef} className="absolute right-0 mt-20 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <button onClick={increaseFontSize} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{t('Increase Font Size')}</button>
                  <button onClick={decreaseFontSize} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{t('Decrease Font Size')}</button>
                  <button onClick={resetFontSize} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{t('Reset Font Size')}</button>
                  <button onClick={toggleGrayscale} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{t('Toggle Grayscale')}</button>
                </div>
              )}
              <button onClick={handleUserMenuClick} className="ml-2">
                <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
              {userMenuOpen && (
                <div
                  ref={userMenuRef}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {t('Your Profile')}
                  </Link>
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {t('Sign Out')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <nav className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-t sm:hidden ${menuOpen ? 'translate-y-1000' : ''}`}>
        <div className="flex justify-around py-2">
          <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs">{t('Dashboard')}</span>
          </Link>
          <Link to="/metrics" className={`flex flex-col items-center ${location.pathname === '/metrics' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'}`}>
            <BarChart2 className="h-6 w-6" />
            <span className="text-xs">{t('Metrics')}</span>
          </Link>
          <Link to="/activity" className={`flex flex-col items-center ${location.pathname === '/activity' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'}`}>
            <Activity className="h-6 w-6" />
            <span className="text-xs">{t('Activity')}</span>
          </Link>
          <Link to="/health-guide" className={`flex flex-col items-center ${location.pathname === '/health-guide' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'}`}>
            <BookOpen className="h-6 w-6" />
            <span className="text-xs">{t('Health Guide')}</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'}`}>
            <UserIcon className="h-6 w-6" />
            <span className="text-xs">{t('Profile')}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Header;
