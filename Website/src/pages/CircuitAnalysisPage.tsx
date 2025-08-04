import React, { useState, useRef, useEffect } from 'react';
import { Upload, Send, X, Loader } from 'lucide-react';
import { Message } from '../types';
import { tracks } from '../data/tracks'; // Import the tracks data

interface CircuitAnalysisPageProps {
  theme: 'light' | 'dark';
}

const CircuitAnalysisPage: React.FC<CircuitAnalysisPageProps> = ({ theme }) => {
  const [circuitImage, setCircuitImage] = useState<string | null>(null);
  const [selectedCircuit, setSelectedCircuit] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to Circuit Analysis! Upload a circuit image to get started, or ask me about racing strategy.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedPoints, setHighlightedPoints] = useState<{ x: number; y: number; color: string; label: string }[]>([]);
  const [trackDetails, setTrackDetails] = useState<{
    length: string;
    corners: string;
    drsZones: string;
    lapRecord: string;
    characteristics: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/api/process-circuit', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setCircuitImage(data.image_url);
        } else {
          console.error('Failed to process image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCircuitSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setSelectedCircuit(selectedName);
    const selectedTrack = tracks.find((track) => track.name === selectedName);
    if (selectedTrack) {
      setCircuitImage(selectedTrack.image);
      setTrackDetails({
        length: `${selectedTrack.length} km`,
        corners: `${selectedTrack.corners} (${selectedTrack.corners} turns)`,
        drsZones: `${selectedTrack.drsZones}`,
        lapRecord: `${selectedTrack.lapRecord.time} by ${selectedTrack.lapRecord.driver} (${selectedTrack.lapRecord.year})`,
        characteristics: "High downforce, good traction, medium tire wear", // Add more specific characteristics if available
      });
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: `It looks like you're checking out ${selectedName}. Let me know if you’d like to know more about this track. I’d be happy to help! 😊.`,
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: messages.length + 2,
          text: data.reply,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Handle highlighted points for track-related queries
        if (data.reply.includes("Locations:")) {
          const points = data.reply.split("Locations:")[1].trim().split("\n");
          const highlighted = points.map((point: string) => {
            const [x, y] = point.split(/\s+/).map(Number);
            return { x, y, color: 'red', label: 'Highlighted Point' };
          });
          setHighlightedPoints(highlighted);
        }
      } else {
        console.error('Failed to get response from Groq API');
      }
    } catch (error) {
      console.error('Error sending message to Groq API:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearCircuitImage = () => {
    setCircuitImage(null);
    setSelectedCircuit(null);
    setTrackDetails(null);
  };

  const handleCanvasClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (!circuitImage) return;

    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    try {
      const response = await fetch('http://localhost:5000/api/update-friction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ x, y, friction_value: 1.0 }), // Replace 1.0 with the desired friction value
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCircuitImage(`${circuitImage}?${Date.now()}`); // Force image reload
        }
      } else {
        console.error('Failed to update friction');
      }
    } catch (error) {
      console.error('Error updating friction:', error);
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen pt-16 theme-transition`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Circuit Analysis</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Circuit Visualization */}
          <div>
            <div className={`p-4 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h2 className="text-xl font-semibold mb-4">Circuit Visualization</h2>

              <select
                onChange={handleCircuitSelect}
                className={`w-full p-2 mb-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                }`}
              >
                <option value="">Select a circuit</option>
                {tracks.map((track) => (
                  <option key={track.id} value={track.name}>
                    {track.name}
                  </option>
                ))}
              </select>

              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader className="animate-spin text-gray-400" size={48} />
                </div>
              ) : circuitImage ? (
                <div className="relative">
                  <img
                    src={circuitImage}
                    alt="Circuit"
                    className="w-full rounded-lg cursor-pointer"
                    onClick={handleCanvasClick}
                  />
                  {highlightedPoints.map((point, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        left: `${point.x}px`,
                        top: `${point.y}px`,
                        width: '10px',
                        height: '10px',
                        backgroundColor: point.color,
                        borderRadius: '50%',
                      }}
                      title={point.label}
                    />
                  ))}
                  <button
                    onClick={clearCircuitImage}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                  } rounded-lg p-8 text-center`}
                >
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-lg font-medium">Upload Circuit Image</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Click to browse or drag and drop
                    </p>
                  </label>
                </div>
              )}
            </div>

            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h2 className="text-xl font-semibold mb-4">Circuit Details</h2>

              {trackDetails ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Circuit Length
                      </p>
                      <p className="font-medium">{trackDetails.length}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Number of Corners
                      </p>
                      <p className="font-medium">{trackDetails.corners}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        DRS Zones
                      </p>
                      <p className="font-medium">{trackDetails.drsZones}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Lap Record
                      </p>
                      <p className="font-medium">{trackDetails.lapRecord}</p>
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Key Characteristics
                    </p>
                    <p className="font-medium">{trackDetails.characteristics}</p>
                  </div>
                </div>
              ) : (
                <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Upload a circuit image or select a track to view details
                </p>
              )}
            </div>
          </div>

          {/* AI Strategy Assistant */}
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} flex flex-col h-[600px]`}>
            <h2 className="text-xl font-semibold mb-4">AI Strategy Assistant</h2>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.sender === 'user'
                      ? 'ml-auto bg-red-600 text-white'
                      : `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-red-200'
                        : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about racing strategy..."
                className={`flex-1 p-3 rounded-l-lg resize-none ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                    : 'bg-white text-gray-800 placeholder-gray-400 border-gray-300'
                } border`}
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                className="bg-red-600 text-white p-3 rounded-r-lg hover:bg-red-700"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircuitAnalysisPage;