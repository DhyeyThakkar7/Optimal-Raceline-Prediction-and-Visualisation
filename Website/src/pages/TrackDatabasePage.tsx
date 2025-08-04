import React, { useState } from 'react';
import { Search, Info, X } from 'lucide-react';
import { tracks } from '../data/tracks';
import { Track } from '../types';

interface TrackDatabasePageProps {
  theme: 'light' | 'dark';
}

const TrackDatabasePage: React.FC<TrackDatabasePageProps> = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const filteredTracks = tracks.filter(track => 
    track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen pt-16 theme-transition`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Track Database</h1>
        
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
            </div>
            <input
              type="text"
              placeholder="Search tracks by name or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700' 
                  : 'bg-white text-gray-800 placeholder-gray-400 border-gray-300'
              } border`}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map(track => (
            <div 
              key={track.id} 
              className={`rounded-lg overflow-hidden shadow card-hover cursor-pointer ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={() => setSelectedTrack(track)}
            >
              <img 
                src={track.image} 
                alt={track.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{track.name}</h3>
                <p className={`mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {track.country}
                </p>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Length
                    </p>
                    <p className="font-medium">{track.length} km</p>
                  </div>
                  <div>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Corners
                    </p>
                    <p className="font-medium">{track.corners}</p>
                  </div>
                  <div>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      DRS Zones
                    </p>
                    <p className="font-medium">{track.drsZones}</p>
                  </div>
                </div>
                
                <button 
                  className="mt-4 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 flex items-center justify-center"
                >
                  <Info size={16} className="mr-2" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
          
          {filteredTracks.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-lg">No tracks found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
        
        {/* Track Detail Modal */}
        {selectedTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div 
              className={`modal-appear w-full max-w-3xl rounded-lg shadow-xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              }`}
            >
              <img 
                src={selectedTrack.image} 
                alt={selectedTrack.name} 
                className="w-full h-64 object-cover"
              />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTrack.name}</h2>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedTrack.country}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedTrack(null)}
                    className={`p-2 rounded-full ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Length
                    </p>
                    <p className="font-medium">{selectedTrack.length} km</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Corners
                    </p>
                    <p className="font-medium">{selectedTrack.corners}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      DRS Zones
                    </p>
                    <p className="font-medium">{selectedTrack.drsZones}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Lap Record
                    </p>
                    <p className="font-medium">{selectedTrack.lapRecord.time}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedTrack.lapRecord.driver}, {selectedTrack.lapRecord.year}
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Circuit Characteristics</h3>
                  <p>
                    This circuit features a mix of high and low-speed corners, with several challenging 
                    sections that test driver skill and car setup. The track surface offers good grip 
                    in dry conditions but can be treacherous in the wet.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Strategy Notes</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Tire degradation is typically medium to high</li>
                    <li>Two pit stop strategies are most common</li>
                    <li>Overtaking is possible but challenging in sectors 1 and 3</li>
                    <li>DRS effectiveness is high on the main straight</li>
                    <li>Track evolution throughout the weekend is significant</li>
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => setSelectedTrack(null)}
                    className={`px-4 py-2 rounded ${
                      theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackDatabasePage;