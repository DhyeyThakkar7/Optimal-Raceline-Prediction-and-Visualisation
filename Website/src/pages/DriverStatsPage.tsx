import React, { useEffect, useRef, useState } from 'react';
import { drivers } from '../data/drivers';
import { Driver } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

interface DriverStatsPageProps {
  theme: 'light' | 'dark';
  currentPage: string;
}

const DriverStatsPage: React.FC<DriverStatsPageProps> = ({ theme, currentPage }) => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<HTMLDivElement>(null);
  const itemWidth = 280; // Width of each driver card
  const gap = 20; // Gap between cards

  useEffect(() => {
    if (currentPage === 'stats' && drivers.length > 0 && !selectedDriver) {
      setSelectedDriver(drivers[0]);
    }
  }, [currentPage, selectedDriver]);

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      if (swiperRef.current) {
        swiperRef.current.scrollLeft -= (itemWidth + gap);
      }
    }
  };

  const handleNext = () => {
    if (activeIndex < drivers.length - 1) {
      setActiveIndex(activeIndex + 1);
      if (swiperRef.current) {
        swiperRef.current.scrollLeft += (itemWidth + gap);
      }
    }
  };

  const handleDriverClick = (driver: Driver, index: number) => {
    setSelectedDriver(driver);
    setActiveIndex(index);
  };

  const getChartOptions = () => {
    if (!selectedDriver) return {};

    const driverNames = drivers.map(d => d.name);
    const pointsData = drivers.map(d => d.points);
    const winsData = drivers.map(d => d.wins);
    const podiumsData = drivers.map(d => d.podiums);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Points', 'Wins', 'Podiums'],
        textStyle: {
          color: theme === 'dark' ? '#fff' : '#333'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: driverNames,
        axisLabel: {
          color: theme === 'dark' ? '#fff' : '#333',
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: theme === 'dark' ? '#fff' : '#333'
        }
      },
      series: [
        {
          name: 'Points',
          type: 'bar',
          data: pointsData,
          color: '#e10600'
        },
        {
          name: 'Wins',
          type: 'bar',
          data: winsData,
          color: '#0600e1'
        },
        {
          name: 'Podiums',
          type: 'bar',
          data: podiumsData,
          color: '#00e106'
        }
      ]
    };
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen pt-16 theme-transition`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Driver Statistics</h1>
        
        {/* Driver Carousel */}
        <div className="relative mb-12">
          <button 
            onClick={handlePrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-md ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'}`}
            disabled={activeIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>
          
          <div 
            ref={swiperRef}
            className="flex overflow-x-auto gap-5 py-4 px-10 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {drivers.map((driver, index) => (
              <div 
                key={driver.id}
                className={`flex-shrink-0 w-[280px] rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform duration-300 ${
                  activeIndex === index ? 'scale-105 border-2 border-red-600' : ''
                } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                onClick={() => handleDriverClick(driver, index)}
              >
                <img 
                  src={driver.image} 
                  alt={driver.name} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{driver.name}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {driver.team}
                  </p>
                  <div className="mt-2 flex justify-between">
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Number
                      </p>
                      <p className="font-bold text-lg">{driver.number}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Points
                      </p>
                      <p className="font-bold text-lg">{driver.points}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-md ${activeIndex === drivers.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'}`}
            disabled={activeIndex === drivers.length - 1}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        {/* Selected Driver Stats */}
        {selectedDriver && (
          <div className={`rounded-lg shadow-lg overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <img 
                    src={selectedDriver.image} 
                    alt={selectedDriver.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Team
                      </p>
                      <p className="font-medium">{selectedDriver.team}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Number
                      </p>
                      <p className="font-medium">{selectedDriver.number}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Points
                      </p>
                      <p className="font-medium">{selectedDriver.points}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Wins
                      </p>
                      <p className="font-medium">{selectedDriver.wins}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Podiums
                      </p>
                      <p className="font-medium">{selectedDriver.podiums}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Fastest Laps
                      </p>
                      <p className="font-medium">{selectedDriver.fastestLaps}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold mb-6">{selectedDriver.name} - 2024 Season Performance</h2>
                  
                  <div className="h-[400px]">
                    <ReactECharts 
                      option={getChartOptions()} 
                      style={{ height: '100%', width: '100%' }}
                      theme={theme === 'dark' ? 'dark' : ''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverStatsPage;