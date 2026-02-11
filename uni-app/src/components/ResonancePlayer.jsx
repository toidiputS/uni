import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ResonancePlayer({ roomId, user, onPlay, onClose, currentTitle, isPlaying, onToggle }) {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!roomId) return;
        const q = query(collection(db, 'chatRooms', roomId, 'resonance'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setSongs(list);
        });
        return unsub;
    }, [roomId]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('audio/')) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `rooms/${roomId}/resonance/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);

            await addDoc(collection(db, 'chatRooms', roomId, 'resonance'), {
                title: file.name.replace(/\.[^/.]+$/, ""),
                url,
                sharedBy: user.uid,
                sharedByName: user.displayName || 'Partner',
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error('[Resonance] Upload failed:', err);
            alert("Upload failed. Storage might be restricted.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-card music-player" onClick={e => e.stopPropagation()}>
                <div className="player-header">
                    <div className="resonance-dot-active" />
                    <h3>Shared Resonance</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="currently-playing">
                    <span className="label">Now Playing</span>
                    <div className="track-title">{currentTitle}</div>
                    <button className={`btn-icon ${isPlaying ? 'playing' : ''}`} onClick={onToggle}>
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                </div>

                <div className="song-list">
                    <div className="list-label">Shared Album</div>
                    {songs.length === 0 && !loading && (
                        <div className="empty-list">No shared songs yet</div>
                    )}
                    {songs.map(song => (
                        <div key={song.id} className="song-item" onClick={() => onPlay(song.url, song.title)}>
                            <div className="song-info">
                                <div className="song-name">{song.title}</div>
                                <div className="song-meta">Shared by {song.sharedByName}</div>
                            </div>
                            <div className="play-indicator">▶</div>
                        </div>
                    ))}
                </div>

                <div className="upload-section">
                    <label className="btn btn-glass btn-sm" style={{ width: '100%' }}>
                        {uploading ? 'Uploading...' : 'Upload & Share MP3'}
                        <input type="file" accept="audio/*" onChange={handleFileUpload} hidden disabled={uploading} />
                    </label>
                </div>
            </div>
        </div>
    );
}
