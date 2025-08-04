import React, { useState, useEffect } from 'react';
import { Calendar, Flag, Clock, ChevronDown, ChevronRight, Award } from 'lucide-react';

interface WinnerPredictionsProps {
  theme: 'light' | 'dark';
  currentPage: string;
}

interface Prediction {
  position: number;
  driver: string;
  probability: number;
}

interface Track {
  name: string;
  country: string;
  length: number;
  corners: number;
  drsZones: number;
  lapRecord: {
    time: string;
    driver: string;
    year: number;
  };
  image: string;
  pastWinners: {
    year: number;
    winner: string;
    team: string;
    time: string;
  }[];
}

const WinnerPredictions: React.FC<WinnerPredictionsProps> = ({ theme, currentPage }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedRace, setSelectedRace] = useState<string>('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTracks, setIsLoadingTracks] = useState<boolean>(true);

  useEffect(() => {
    const fetchTracks = async () => {
  try {
    const response = await fetch('/api/tracks');
    const data = await response.json();
    setTracks(data);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    // Fallback to default tracks with past winners data
    setTracks([
      {
        name: 'Bahrain GP',
        country: 'Bahrain',
        length: 5.412,
        corners: 15,
        drsZones: 3,
        lapRecord: {
          time: '1:31.447',
          driver: 'Pedro de la Rosa',
          year: 2005
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:31:44.742' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:33:56.736' },
          { year: 2022, winner: 'Charles Leclerc', team: 'Ferrari', time: '1:37:33.584' },
          { year: 2021, winner: 'Lewis Hamilton', team: 'Mercedes', time: '1:32:03.897' }
        ]
      },
      {
        name: 'Saudi Arabian Grand Prix',
        country: 'Saudi Arabia',
        length: 6.174,
        corners: 27,
        drsZones: 3,
        lapRecord: {
          time: '1:28.049',
          driver: 'Lewis Hamilton',
          year: 2021
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:20:43.273' },
          { year: 2023, winner: 'Sergio Perez', team: 'Red Bull Racing Honda RBPT', time: '1:21:14.894' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:24:19.293' }
        ]
      },
      {
        name: 'Australian GP',
        country: 'Australia',
        length: 5.303,
        corners: 16,
        drsZones: 2,
        lapRecord: {
          time: '1:24.125',
          driver: 'Michael Schumacher',
          year: 2004
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Carlos Sainz', team: 'Ferrari', time: '1:20:26.843' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '2:32:38.371' },
          { year: 2022, winner: 'Charles Leclerc', team: 'Ferrari', time: '1:27:46.548' }
        ]
      },
      {
        name: 'Japanese GP',
        country: 'Japan',
        length: 5.807,
        corners: 18,
        drsZones: 1,
        lapRecord: {
          time: '1:30.983',
          driver: 'Lewis Hamilton',
          year: 2019
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:54:23.566' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:30:58.421' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '3:01:44.004' }
        ]
      },
      {
        name: 'Chinese GP',
        country: 'China',
        length: 5.451,
        corners: 16,
        drsZones: 2,
        lapRecord: {
          time: '1:31.095',
          driver: 'Michael Schumacher',
          year: 2004
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/China_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:40:52.554' },
          { year: 2019, winner: 'Lewis Hamilton', team: 'Mercedes', time: '1:32:06.350' }
        ]
      },
      {
        name: 'Miami Grand Prix',
        country: 'United States',
        length: 5.412,
        corners: 19,
        drsZones: 1,
        lapRecord: {
          time: '1:29.708',
          driver: 'Max Verstappen',
          year: 2023
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Lando Norris', team: 'McLaren Mercedes', time: '1:30:49.876' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:27:38.241' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:34:24.258' }
        ]
      },
      {
        name: 'Emilia Romagna Grand Prix',
        country: 'Italy',
        length: 4.909,
        corners: 19,
        drsZones: 1,
        lapRecord: {
          time: '1:15.484',
          driver: 'Lewis Hamilton',
          year: 2020
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:25:25.252' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:32:07.986' },
          { year: 2021, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '2:02:34.598' }
        ]
      },
      {
        name: 'Monaco GP',
        country: 'Monaco',
        length: 3.337,
        corners: 19,
        drsZones: 1,
        lapRecord: {
          time: '1:12.909',
          driver: 'Lewis Hamilton',
          year: 2021
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Charles Leclerc', team: 'Ferrari', time: '2:23:15.554' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:48:51.980' },
          { year: 2022, winner: 'Sergio Perez', team: 'Red Bull Racing Honda RBPT', time: '1:56:30.265' }
        ]
      },
      {
        name: 'Spanish GP',
        country: 'Spain',
        length: 4.655,
        corners: 16,
        drsZones: 2,
        lapRecord: {
          time: '1:18.149',
          driver: 'Valtteri Bottas',
          year: 2020
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Spain_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:28:20.227' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:27:57.940' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:37:20.475' }
        ]
      },
      {
        name: 'Canadian GP',
        country: 'Canada',
        length: 4.361,
        corners: 14,
        drsZones: 2,
        lapRecord: {
          time: '1:13.078',
          driver: 'Valtteri Bottas',
          year: 2019
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Canada_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:45:47.927' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:33:58.348' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:36:21.757' }
        ]
      },
      {
        name: 'Austrian GP',
        country: 'Austria',
        length: 4.318,
        corners: 10,
        drsZones: 3,
        lapRecord: {
          time: '1:05.619',
          driver: 'Carlos Sainz',
          year: 2020
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'George Russell', team: 'Mercedes', time: '1:24:22.798' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:25:33.607' },
          { year: 2022, winner: 'Charles Leclerc', team: 'Ferrari', time: '1:24:24.312' }
        ]
      },
      {
        name: 'British GP',
        country: 'United Kingdom',
        length: 5.891,
        corners: 18,
        drsZones: 2,
        lapRecord: {
          time: '1:27.097',
          driver: 'Max Verstappen',
          year: 2020
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Lewis Hamilton', team: 'Mercedes', time: '1:22:27.059' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:25:16.938' },
          { year: 2022, winner: 'Carlos Sainz', team: 'Ferrari', time: '2:17:50.311' }
        ]
      },
      {
        name: 'Hungarian GP',
        country: 'Hungary',
        length: 4.381,
        corners: 14,
        drsZones: 1,
        lapRecord: {
          time: '1:16.627',
          driver: 'Lewis Hamilton',
          year: 2020
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Hungary_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Oscar Piastri', team: 'McLaren Mercedes', time: '1:38:01.989' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:38:08.634' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:39:35.912' }
        ]
      },
      {
        name: 'Belgian GP',
        country: 'Belgium',
        length: 7.004,
        corners: 19,
        drsZones: 2,
        lapRecord: {
          time: '1:46.286',
          driver: 'Valtteri Bottas',
          year: 2018
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Belgium_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Lewis Hamilton', team: 'Mercedes', time: '1:19:57.566' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:22:30.450' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:25:52.894' }
        ]
      },
      {
        name: 'Dutch Grand Prix',
        country: 'Netherlands',
        length: 4.259,
        corners: 14,
        drsZones: 2,
        lapRecord: {
          time: '1:11.097',
          driver: 'Lewis Hamilton',
          year: 2021
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Netherlands_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Lando Norris', team: 'McLaren Mercedes', time: '1:30:45.519' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '2:24:04.411' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:36:42.773' }
        ]
      },
      {
        name: 'Italian GP',
        country: 'Italy',
        length: 5.793,
        corners: 11,
        drsZones: 2,
        lapRecord: {
          time: '1:21.046',
          driver: 'Rubens Barrichello',
          year: 2004
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Italy_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Charles Leclerc', team: 'Ferrari', time: '1:14:40.727' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:13:41.143' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:20:27.511' }
        ]
      },
      {
        name: 'Azerbaijan GP',
        country: 'Azerbaijan',
        length: 6.003,
        corners: 20,
        drsZones: 2,
        lapRecord: {
          time: '1:43.009',
          driver: 'Charles Leclerc',
          year: 2019
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Azerbaijan_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Oscar Piastri', team: 'McLaren Mercedes', time: '1:32:58.007' },
          { year: 2023, winner: 'Sergio Perez', team: 'Red Bull Racing Honda RBPT', time: '1:32:42.436' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:34:05.941' }
        ]
      },
      {
        name: 'Singapore GP',
        country: 'Singapore',
        length: 5.063,
        corners: 23,
        drsZones: 2,
        lapRecord: {
          time: '1:41.905',
          driver: 'Lewis Hamilton',
          year: 2018
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Lando Norris', team: 'McLaren Mercedes', time: '1:40:52.571' },
          { year: 2023, winner: 'Carlos Sainz', team: 'Ferrari', time: '1:46:37.418' },
          { year: 2022, winner: 'Sergio Perez', team: 'Red Bull Racing Honda RBPT', time: '2:02:20.238' }
        ]
      },
      {
        name: 'United States GP',
        country: 'United States',
        length: 5.513,
        corners: 20,
        drsZones: 2,
        lapRecord: {
          time: '1:36.169',
          driver: 'Charles Leclerc',
          year: 2019
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/United_States_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Charles Leclerc', team: 'Ferrari', time: '1:35:09.639' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:35:21.362' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:42:11.687' }
        ]
      },
      {
        name: 'Mexican GP',
        country: 'Mexico',
        length: 4.304,
        corners: 17,
        drsZones: 2,
        lapRecord: {
          time: '1:18.741',
          driver: 'Valtteri Bottas',
          year: 2018
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Mexico_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Carlos Sainz', team: 'Ferrari', time: '1:40:55.800' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '2:02:30.814' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:38:36.729' }
        ]
      },
      {
        name: 'Brazilian GP',
        country: 'Brazil',
        length: 4.309,
        corners: 15,
        drsZones: 2,
        lapRecord: {
          time: '1:10.540',
          driver: 'Lewis Hamilton',
          year: 2018
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Brazil_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '2:06:54.430' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:56:48.894' },
          { year: 2022, winner: 'George Russell', team: 'Mercedes', time: '1:38:34.044' }
        ]
      },
      {
        name: 'Las Vegas GP',
        country: 'United States',
        length: 6.201,
        corners: 17,
        drsZones: 2,
        lapRecord: {
          time: '1:35.490',
          driver: 'Charles Leclerc',
          year: 2023
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Las_Vegas_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'George Russell', team: 'Mercedes', time: '1:22:05.969' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:29:08.289' }
        ]
      },
      {
        name: 'Qatar Grand Prix',
        country: 'Qatar',
        length: 5.380,
        corners: 16,
        drsZones: 1,
        lapRecord: {
          time: '1:23.196',
          driver: 'Max Verstappen',
          year: 2023
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Qatar_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:31:05.323' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:27:39.168' },
          { year: 2021, winner: 'Lewis Hamilton', team: 'Mercedes', time: '1:24:28.471' }
        ]
      },
      {
        name: 'Abu Dhabi GP',
        country: 'United Arab Emirates',
        length: 5.554,
        corners: 21,
        drsZones: 2,
        lapRecord: {
          time: '1:39.283',
          driver: 'Lewis Hamilton',
          year: 2019
        },
        image: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Abu_Dhabi_Circuit.png.transform/8col/image.png',
        pastWinners: [
          { year: 2024, winner: 'Lando Norris', team: 'McLaren Mercedes', time: '1:26:33.291' },
          { year: 2023, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:27:02.624' },
          { year: 2022, winner: 'Max Verstappen', team: 'Red Bull Racing Honda RBPT', time: '1:27:45.914' }
        ]
      }
    ]);
  } finally {
    setIsLoadingTracks(false);
  }
};

    fetchTracks();
  }, []);

  const predictQ3 = async () => {
    if (!selectedRace) return;
    
    setIsLoading(true);
    setPredictions([]);
    
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ race: selectedRace })
      });
      
      if (!response.ok) throw new Error('Prediction failed');
      
      const data = await response.json();
      setPredictions(data.predictions);
    } catch (error) {
      console.error('Prediction error:', error);
      // Mock fallback data
      setPredictions([
        { position: 1, driver: 'Max Verstappen', probability: 0.92 },
        { position: 2, driver: 'Lewis Hamilton', probability: 0.87 },
        { position: 3, driver: 'Charles Leclerc', probability: 0.85 },
        { position: 4, driver: 'Sergio Perez', probability: 0.80 },
        { position: 5, driver: 'Carlos Sainz', probability: 0.78 },
        { position: 6, driver: 'Lando Norris', probability: 0.75 },
        { position: 7, driver: 'George Russell', probability: 0.72 },
        { position: 8, driver: 'Oscar Piastri', probability: 0.68 },
        { position: 9, driver: 'Fernando Alonso', probability: 0.65 },
        { position: 10, driver: 'Esteban Ocon', probability: 0.60 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTrack = tracks.find(track => track.name === selectedRace);

  return (
    <div id="predict" className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen pt-16 theme-transition`}>
      {/* Hero Section */}
      <div className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Q3 Qualifying Predictions</h1>
            <p className="text-xl md:text-2xl mb-8">
              AI-powered predictions for Formula 1 qualifying sessions
            </p>
          </div>
        </div>
      </div>

      {/* Prediction Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} shadow-lg`}>
            <h2 className="text-2xl font-bold mb-6">Qualifying Prediction</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Grand Prix
                </label>
                <div className="relative">
                  {isLoadingTracks ? (
                    <div className="animate-pulse h-12 rounded-md bg-gray-300 dark:bg-gray-600"></div>
                  ) : (
                    <>
                      <select
                        value={selectedRace}
                        onChange={(e) => setSelectedRace(e.target.value)}
                        className={`w-full p-3 rounded-md border ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        } appearance-none pr-10`}
                      >
                        <option value="">Select a race</option>
                        {tracks.map((track) => (
                          <option key={track.name} value={track.name}>{track.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <ChevronDown size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-auto">
                <button
                  onClick={predictQ3}
                  disabled={!selectedRace || isLoading}
                  className={`px-6 py-3 rounded-md font-medium transition duration-200 ${
                    !selectedRace || isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isLoading ? 'Predicting...' : 'Predict Q3 Results'}
                </button>
              </div>
            </div>

            {predictions.length > 0 && (
              <div className={`p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              } shadow-md border-l-4 border-red-600 mb-8`}>
                <div className="flex items-start">
                  <Award size={32} className="text-red-600 mr-4 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-4">Predicted Q3 Qualifying Results for {selectedRace}</h3>
                    <div className="space-y-3">
                      {predictions.map((pred) => (
                        <div key={pred.position} className="flex items-center justify-between">
                          <div className="flex items-center w-48">
                            <span className="w-8 text-right mr-4 font-medium">{pred.position}.</span>
                            <span className="font-medium truncate">{pred.driver}</span>
                          </div>
                          <div className="flex items-center flex-1 max-w-md">
                            <div className={`w-full mr-4 h-2 rounded-full ${
                              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                            }`}>
                              <div 
                                className="bg-red-600 h-2 rounded-full" 
                                style={{ width: `${pred.probability * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {(pred.probability * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className={`text-sm mt-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Probability estimates based on historical qualifying performance and current form
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historical Data Section */}
      {selectedTrack && (
        <div className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Historical Data: {selectedTrack.name}</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className={`rounded-lg overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                } shadow-lg`}>
                  <img 
                    src={selectedTrack.image} 
                    alt={selectedTrack.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Circuit Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>Circuit Length</p>
                        <p className="font-medium">{selectedTrack.length} km</p>
                      </div>
                      <div>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>Corners</p>
                        <p className="font-medium">{selectedTrack.corners}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>DRS Zones</p>
                        <p className="font-medium">{selectedTrack.drsZones}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>Lap Record</p>
                        <p className="font-medium">
                          {selectedTrack.lapRecord.time} ({selectedTrack.lapRecord.driver}, {selectedTrack.lapRecord.year})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Recent Winners</h3>
                <div className="space-y-4">
                  {selectedTrack.pastWinners.map((winner, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                      } shadow-md`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-semibold">{winner.winner}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>{winner.team}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium flex items-center">
                            <Flag size={16} className="mr-1" />
                            {winner.year}
                          </p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          } flex items-center`}>
                            <Clock size={14} className="mr-1" />
                            {winner.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinnerPredictions;