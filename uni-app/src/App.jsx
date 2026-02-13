// •UNI• v3 — Main Application
// CGEI Emotional Atmosphere Engine
// State flow: Welcome → Auth → Pairing → Onboarding → Chat

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Pairing from './pages/Pairing';
import Chat from './pages/Chat';
import BellOnboarding from './components/BellOnboarding';
import AtmosphereCanvas from './components/AtmosphereCanvas';
import BellDot from './components/BellDot';
import { hasSeenOnboarding } from './lib/onboarding';

export default function App() {
    const [view, setView] = useState('loading');
    const [user, setUser] = useState(null);
    const [userData, setOrderedUserData] = useState(null);
    const [roomId, setRoomId] = useState(null);

    // CGEI Atmosphere state
    const [mood, setMood] = useState('neutral');
    const [intensity, setIntensity] = useState(0.3);
    const [sceneColors, setSceneColors] = useState(['#0d0d18', '#0a0f1a']);
    const [bubbleEmit, setBubbleEmit] = useState(null);
    const [drawEmit, setDrawEmit] = useState(null);
    const [keywords, setKeywords] = useState(null);
    const [bubblePositions, setBubblePositions] = useState([]);
    const [bellPos, setBellPos] = useState({ x: 0, y: 0 });

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState('/wishes_in_the_wind.mp3');
    const [currentSongTitle, setCurrentSongTitle] = useState('Wishes in the Wind');
    const audioRef = React.useRef(null);

    // Global Bell Persistence State
    const [bellConfig, setBellConfig] = useState({
        state: 'idle',
        size: 56, // Doubled size influence
        sentiment: 'neutral',
        yOffset: 0 // For manual view adjustments
    });

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [wanderPos, setWanderPos] = useState({ x: 0, y: 0 });
    const targetWander = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 50,
                y: (e.clientY / window.innerHeight - 0.5) * 50
            });
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Procedural Wandering — Observing the Sanctuary
        const wanderInterval = setInterval(() => {
            targetWander.current = {
                x: (Math.random() - 0.5) * 240, // Wider left/right sweep
                y: (Math.random() - 0.5) * 80   // More vertical drift
            };
        }, 5000); // Slower, more comforting pace

        let raf;
        const frame = () => {
            setWanderPos(prev => ({
                x: prev.x + (targetWander.current.x - prev.x) * 0.015,
                y: prev.y + (targetWander.current.y - prev.y) * 0.015
            }));
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(wanderInterval);
            cancelAnimationFrame(raf);
        };
    }, []);

    const toggleAudio = useCallback(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    }, [isPlaying]);

    const playSong = useCallback((url, title, trackKeywords) => {
        if (!audioRef.current) return;
        setCurrentSong(url);
        setCurrentSongTitle(title || 'Shared Resonance');
        if (trackKeywords) setKeywords(trackKeywords);

        // Wait for next tick to ensure src is updated
        setTimeout(() => {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }, 10);
    }, []);

    // Unified mood change handler
    const handleMoodChange = useCallback((moodBundle) => {
        if (moodBundle.mood) setMood(moodBundle.mood);
        if (moodBundle.intensity !== undefined) setIntensity(moodBundle.intensity);
        if (moodBundle.sceneColors) setSceneColors(moodBundle.sceneColors);
        if (moodBundle.keywords !== undefined) setKeywords(moodBundle.keywords);
    }, []);

    const handleBubbleEmit = useCallback((emission) => {
        setBubbleEmit(emission);
    }, []);

    // Listen to Firebase auth state
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setOrderedUserData(data);
                        if (data.pairedWith && data.lastRoomId) {
                            setRoomId(data.lastRoomId);
                            if (!hasSeenOnboarding()) {
                                setView('onboarding');
                            } else {
                                setView('chat');
                            }
                        } else {
                            setView('pairing');
                        }
                    } else {
                        setView('pairing');
                    }
                } catch (err) {
                    console.error('[UNI] Auth Load Error:', err);
                    setView('error');
                }
            } else {

                setUser(null);
                setOrderedUserData(null);
                setRoomId(null);
                setView('welcome');
            }
        });
        return unsub;
    }, []);


    // Listen to user doc changes
    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setOrderedUserData(data);
                if (data.pairedWith && data.lastRoomId) {
                    setRoomId(data.lastRoomId);
                    if (view === 'pairing') {
                        if (!hasSeenOnboarding()) {
                            setView('onboarding');
                        } else {
                            setView('chat');
                        }
                    }
                }
            }
        }, (err) => {
            console.error('[UNI] User sync error:', err);
        });
        return unsub;
    }, [user, view]);

    const handleLogout = useCallback(async () => {
        await signOut(auth);
        setMood('neutral');
        setIntensity(0.3);
        setSceneColors(['#0d0d18', '#0a0f1a']);
        setView('welcome');
    }, []);

    const handlePaired = useCallback((newRoomId) => {
        setRoomId(newRoomId);
        if (!hasSeenOnboarding()) {
            setView('onboarding');
        } else {
            setView('chat');
        }
    }, []);

    const handleOnboardingComplete = useCallback(() => {
        setView('chat');
    }, []);

    if (view === 'error') {
        return (
            <div className="welcome">
                <div className="wordmark" style={{ fontSize: 24 }}>CONNECTION LOST</div>
                <p>The sanctuary is currently unstable. Please refresh.</p>
                <button className="btn btn-glass" onClick={() => window.location.reload()}>Reconnect</button>
            </div>
        );
    }


    return (
        <div className="app">
            {/* CGEI Atmosphere — always rendering */}
            <div
                className="scene-bg"
                style={{
                    '--scene-1': sceneColors[0],
                    '--scene-2': sceneColors[1],
                }}
            />

            {/* Particle weather layer (NOW GLOBAL AND INTERACTIVE) */}
            <AtmosphereCanvas
                mood={mood}
                intensity={intensity}
                keywords={keywords}
                bubbleEmit={bubbleEmit}
                drawEmit={drawEmit}
                bellPos={bellPos}
                bubblePositions={bubblePositions}
            />

            {/* Global Persistent Bell */}
            <div className="global-bell-container" style={{
                position: 'fixed',
                top: bellConfig.top || '20%',
                left: bellConfig.left || '50%',
                transform: `translate(-50%, -50%) translate(${mousePos.x + wanderPos.x}px, ${mousePos.y + wanderPos.y}px)`,
                zIndex: 50,
                pointerEvents: 'none',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <BellDot state={bellConfig.state} size={bellConfig.size} sentiment={bellConfig.sentiment || mood} />
                <span className="ethereal-text" style={{ marginTop: -2 }}>Bell</span>
            </div>

            {/* Views */}
            {view === 'loading' && (
                <div className="welcome">
                    <div className="spinner" />
                </div>
            )}

            {view === 'welcome' && (
                <Welcome
                    onGetStarted={() => setView('auth')}
                    onMoodChange={handleMoodChange}
                    isPlaying={isPlaying}
                    onToggleAudio={toggleAudio}
                    setBellConfig={setBellConfig}
                />
            )}

            {view === 'auth' && (
                <Auth
                    onBack={() => setView('welcome')}
                    onAuthed={() => setView('pairing')}
                    setBellConfig={setBellConfig}
                />
            )}

            {view === 'pairing' && (
                <Pairing
                    user={user}
                    onPaired={handlePaired}
                    onLogout={handleLogout}
                    isPlaying={isPlaying}
                    onToggleAudio={toggleAudio}
                    setBellConfig={setBellConfig}
                />
            )}

            {view === 'onboarding' && (
                <BellOnboarding
                    onComplete={handleOnboardingComplete}
                    onSceneChange={setSceneColors}
                    setBellConfig={setBellConfig}
                />
            )}

            {view === 'chat' && roomId && (
                <Chat
                    user={user}
                    userData={userData}
                    roomId={roomId}
                    onMoodChange={handleMoodChange}
                    onBubbleEmit={handleBubbleEmit}
                    onSceneChange={setSceneColors}
                    onUnpair={() => setView('pairing')}
                    onLogout={handleLogout}
                    isPlaying={isPlaying}
                    onToggleAudio={toggleAudio}
                    playSong={playSong}
                    currentSongTitle={currentSongTitle}
                    setBellConfig={setBellConfig}
                    setDrawEmit={setDrawEmit}
                    setBellPos={setBellPos}
                    setBubblePositions={setBubblePositions}
                />
            )}

            <audio ref={audioRef} src={currentSong} loop />
        </div>
    );
}

