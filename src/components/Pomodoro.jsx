import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Settings, Volume2, VolumeX } from 'lucide-react';
import '../index.css';
import '../output.css';

export default function Pomodoro() {
    // Timer settings
    const [workMinutes, setWorkMinutes] = useState(25);
    const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
    const [longBreakMinutes, setLongBreakMinutes] = useState(15);
    const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);

    // Timer state
    const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
    const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Audio for notifications
    const alarmSound = useRef(null);

    // Initialize alarm sound
    useEffect(() => {
        alarmSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        return () => {
            if (alarmSound.current) {
                alarmSound.current.pause();
                alarmSound.current = null;
            }
        };
    }, []);

    // Reset timer when mode changes
    useEffect(() => {
        let minutes = workMinutes;

        if (mode === 'shortBreak') {
            minutes = shortBreakMinutes;
        } else if (mode === 'longBreak') {
            minutes = longBreakMinutes;
        }

        setSecondsLeft(minutes * 60);
    }, [mode, workMinutes, shortBreakMinutes, longBreakMinutes]);

    // Timer logic
    useEffect(() => {
        let interval = null;

        if (isActive && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft(secondsLeft - 1);
            }, 1000);
        } else if (isActive && secondsLeft === 0) {
            // Play sound when timer ends
            if (soundEnabled && alarmSound.current) {
                alarmSound.current.play();
            }

            // Cycle through modes
            if (mode === 'work') {
                const completedSessions = sessions + 1;
                setSessions(completedSessions);

                if (completedSessions % sessionsBeforeLongBreak === 0) {
                    setMode('longBreak');
                } else {
                    setMode('shortBreak');
                }
            } else {
                setMode('work');
            }

            setIsActive(false);
        }

        return () => clearInterval(interval);
    }, [isActive, secondsLeft, mode, sessions, sessionsBeforeLongBreak, soundEnabled]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Toggle timer state
    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    // Reset timer
    const resetTimer = () => {
        setIsActive(false);
        setMode('work');
        setSessions(0);
        setSecondsLeft(workMinutes * 60);
    };

    // Toggle sound
    const toggleSound = () => {
        setSoundEnabled(!soundEnabled);
    };

    return (
        <div className="timer-root">
            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-white">
                {/* Timer Display */}
                <div className="mb-8 text-center">
                    <h2 className="text-xl font-bold mb-1">
                        {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </h2>
                    <div className="text-6xl font-bold mb-4">{formatTime(secondsLeft)}</div>
                    <div className="text-sm text-gray-400">
                        Session {sessions + 1} • {sessionsBeforeLongBreak - (sessions % sessionsBeforeLongBreak)} until long break
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={toggleTimer}
                        className="bg-indigo-600 hover:bg-indigo-700 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                    >
                        {isActive ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="bg-gray-700 hover:bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                    >
                        <Square size={24} />
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="bg-gray-700 hover:bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                    >
                        <Settings size={24} />
                    </button>
                    <button
                        onClick={toggleSound}
                        className="bg-gray-700 hover:bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
                    >
                        {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                </div>

                {/* Mode Selector */}
                <div className="grid grid-cols-3 gap-2 w-full mb-6">
                    <button
                        onClick={() => { setMode('work'); setIsActive(false); }}
                        className={`py-2 px-4 rounded transition-colors ${mode === 'work' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        Focus
                    </button>
                    <button
                        onClick={() => { setMode('shortBreak'); setIsActive(false); }}
                        className={`py-2 px-4 rounded transition-colors ${mode === 'shortBreak' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        Short Break
                    </button>
                    <button
                        onClick={() => { setMode('longBreak'); setIsActive(false); }}
                        className={`py-2 px-4 rounded transition-colors ${mode === 'longBreak' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        Long Break
                    </button>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="w-full bg-gray-700 p-4 rounded-lg mb-4">
                        <h3 className="text-lg font-bold mb-3">Timer Settings</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Focus Length</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={workMinutes}
                                    onChange={(e) => setWorkMinutes(parseInt(e.target.value) || 1)}
                                    className="w-full bg-gray-800 text-white p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Short Break</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={shortBreakMinutes}
                                    onChange={(e) => setShortBreakMinutes(parseInt(e.target.value) || 1)}
                                    className="w-full bg-gray-800 text-white p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Long Break</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={longBreakMinutes}
                                    onChange={(e) => setLongBreakMinutes(parseInt(e.target.value) || 1)}
                                    className="w-full bg-gray-800 text-white p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Sessions before Long Break</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={sessionsBeforeLongBreak}
                                    onChange={(e) => setSessionsBeforeLongBreak(parseInt(e.target.value) || 1)}
                                    className="w-full bg-gray-800 text-white p-2 rounded"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}