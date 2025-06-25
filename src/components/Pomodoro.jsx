import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Settings, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import '../styles/index.css'; 
import '../styles/tech.css'; 

export default function Pomodoro() {
    // State for the current mode: 'work', 'shortBreak', or 'longBreak'
    const [mode, setMode] = useState('work');

    // Tracks whether the timer is currently running
    const [isActive, setIsActive] = useState(false);

    // Countdown in seconds
    const [secondsLeft, setSecondsLeft] = useState(1500);

    // Number of completed work sessions
    const [sessions, setSessions] = useState(0);

    // Controls whether the alarm sound plays
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Toggles visibility of the settings panel
    const [showSettings, setShowSettings] = useState(false);

    // Optional dark mode toggle
    const [darkMode, setDarkMode] = useState(false);

    // Duration settings (in minutes)
    const [workDuration, setWorkDuration] = useState(25);
    const [shortBreakDuration, setShortBreakDuration] = useState(5);
    const [longBreakDuration, setLongBreakDuration] = useState(15);
    const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);

    // References to track timing and sound
    const startTimeRef = useRef(null);
    const initialDurationRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        let interval = null;
        
        if (isActive) {
            // Set start time and total countdown only when timer starts
            if (!startTimeRef.current) {
                startTimeRef.current = Date.now();
                initialDurationRef.current = secondsLeft;
            }

            interval = setInterval(() => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTimeRef.current) / 1000);
                const remaining = Math.max(0, initialDurationRef.current - elapsed);

                setSecondsLeft(remaining);

                if (remaining === 0) {
                    // Timer ends — switch mode, optionally play sound
                    clearInterval(interval);
                    setIsActive(false);
                    startTimeRef.current = null;
                    initialDurationRef.current = null;

                    if (soundEnabled && audioRef.current) {
                        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
                    }

                    // Cycle through work and breaks
                    if (mode === 'work') {
                        const nextSession = sessions + 1;
                        setSessions(nextSession);
                        if (nextSession % sessionsBeforeLongBreak === 0) {
                            setMode('longBreak');
                            setSecondsLeft(longBreakDuration * 60);
                        } else {
                            setMode('shortBreak');
                            setSecondsLeft(shortBreakDuration * 60);
                        }
                    } else {
                        setMode('work');
                        setSecondsLeft(workDuration * 60);
                    }
                }
            }, 100); // Small interval for smoother updates
        } else {
            clearInterval(interval);
            // Pause resets timestamp tracking
            startTimeRef.current = null;
            initialDurationRef.current = null;
        }

        return () => clearInterval(interval);
    }, [
        isActive,
        mode,
        sessions,
        shortBreakDuration,
        longBreakDuration,
        workDuration,
        sessionsBeforeLongBreak,
        soundEnabled
    ]);

    // Formats seconds into MM:SS
    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Start or pause the timer
    const toggleTimer = () => {
        if (!isActive) {
            // Reset timestamp tracking when starting
            startTimeRef.current = null;
            initialDurationRef.current = null;
        }
        setIsActive(!isActive);
    };

    // Reset timer to initial value based on current mode
    const resetTimer = () => {
        if (mode === 'work') setSecondsLeft(workDuration * 60);
        else if (mode === 'shortBreak') setSecondsLeft(shortBreakDuration * 60);
        else if (mode === 'longBreak') setSecondsLeft(longBreakDuration * 60);
        
        setIsActive(false);
        startTimeRef.current = null;
        initialDurationRef.current = null;
    };

    // Mute/unmute end-of-session alarm
    const toggleSound = () => setSoundEnabled(!soundEnabled);

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: darkMode 
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 100%)',
            transition: 'all 0.3s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        card: {
            background: darkMode ? '#2d2d2d' : '#e8eaf6',
            borderRadius: '2rem',
            padding: '3rem',
            width: '100%',
            maxWidth: '450px',
            position: 'relative',
            boxShadow: darkMode 
                ? `
                    20px 20px 40px #1a1a1a,
                    -20px -20px 40px #404040,
                    inset 2px 2px 4px rgba(255,255,255,0.05),
                    inset -2px -2px 4px rgba(0,0,0,0.2)
                `
                : `
                    20px 20px 40px #c8c9d4,
                    -20px -20px 40px #ffffff,
                    inset 2px 2px 4px rgba(255,255,255,0.8),
                    inset -2px -2px 4px rgba(0,0,0,0.1)
                `,
            transition: 'all 0.3s ease'
        },
        themeToggle: {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: darkMode ? '#2d2d2d' : '#e8eaf6',
            color: darkMode ? '#ffd700' : '#6366f1',
            boxShadow: darkMode 
                ? `
                    8px 8px 16px #1a1a1a,
                    -8px -8px 16px #404040
                `
                : `
                    8px 8px 16px #c8c9d4,
                    -8px -8px 16px #ffffff
                `,
            transition: 'all 0.2s ease'
        },
        display: {
            textAlign: 'center',
            marginBottom: '2rem'
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: darkMode ? '#e0e0e0' : '#4a5568',
            transition: 'color 0.3s ease'
        },
        timer: {
            fontSize: '4rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: darkMode ? '#ffffff' : '#2d3748',
            fontFeatureSettings: '"tnum"',
            letterSpacing: '-0.02em',
            transition: 'color 0.3s ease'
        },
        sessionInfo: {
            fontSize: '0.9rem',
            color: darkMode ? '#a0a0a0' : '#718096',
            transition: 'color 0.3s ease'
        },
        controls: {
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem'
        },
        button: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: darkMode ? '#2d2d2d' : '#e8eaf6',
            color: darkMode ? '#e0e0e0' : '#4a5568',
            boxShadow: darkMode 
                ? `
                    8px 8px 16px #1a1a1a,
                    -8px -8px 16px #404040
                `
                : `
                    8px 8px 16px #c8c9d4,
                    -8px -8px 16px #ffffff
                `,
            transition: 'all 0.2s ease'
        },
        modeToggle: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            marginBottom: '2rem'
        },
        modeButton: {
            padding: '0.75rem 1rem',
            borderRadius: '1rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            background: darkMode ? '#2d2d2d' : '#e8eaf6',
            color: darkMode ? '#a0a0a0' : '#718096',
            boxShadow: darkMode 
                ? `
                    6px 6px 12px #1a1a1a,
                    -6px -6px 12px #404040
                `
                : `
                    6px 6px 12px #c8c9d4,
                    -6px -6px 12px #ffffff
                `,
            transition: 'all 0.2s ease'
        },
        modeButtonActive: {
            background: darkMode ? '#404040' : '#d1d5db',
            color: darkMode ? '#ffffff' : '#1f2937',
            boxShadow: darkMode 
                ? `
                    inset 4px 4px 8px #1a1a1a,
                    inset -4px -4px 8px #525252
                `
                : `
                    inset 4px 4px 8px #b8bcc4,
                    inset -4px -4px 8px #eaecf0
                `
        },
        settings: {
            background: darkMode ? '#404040' : '#d1d5db',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: darkMode 
                ? `
                    inset 8px 8px 16px #2a2a2a,
                    inset -8px -8px 16px #525252
                `
                : `
                    inset 8px 8px 16px #b8bcc4,
                    inset -8px -8px 16px #eaecf0
                `
        },
        settingsTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: darkMode ? '#e0e0e0' : '#374151',
            textAlign: 'center'
        },
        settingsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        },
        label: {
            fontSize: '0.9rem',
            fontWeight: '500',
            color: darkMode ? '#c0c0c0' : '#4a5568'
        },
        sliderContainer: {
            position: 'relative',
            height: '40px',
            display: 'flex',
            alignItems: 'center'
        },
        slider: {
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: darkMode 
                ? 'linear-gradient(90deg, #1a1a1a 0%, #525252 100%)'
                : 'linear-gradient(90deg, #b8bcc4 0%, #eaecf0 100%)',
            outline: 'none',
            border: 'none',
            cursor: 'pointer',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none'
        },
        sliderThumb: {
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: darkMode ? '#404040' : '#e8eaf6',
            cursor: 'pointer',
            boxShadow: darkMode 
                ? `
                    4px 4px 8px #1a1a1a,
                    -4px -4px 8px #525252
                `
                : `
                    4px 4px 8px #c8c9d4,
                    -4px -4px 8px #ffffff
                `,
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none'
        },
        sliderValue: {
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.8rem',
            fontWeight: '600',
            color: darkMode ? '#e0e0e0' : '#4a5568',
            background: darkMode ? '#2d2d2d' : '#e8eaf6',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.5rem',
            minWidth: '35px',
            textAlign: 'center',
            boxShadow: darkMode 
                ? `
                    3px 3px 6px #1a1a1a,
                    -3px -3px 6px #404040
                `
                : `
                    3px 3px 6px #c8c9d4,
                    -3px -3px 6px #ffffff
                `
        }
    };
    // CSS for slider webkit styling
    const sliderStyles = `
        .neu-slider::-webkit-slider-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${darkMode ? '#404040' : '#e8eaf6'};
            cursor: pointer;
            box-shadow: ${darkMode 
                ? '4px 4px 8px #1a1a1a, -4px -4px 8px #525252'
                : '4px 4px 8px #c8c9d4, -4px -4px 8px #ffffff'};
            -webkit-appearance: none;
            appearance: none;
        }
        
        .neu-slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${darkMode ? '#404040' : '#e8eaf6'};
            cursor: pointer;
            box-shadow: ${darkMode 
                ? '4px 4px 8px #1a1a1a, -4px -4px 8px #525252'
                : '4px 4px 8px #c8c9d4, -4px -4px 8px #ffffff'};
            border: none;
        }
    `;

    return (
        <>
            <style>{sliderStyles}</style>
            <div style={styles.container}>
                <audio ref={audioRef} src="../../assets/music/Rooster.wav" preload="auto" />
                <div style={styles.card}>
                    <button 
                        style={styles.themeToggle}
                        onClick={() => setDarkMode(!darkMode)}
                        onMouseDown={(e) => {
                            e.target.style.transform = 'scale(0.95)';
                        }}
                        onMouseUp={(e) => {
                            e.target.style.transform = 'scale(1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                    </button>

                    <div style={styles.display}>
                        <h2 style={styles.title}>
                            {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                        </h2>
                        <div style={styles.timer}>{formatTime(secondsLeft)}</div>
                        <div style={styles.sessionInfo}>
                            Session {sessions + 1} • {sessionsBeforeLongBreak - (sessions % sessionsBeforeLongBreak)} until long break
                        </div>
                    </div>

                    <div style={styles.controls}>
                        {[
                            { onClick: toggleTimer, icon: isActive ? <Pause size={20} /> : <Play size={20} /> },
                            { onClick: resetTimer, icon: <Square size={20} /> },
                            { onClick: () => setShowSettings(!showSettings), icon: <Settings size={20} /> },
                            { onClick: toggleSound, icon: soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} /> }
                        ].map((btn, idx) => (
                            <button
                                key={idx}
                                onClick={btn.onClick}
                                style={styles.button}
                                onMouseDown={(e) => {
                                    e.target.style.transform = 'scale(0.95)';
                                    e.target.style.boxShadow = darkMode 
                                        ? 'inset 4px 4px 8px #1a1a1a, inset -4px -4px 8px #404040'
                                        : 'inset 4px 4px 8px #c8c9d4, inset -4px -4px 8px #ffffff';
                                }}
                                onMouseUp={(e) => {
                                    e.target.style.transform = 'scale(1)';
                                    e.target.style.boxShadow = darkMode 
                                        ? '8px 8px 16px #1a1a1a, -8px -8px 16px #404040'
                                        : '8px 8px 16px #c8c9d4, -8px -8px 16px #ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)';
                                    e.target.style.boxShadow = darkMode 
                                        ? '8px 8px 16px #1a1a1a, -8px -8px 16px #404040'
                                        : '8px 8px 16px #c8c9d4, -8px -8px 16px #ffffff';
                                }}
                            >
                                {btn.icon}
                            </button>
                        ))}
                    </div>

                    <div style={styles.modeToggle}>
                        {[
                            { mode: 'work', label: 'Focus', duration: workDuration },
                            { mode: 'shortBreak', label: 'Short Break', duration: shortBreakDuration },
                            { mode: 'longBreak', label: 'Long Break', duration: longBreakDuration }
                        ].map((btn) => (
                            <button
                                key={btn.mode}
                                onClick={() => { 
                                    setMode(btn.mode); 
                                    setIsActive(false); 
                                    setSecondsLeft(btn.duration * 60); 
                                }}
                                style={{
                                    ...styles.modeButton,
                                    ...(mode === btn.mode ? styles.modeButtonActive : {})
                                }}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    {showSettings && (
                        <div style={styles.settings}>
                            <h3 style={styles.settingsTitle}>Timer Settings</h3>
                            <div style={styles.settingsGrid}>
                                {[
                                    { label: 'Focus Time', value: workDuration, setter: setWorkDuration, max: 60 },
                                    { label: 'Short Break', value: shortBreakDuration, setter: setShortBreakDuration, max: 30 },
                                    { label: 'Long Break', value: longBreakDuration, setter: setLongBreakDuration, max: 60 },
                                    { label: 'Sessions Until Long', value: sessionsBeforeLongBreak, setter: setSessionsBeforeLongBreak, max: 10 }
                                ].map((setting, idx) => (
                                    <div key={idx} style={styles.inputGroup}>
                                        <label style={styles.label}>{setting.label}</label>
                                        <div style={styles.sliderContainer}>
                                            <input
                                                type="range"
                                                min="1"
                                                max={setting.max}
                                                value={setting.value}
                                                onChange={(e) => setting.setter(Number(e.target.value))}
                                                style={styles.slider}
                                                className="neu-slider"
                                            />
                                            <div style={styles.sliderValue}>
                                                {setting.value}{setting.max > 10 ? 'm' : ''}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
