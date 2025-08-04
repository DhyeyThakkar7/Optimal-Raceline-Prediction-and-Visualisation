import React, { useState, useEffect } from 'react';
import './styles/index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CircuitAnalysisPage from './pages/CircuitAnalysisPage';
import WinnerPrediction from './pages/WinnerPrediction';
import TrackDatabasePage from './pages/TrackDatabasePage';
import DriverStatsPage from './pages/DriverStatsPage';
import AuthModal from './components/AuthModal';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
    } else if (savedTheme === 'light') {
      setTheme('light');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Update theme in localStorage when changed
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const showAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage theme={theme} />;
      case 'analysis':
        return <CircuitAnalysisPage theme={theme} />;
      case 'database':
        return <TrackDatabasePage theme={theme} />;
      case 'stats':
        return <DriverStatsPage theme={theme} currentPage={currentPage} />;
      case 'predict':
        return <WinnerPrediction theme={theme} currentPage={currentPage} />;
      default:
        return <HomePage theme={theme} />;
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen theme-transition`}>
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        showAuthModal={showAuthModal}
      />
      
      {renderCurrentPage()}
      
      <Footer theme={theme} />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        theme={theme} 
      />
    </div>
  );
}

export default App;