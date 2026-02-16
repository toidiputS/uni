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
import Manifesto from './pages/Manifesto';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AtmosphereCanvas from './components/AtmosphereCanvas';
import BellDot from './components/BellDot';
import Footer from './components/Footer';
import PricingOverlay from './components/PricingOverlay';
import './artifacts.css';
import { hasSeenOnboarding } from './lib/onboarding';
import { redirectToCheckout } from './lib/stripe';

export default function App() {
    const [view, setView] = useState('welcome');
    const [user, setUser] = useState(null);
    const [userData, setOrderedUserData] = useState(null);
    const [roomId, setRoomId] = useState(null);

    // Initial routing for direct addresses & Invitation handling
    useEffect(() => {
        const path = window.location.pathname;
        if (path === '/privacy') setView('privacy');
        else if (path === '/tos') setView('tos');

        // PRE-RESONANCE: Catch and store incoming referral codes
        const params = new URLSearchParams(window.location.search);
        const incomingCode = params.get('code');
        if (incomingCode) {
            sessionStorage.setItem('uni_partner_code', incomingCode.toUpperCase());
            // Clean up URL to keep the sanctuary pristine
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    // Helper to change view and update URL if needed
    const navigateTo = useCallback((newView) => {
        if (newView === 'privacy') window.history.pushState({}, '', '/privacy');
        else if (newView === 'tos') window.history.pushState({}, '', '/tos');
        else if (newView === 'welcome') window.history.pushState({}, '', '/');
        setView(newView);
    }, []);

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
        size: 16, // Very small, refined core
        sentiment: 'neutral',
        top: '8vh', // Middle up top
        left: '50%'
    });
    const [showPricing, setShowPricing] = useState(false);
    const [showSurvey, setShowSurvey] = useState(false);

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
                x: (Math.random() - 0.5) * 100, // Reduced horizontal sweep
                y: (Math.random() - 0.5) * 15   // Very tight vertical drift near the top
            };
        }, 6000); // Slower, more calming pace

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

    // Unified atmosphere update handler
    const handleAtmosphereUpdate = useCallback((bundle) => {
        if (bundle.mood) setMood(bundle.mood);
        if (bundle.intensity !== undefined) setIntensity(bundle.intensity);
        if (bundle.sceneColors) setSceneColors(bundle.sceneColors);
        if (bundle.keywords !== undefined) setKeywords(bundle.keywords);
        if (bundle.showPricing !== undefined) setShowPricing(bundle.showPricing);
    }, []);

    const handleBubbleEmit = useCallback((emission) => {
        setBubbleEmit(emission);
    }, []);

    // Listen to Firebase auth state
    useEffect(() => {
        if (!auth) {
            console.warn('[•UNI•] Auth not available. Skipping sync.');
            // If auth is not available, we still want to show manifesto first.
            // The original logic here was to check hasSeenOnboarding, but we're forcing manifesto.
            setView('manifesto');
            return; // No need for a timer if we're setting it immediately
        }

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
                            // Always go to welcome first, then chat if onboarding is done
                            setView('welcome');
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
                if (!hasSeenOnboarding()) {
                    setView('welcome');
                } else {
                    setView('welcome');
                }
            }
        });

        // Failsafe: if we're still loading after 1.5s, force a view
        const failsafe = setTimeout(() => {
            setView(prev => {
                if (prev === 'loading') {
                    return 'welcome';
                }
                return prev;
            });
        }, 1500);

        return () => {
            unsub();
            clearTimeout(failsafe);
        };
    }, []);


    // Listen to user doc changes
    useEffect(() => {
        if (!user || !db) return;
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setOrderedUserData(data);
                if (data.pairedWith && data.lastRoomId) {
                    setRoomId(data.lastRoomId);
                    // AUTH DOCTRINE: If already in pairing, let the Pairing component handle 
                    // the resonance animation and transition. Don't auto-switch.
                    if (view !== 'pairing' && view !== 'chat') {
                        if (!hasSeenOnboarding()) {
                            setView('welcome');
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
        // If they just paired, they might have skipped the landing Manifesto
        // But the system should have landed them on Manifesto first.
        // If for some reason they are here and haven't onboarded, Manifesto is next.
        if (!hasSeenOnboarding()) {
            setView('welcome');
        } else {
            setView('chat');
        }
    }, []);

    const handleOnboardingComplete = useCallback(() => {
        if (user && roomId) {
            setView('chat');
        } else {
            setView('welcome');
        }
    }, [user, roomId]);

    const handleGlobalSponsor = useCallback(async (type) => {
        if (!user) {
            setView('auth');
            setShowPricing(false);
            return;
        }
        try {
            await redirectToCheckout(type, user.email, false);
        } catch (err) {
            console.error('Sponsorship error:', err);
        }
    }, [user]);

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
                top: bellConfig.top || '12vh',
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
                    onMoodChange={handleAtmosphereUpdate}
                    isPlaying={isPlaying}
                    onToggleAudio={toggleAudio}
                    setBellConfig={setBellConfig}
                    onShowPricing={() => setShowPricing(true)}
                />
            )}

            {view === 'auth' && (
                <Auth
                    onBack={() => setView('welcome')}
                    onAuthed={() => setView('pairing')}
                    setBellConfig={setBellConfig}
                    onShowPricing={() => setShowPricing(true)}
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
                    onShowPricing={() => setShowPricing(true)}
                />
            )}

            {view === 'manifesto' && (
                <Manifesto
                    onBegin={handleOnboardingComplete}
                    setBellConfig={setBellConfig}
                    onShowPricing={() => setShowPricing(true)}
                />
            )}

            {view === 'chat' && roomId && (
                <Chat
                    user={user}
                    userData={userData}
                    roomId={roomId}
                    onMoodChange={handleAtmosphereUpdate}
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
                    onShowPricing={() => setShowPricing(true)}
                />
            )}

            {view === 'privacy' && (
                <Privacy
                    onBack={() => navigateTo('welcome')}
                    setBellConfig={setBellConfig}
                />
            )}

            {view === 'tos' && (
                <Terms
                    onBack={() => navigateTo('welcome')}
                    setBellConfig={setBellConfig}
                />
            )}

            {showPricing && (
                <PricingOverlay
                    onClose={() => setShowPricing(false)}
                    onSponsor={handleGlobalSponsor}
                    hasDiscount={false}
                    onOpenSurvey={() => { setShowPricing(false); setShowSurvey(true); }}
                />
            )}

            {showSurvey && (
                <div className="modal-overlay" onClick={() => setShowSurvey(false)}>
                    {/* Reuse existing Chat's FeedbackModal logic or move to global */}
                    <div className="artifact-frame" onClick={e => e.stopPropagation()}>
                        <div className="artifact-paper" style={{ padding: 40, textAlign: 'center' }}>
                            <h2>Share Your Thoughts</h2>
                            <p>We're building the future of emotional tech together.</p>
                            <textarea
                                placeholder="What does UNI feel like to you?"
                                style={{ width: '100%', height: 100, background: 'rgba(0,0,0,0.05)', border: 'none', padding: 15, margin: '20px 0', borderRadius: 12 }}
                            />
                            <button className="btn btn-primary" onClick={() => setShowSurvey(false)}>Complete Study</button>
                        </div>
                    </div>
                </div>
            )}

            <audio ref={audioRef} src={currentSong} loop />
            {view !== 'chat' && view !== 'manifesto' && <Footer setView={navigateTo} />}
        </div>
    );
}

