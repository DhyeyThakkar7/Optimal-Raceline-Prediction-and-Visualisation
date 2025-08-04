import React from 'react';

interface FooterProps {
  theme: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <footer className={`${
      theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'
    } py-8 theme-transition`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">F1 Simulation</h3>
            <p className="text-sm">
              The ultimate Formula 1 simulation tool for fans and professionals alike.
              Analyze circuits, track statistics, and more.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-600">Home</a></li>
              <li><a href="#" className="hover:text-red-600">Circuit Analysis</a></li>
              <li><a href="#" className="hover:text-red-600">Track Database</a></li>
              <li><a href="#" className="hover:text-red-600">Driver Stats</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-600">F1 News</a></li>
              <li><a href="#" className="hover:text-red-600">Race Calendar</a></li>
              <li><a href="#" className="hover:text-red-600">Team Standings</a></li>
              <li><a href="#" className="hover:text-red-600">Driver Standings</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-600">Twitter</a></li>
              <li><a href="#" className="hover:text-red-600">Instagram</a></li>
              <li><a href="#" className="hover:text-red-600">YouTube</a></li>
              <li><a href="#" className="hover:text-red-600">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} F1 Simulation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;