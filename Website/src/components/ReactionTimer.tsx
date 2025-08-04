import { useState, useEffect } from 'react';

const ReactionTimer = () => {
    const [lights, setLights] = useState([false, false, false, false, false]);
    const [gameStarted, setGameStarted] = useState(false);
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [readyToReact, setReadyToReact] = useState(false);
    const [earlyPress, setEarlyPress] = useState(false);

    useEffect(() => {
        if (gameStarted) {
            setLights([false, false, false, false, false]);
            setReactionTime(null);
            setStartTime(null);
            setReadyToReact(false);
            setEarlyPress(false);

            let delay = 1000; // Delay between each light blink
            lights.forEach((_, index) => {
                setTimeout(() => {
                    setLights(prev => {
                        const newLights = [...prev];
                        newLights[index] = true;
                        return newLights;
                    });

                    // When all lights are on, wait 1-2 seconds and then turn them off
                    if (index === lights.length - 1) {
                        const randomDelay = Math.random() * 1000 + 1000; // Random delay between 1-2 seconds
                        setTimeout(() => {
                            setLights([false, false, false, false, false]); // Turn off all lights
                            setStartTime(Date.now()); // Start the clock
                            setReadyToReact(true); // Allow the user to react
                        }, randomDelay);
                    }
                }, delay * (index + 1));
            });
        }
    }, [gameStarted]);

    const handleReaction = () => {
        if (!readyToReact && gameStarted) {
            setEarlyPress(true);
            setGameStarted(false);
        } else if (readyToReact && startTime) {
            const endTime = Date.now();
            setReactionTime(endTime - startTime);
            setReadyToReact(false);
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Enter') {
                handleReaction();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [readyToReact, startTime, gameStarted]);

    const startGame = () => {
        setGameStarted(true);
        setReactionTime(null); // Reset reaction time
        setStartTime(null); // Reset start time
        setReadyToReact(false); // Reset readyToReact
        setEarlyPress(false); // Reset earlyPress
    };

    const getReactionMessage = () => {
        if (reactionTime === null) return "";
        if (reactionTime <= 200) return "Woahhh! Your fingers are lightning fast! ⚡";
        if (reactionTime <= 500) return "Great reflexes! 🏎️";
        if (reactionTime <= 800) return "Not bad! Keep practicing. 🚀";
        return "Too slow... even turtles are faster than this. 🐢";
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 tracking-widest text-red-500 text-center">
                Formula 1 Reaction Timer
            </h1>
            <div className="flex gap-2 md:gap-4 mb-4">
                {lights.map((light, index) => (
                    <div
                        key={index}
                        className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 ease-in-out ${
                            light ? 'bg-red-600 border-red-800 scale-110' : 'bg-gray-400 border-gray-500'
                        }`}
                    />
                ))}
            </div>
            {!gameStarted && !reactionTime && !earlyPress ? (
                <button 
                    onClick={startGame}
                    className="px-4 py-2 md:px-6 md:py-3 bg-green-600 rounded-lg shadow-md hover:bg-green-500 transition-all duration-200 text-sm md:text-base font-semibold transform hover:scale-105 active:scale-95">
                    Start Game
                </button>
            ) : earlyPress ? (
                <div className="text-sm md:text-base mt-4 text-red-500 text-center">
                    You pressed too early! Retry again. ⏪
                    <button 
                        onClick={startGame}
                        className="mt-4 px-4 py-2 md:px-6 md:py-3 bg-yellow-500 rounded-lg shadow-md hover:bg-yellow-400 transition-all duration-200 text-sm md:text-base font-semibold transform hover:scale-105 active:scale-95">
                        Restart
                    </button>
                </div>
            ) : reactionTime !== null ? (
                <div className="text-sm md:text-base mt-4 text-center">
                    Your Reaction Time: <span className="font-bold text-yellow-300">{reactionTime} ms</span>
                    <div className="mt-2 text-green-400 font-medium">{getReactionMessage()}</div>
                    <button 
                        onClick={startGame}
                        className="mt-4 px-4 py-2 md:px-6 md:py-3 bg-blue-600 rounded-lg shadow-md hover:bg-blue-500 transition-all duration-200 text-sm md:text-base font-semibold transform hover:scale-105 active:scale-95">
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <div className="text-sm md:text-base mt-4 text-center">
                        Press Enter or tap the button when all lights turn off!
                    </div>
                    <button
                        onClick={handleReaction}
                        className="px-4 py-2 md:px-6 md:py-3 bg-purple-600 rounded-lg shadow-md hover:bg-purple-500 transition-all duration-200 text-sm md:text-base font-semibold transform hover:scale-105 active:scale-95">
                        Tap to React
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReactionTimer;