import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import MemoryCard from './MemoryCard';
import ArtifactFrame from './ArtifactFrame';

export default function ResonanceVault({ roomId, user, onPlay, onClose, currentTitle, isPlaying, onToggle }) {
    const [activeTab, setActiveTab] = useState('resonance'); // 'resonance', 'memories', 'artifacts'
    const [songs, setSongs] = useState([]);
    const [memories, setMemories] = useState([]);
    const [artifacts, setArtifacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedMemory, setSelectedMemory] = useState(null);
    const [selectedArtifact, setSelectedArtifact] = useState(null);

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
                        <div className="song-list">
                            <div className="currently-playing" style={{ marginBottom: 20 }}>
                                <span className="label">Now Reacting To</span>
                                <div className="track-title">{currentTitle}</div>
                                <button className={`btn-icon ${isPlaying ? 'playing' : ''}`} onClick={onToggle}>
                                    {isPlaying ? '⏸' : '▶'}
                                </button>
                            </div>

                            <div className="list-label">Shared Album</div>
                            {songs.length === 0 && <div className="empty-state">No shared frequencies yet.</div>}
                            {songs.map(song => (
                                <div key={song.id} className="song-item" onClick={() => onPlay(song.url, song.title)}>
                                    <div className="song-info">
                                        <div className="song-name">{song.title}</div>
                                        <div className="song-meta">By {song.senderName}</div>
                                    </div>
                                    <div className="play-indicator">▶</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'memories' && (
                        <div className="memories-grid">
                            {memories.length === 0 && <div className="empty-state">No moments archived.</div>}
                            {memories.map(memory => (
                                <div key={memory.id} className="memory-item-preview" onClick={() => setSelectedMemory(memory)}>
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
                        PROTOCOL v4 • PERMANENT ARCHIVE
                    </p>
                </div>
            </div>

            {/* Sub-modals for viewing items */}
            {selectedMemory && (
                <div className="modal-overlay sub-modal" onClick={() => setSelectedMemory(null)}>
                    <div onClick={e => e.stopPropagation()}>
                        <MemoryCard
                            roomId={roomId}
                            messages={selectedMemory.messages}
                            mood={selectedMemory.mood}
                            partnerName={selectedMemory.participants[1]}
                            userName={selectedMemory.participants[0]}
                            onClose={() => setSelectedMemory(null)}
                            isViewOnly={true}
                        />
                    </div>
                </div>
            )}

            {selectedArtifact && (
                <ArtifactFrame
                    title={selectedArtifact.title}
                    lyrics={selectedArtifact.lyrics}
                    date={selectedArtifact.date}
                    participants={selectedArtifact.participants}
                    onClose={() => setSelectedArtifact(null)}
                />
            )}
        </div>
    );
}
