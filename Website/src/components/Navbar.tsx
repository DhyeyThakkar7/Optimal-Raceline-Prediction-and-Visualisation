import React from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  showAuthModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  theme, 
  toggleTheme, 
  currentPage, 
  setCurrentPage,
  showAuthModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'analysis', label: 'Circuit Analysis' },
    { id: 'database', label: 'Track Database' },
    { id: 'stats', label: 'Driver Stats' },
    { id: 'predict', label: 'Winner Prediction' }
  ];

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} 
      fixed w-full z-10 shadow-md theme-transition`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentPage('home')} 
              className="flex-shrink-0 focus:outline-none"
            >
              <img 
                src="public/images/logo1.png" 
                alt="F1 Sim Logo" 
                className="h-14 w-14" 
              />
            </button>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === item.id
                        ? 'bg-red-600 text-white'
                        : 'hover:bg-red-500 hover:text-white'
                    }`}
                    onClick={() => setCurrentPage(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={showAuthModal}
                className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.id
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-red-500 hover:text-white'
                } w-full text-left`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                showAuthModal();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700"
            >
              Sign In
            </button>
            <button
              onClick={toggleTheme}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
