// •UNI• v3 — Main Application
// CGEI Emotional Atmosphere Engine
// State flow: Welcome → Auth → Pairing → Onboarding → Chat

import React, { useState, useEffect, useCallback } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Pairing from './pages/Pairing';
import Chat from './pages/Chat';
import BellOnboarding from './components/BellOnboarding';
import AtmosphereCanvas from './components/AtmosphereCanvas';
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
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState('/wishes_in_the_wind.mp3');
    const [currentSongTitle, setCurrentSongTitle] = useState('Wishes in the Wind');
    const audioRef = React.useRef(null);

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

    const playSong = useCallback((url, title) => {
        if (!audioRef.current) return;
        setCurrentSong(url);
        setCurrentSongTitle(title || 'Shared Resonance');

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
    }, []);

    const handleBubbleEmit = useCallback((emission) => {
        setBubbleEmit(emission);
    }, []);

    // Listen to Firebase auth state
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
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

            {/* Particle weather layer */}
            <AtmosphereCanvas
                mood={mood}
                intensity={intensity}
                bubbleEmit={bubbleEmit}
            />

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
                />
            )}

            {view === 'auth' && (
                <Auth
                    onBack={() => setView('welcome')}
                    onAuthed={() => setView('pairing')}
                />
            )}

            {view === 'pairing' && (
                <Pairing
                    user={user}
                    onPaired={handlePaired}
                    onLogout={handleLogout}
                    isPlaying={isPlaying}
                    onToggleAudio={toggleAudio}
                />
            )}

            {view === 'onboarding' && (
                <BellOnboarding
                    onComplete={handleOnboardingComplete}
                    onSceneChange={setSceneColors}
                />
            )}

            {view === 'chat' && roomId && (
                <Chat
                    user={user}
                    userData={userData}
                    roomId={roomId}
                    onMoodChange={handleMoodChange}
                    bubbleEmit={bubbleEmit}
                    onBubbleEmit={handleBubbleEmit}
                    onSceneChange={setSceneColors}
                    onUnpair={() => setView('pairing')}
                    onLogout={handleLogout}
                    isPlaying={isPlaying}
                    onToggleAudio={toggleAudio}
                    playSong={playSong}
                    currentSongTitle={currentSongTitle}
                />
            )}

            <audio ref={audioRef} src={currentSong} loop />
            <SpeedInsights />
        </div>
    );
}
