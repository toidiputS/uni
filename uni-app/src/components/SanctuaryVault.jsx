import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { supabase } from '../lib/supabase';
import MemoryCard from './MemoryCard';
import ArtifactFrame from './ArtifactFrame';

export default function SanctuaryVault({ roomId, user, onPlay, onClose, currentTitle, isPlaying, onToggle }) {
    const [activeTab, setActiveTab] = useState('resonance'); // 'resonance', 'memories', 'artifacts'
    const [songs, setSongs] = useState([]);
    const [memories, setMemories] = useState([]);
    const [artifacts, setArtifacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const [selectedMemory, setSelectedMemory] = useState(null);
    const [selectedArtifact, setSelectedArtifact] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!supabase) {
            alert("Supabase storage is not configured.");
            return;
        }

        const isAudio = file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.m4a') || file.name.endsWith('.wav');
        if (!isAudio) {
            alert("Please share a valid audio file (MP3, M4A, WAV).");
            return;
        }

        setUploading(true);
        setProgress(10);

        try {
            const filePath = `chat/${roomId}/resonance_${Date.now()}_${file.name}`;
            const { data, error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            setProgress(90);
            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);

            await addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
                type: 'resonance',
                title: file.name.replace(/\.[^/.]+$/, ""),
                url: publicUrl,
                sender: user.uid,
                senderName: user.displayName || 'Partner',
                createdAt: serverTimestamp(),
                sentiment: 'tender',
                isUni: false
            });

        } catch (err) {
            console.error('[Sanctuary Vault] Upload Error:', err);
            alert(`Upload failed: ${err.message}`);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    // The Decay Principle: Calculate visual fade based on age (30 days = background mist)
    const getDecayOpacity = (createdAt) => {
        if (!createdAt) return 1;
        try {
            const now = Date.now();
            const time = createdAt.toMillis ? createdAt.toMillis() : (createdAt.seconds ? createdAt.seconds * 1000 : createdAt);
            const ageInDays = (now - time) / (1000 * 60 * 60 * 24);
            return Math.max(0.2, 1 - (ageInDays / 30) * 0.8);
        } catch (e) {
            return 1;
        }
    };

    useEffect(() => {
        if (!roomId) return;
        setLoading(true);

        // 1. Listen to Songs (Messages type=resonance)
        const qSongs = query(
            collection(db, 'chatRooms', roomId, 'messages'),
            where('type', '==', 'resonance'),
            orderBy('createdAt', 'desc')
        );
        const unsubSongs = onSnapshot(qSongs, (snap) => {
            setSongs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        // 2. Listen to Memories
        const qMemories = query(
            collection(db, 'chatRooms', roomId, 'memories'),
            orderBy('createdAt', 'desc')
        );
        const unsubMemories = onSnapshot(qMemories, (snap) => {
            setMemories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        // 3. Listen to Artifacts (Soul Songs)
        const qArtifacts = query(
            collection(db, 'chatRooms', roomId, 'artifacts'),
            orderBy('createdAt', 'desc')
        );
        const unsubArtifacts = onSnapshot(qArtifacts, (snap) => {
            setArtifacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });

        return () => {
            unsubSongs();
            unsubMemories();
            unsubArtifacts();
        };
    }, [roomId]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-card resonance-vault" onClick={e => e.stopPropagation()}>
                <div className="vault-header">
                    <div className="vault-title-wrap">
                        <div className="resonance-dot-active" />
                        <h3>Sanctuary Vault</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="vault-tabs">
                    <button
                        className={`vault-tab ${activeTab === 'resonance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resonance')}
                    >
                        Resonance
                    </button>
                    <button
                        className={`vault-tab ${activeTab === 'memories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('memories')}
                    >
                        Memories
                    </button>
                    <button
                        className={`vault-tab ${activeTab === 'artifacts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('artifacts')}
                    >
                        Artifacts
                    </button>
                </div>

                <div className="vault-content-scroll">
                    {activeTab === 'resonance' && (
                        <div className="resonance-list">
                            <div className="currently-playing">
                                <div className="track-info">
                                    <span className="label">NOW REACTING TO</span>
                                    <div className="track-title">{currentTitle || 'Sanctuary Silence'}</div>
                                </div>
                                <button className={`btn-icon ${isPlaying ? 'playing' : ''}`} onClick={onToggle}>
                                    {isPlaying ? '⏸' : '▶'}
                                </button>
                            </div>

                            <div className="list-label">SHARED ALBUM</div>
                            {songs.length === 0 && <div className="empty-state">No shared frequencies yet.</div>}
                            <div className="song-items-wrap">
                                {songs.map(song => (
                                    <div
                                        key={song.id}
                                        className="song-item"
                                        onClick={() => onPlay(song.url, song.title)}
                                        style={{ opacity: getDecayOpacity(song.createdAt) }}
                                    >
                                        <div className="song-info">
                                            <div className="song-name">{song.title}</div>
                                            <div className="song-meta">By {song.senderName}</div>
                                        </div>
                                        <div className="song-actions" onClick={e => e.stopPropagation()}>
                                            <a
                                                href={song.url}
                                                download={song.title}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="vault-download-btn"
                                                title="Save Frequency"
                                            >
                                                💾
                                            </a>
                                            <div className="play-indicator">▶</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="upload-section" style={{ marginTop: 24 }}>
                                <label className="btn btn-glass btn-sm" style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
                                    {uploading ? `Uploading ${Math.round(progress)}%...` : 'Upload & Share MP3'}
                                    {uploading && (
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            bottom: 0,
                                            height: 2,
                                            background: 'var(--uni-gradient)',
                                            width: `${progress}%`,
                                            transition: 'width 0.3s ease'
                                        }} />
                                    )}
                                    <input type="file" accept="audio/*" onChange={handleFileUpload} hidden disabled={uploading} />
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'memories' && (
                        <div className="memories-grid">
                            {memories.length === 0 && <div className="empty-state">No moments archived.</div>}
                            {memories.map(memory => (
                                <div
                                    key={memory.id}
                                    className="memory-item-preview"
                                    onClick={() => setSelectedMemory(memory)}
                                    style={{ opacity: getDecayOpacity(memory.createdAt) }}
                                >
                                    <div className="memory-mood-dot" style={{ background: `var(--emo-${memory.mood || 'neutral'})` }} />
                                    <div className="memory-info">
                                        <div className="memory-name">{memory.title}</div>
                                        <div className="memory-date">{memory.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'artifacts' && (
                        <div className="artifacts-list">
                            {artifacts.length === 0 && <div className="empty-state">No soul artifacts created.</div>}
                            {artifacts.map(art => (
                                <div key={art.id} className="artifact-item-preview" onClick={() => setSelectedArtifact(art)}>
                                    <div className="artifact-icon">📜</div>
                                    <div className="artifact-info">
                                        <div className="artifact-name">{art.title}</div>
                                        <div className="artifact-meta">{art.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="vault-footer">
                    <p className="ethereal-text" style={{ fontSize: 9, opacity: 0.5 }}>
                        PROTOCOL v5 • ORGANIC MEMORY (DECAY ACTIVE)
                    </p>
                </div>
            </div>

            {/* Sub-modals for viewing items */}
            {
                selectedMemory && (
                    <div className="modal-overlay sub-modal" onClick={() => setSelectedMemory(null)}>
                        <div onClick={e => e.stopPropagation()}>
                            <MemoryCard
                                roomId={roomId}
                                messages={selectedMemory.messages}
                                mood={selectedMemory.mood}
                                tier="sage" // Vault viewing is a premium-feeling feature
                                partnerName={selectedMemory.participants?.[1] || 'Partner'}
                                userName={selectedMemory.participants?.[0] || 'You'}
                                onClose={() => setSelectedMemory(null)}
                                onToast={() => { }}
                                isViewOnly={true}
                            />
                        </div>
                    </div>
                )
            }

            {
                selectedArtifact && (
                    <ArtifactFrame
                        title={selectedArtifact.title}
                        lyrics={selectedArtifact.lyrics}
                        date={selectedArtifact.date}
                        participants={selectedArtifact.participants}
                        onClose={() => setSelectedArtifact(null)}
                    />
                )
            }
        </div >
    );
}
