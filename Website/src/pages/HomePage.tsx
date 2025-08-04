import React from 'react';
import { Activity, Map, Trophy, Users, ChevronRight, Clock } from 'lucide-react';
import ReactionTimer from '../components/ReactionTimer'; // Import the ReactionTimer component

interface HomePageProps {
  theme: 'light' | 'dark';
}

const HomePage: React.FC<HomePageProps> = ({ theme }) => {
  const features = [
    {
      icon: <Map size={24} />,
      title: 'Circuit Analysis',
      description: 'Upload and analyze circuit layouts with AI-powered insights.'
    },
    {
      icon: <Activity size={24} />,
      title: 'Performance Metrics',
      description: 'Track and compare driver and team performance statistics.'
    },
    {
      icon: <Trophy size={24} />,
      title: 'Race Simulations',
      description: 'Simulate race scenarios with different strategies and conditions.'
    },
    {
      icon: <Clock size={24} />,
      title: 'Reaction Timer',
      description: 'Test your reflexes with our F1-inspired reaction timer game.'
    }
  ];

  const news = [
    {
      title: 'Hamilton Secures Pole Position at Monaco',
      date: 'May 27, 2024',
      image: 'https://images.hindustantimes.com/rf/image_size_640x362/HT/p2/2016/05/29/Pictures/monaco-f1-gp-auto-racing_46900cd0-25ad-11e6-86a8-6aa3f93e5d3e.jpg',
      url: 'https://www.formula1.com/en/latest/article/qualifying-report-monaco-grand-prix-2019.6GDqMvZOQDZcdtig2GqfG5' // Dummy URL
    },
    {
      title: 'Verstappen Wins Spanish Grand Prix',
      date: 'June 4, 2024',
      image: 'https://news.cgtn.com/news/2024-06-24/Max-Verstappen-wins-fourth-straight-F1-title-at-Spanish-Grand-Prix-1uGzdvOYbIc/img/bc33c9a3d52f42bc9fad6af271bf25b2/bc33c9a3d52f42bc9fad6af271bf25b2.jpeg',
      url: 'https://www.formula1.com/en/latest/article/verstappen-holds-of-norris-challenge-to-seal-victory-at-the-spanish-grand.7a5UhXMAtkhbslSDNiPVes' // Dummy URL
    },
    {
      title: 'Ferrari Unveils New Aerodynamic Package',
      date: 'June 10, 2024',
      image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_960,q_auto/t_16by9Centre/f_auto/q_auto/fom-website/2025/Ferrari/Ferrari%20SF-25%20launch%20renders/F677_still_02_v11_169',
      url: 'https://www.formula1.com/en/latest/article/first-look-ferrari-unveil-new-2025-car-after-sf-25-livery-reveal-during-f1.1IvvOTzHsJr2KsZoPPJNjE' // Dummy URL
    }
  ];

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen pt-16 theme-transition`}>
      {/* Hero Section */}
      <div className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Formula 1 Simulation</h1>
            <p className="text-xl md:text-2xl mb-8">
              Advanced analytics and simulation tools for F1 enthusiasts
            </p>
            <button className="bg-white text-red-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-200">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg card-hover ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}
              >
                <div className="text-red-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reaction Timer Section */}
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Test Your Reflexes</h2>
          <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
            <ReactionTimer /> {/* Add the ReactionTimer component here */}
          </div>
        </div>
      </div>

      {/* Live Race Updates */}
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Live Race Updates</h2>
            <div className="flex items-center text-red-600">
              <Clock className="mr-2" size={20} />
              <span>Next race: Monaco GP - 3d 14h 22m</span>
            </div>
          </div>
          
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <h3 className="text-xl font-semibold mb-4">Current Standings</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(pos => (
                    <div 
                      key={pos} 
                      className={`flex items-center p-3 rounded ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <span className="text-lg font-bold w-8">{pos}</span>
                      <img 
                        src={[
                          'https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png',
                          'https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png',
                          'https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png',
                          'https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col/image.png',
                          'https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col/image.png'
                        ][pos-1]} 
                        alt="Driver" 
                        className="w-8 h-8 rounded-full mx-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium">
                          {['Max Verstappen', 'Lewis Hamilton', 'Charles Leclerc', 'Lando Norris', 'Carlos Sainz'][pos-1]}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {['Red Bull', 'Mercedes', 'Ferrari', 'McLaren', 'Ferrari'][pos-1]}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {[410, 285, 265, 245, 235][pos-1]} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Race Information</h3>
                <div className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h4 className="font-bold">Monaco Grand Prix</h4>
                  <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Circuit de Monaco
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Practice 1
                      </span>
                      <span className="text-sm">Fri 10:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Practice 2
                      </span>
                      <span className="text-sm">Fri 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Practice 3
                      </span>
                      <span className="text-sm">Sat 11:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Qualifying
                      </span>
                      <span className="text-sm">Sat 15:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Race
                      </span>
                      <span className="text-sm">Sun 15:00</span>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 flex items-center justify-center"
                    onClick={() => window.location.href = 'https://www.formula1.com/en/racing/2024/monaco'} // Redirect to the full schedule URL
                  >
                    <span>Full Schedule</span>
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest News */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Latest F1 News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <div 
                key={index} 
                className={`rounded-lg overflow-hidden card-hover ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.date}
                  </p>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <button 
                    className="text-red-600 font-medium flex items-center hover:underline"
                    onClick={() => window.location.href = item.url} // Redirect to the URL
                  >
                    <span>Read more</span>
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;