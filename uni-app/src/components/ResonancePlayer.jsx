import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

export default function ResonancePlayer({ roomId, user, onPlay, onClose, currentTitle, isPlaying, onToggle }) {
    const [songs, setSongs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomId) return;
        setLoading(true);
        const q = query(collection(db, 'chatRooms', roomId, 'resonance'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setSongs(list);
            setLoading(false);
        }, (err) => {
            console.error('[Resonance] Load error:', err);
            setLoading(false);
        });
        return unsub;
    }, [roomId]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Loosened type check for mobile/uncommon audio formats
        const isAudio = file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.m4a') || file.name.endsWith('.wav');
        if (!isAudio) {
            alert("Please share a valid audio file (MP3, M4A, WAV).");
            return;
        }

        setUploading(true);
        setProgress(0);

        const storageRef = ref(storage, `rooms/${roomId}/resonance/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(p);
            },
            (err) => {
                console.error('[Resonance] Upload task failed:', err);
                setUploading(false);
                alert(`Upload failed: ${err.message}. Check your internet or storage rules.`);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                await addDoc(collection(db, 'chatRooms', roomId, 'resonance'), {
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    url,
                    sharedBy: user.uid,
                    sharedByName: user.displayName || 'Partner',
                    createdAt: serverTimestamp()
                });
                setUploading(false);
                setProgress(0);
            }
        );
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
                    <label className="btn btn-glass btn-sm" style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
                        {uploading ? `Uploading ${Math.round(progress)}%...` : 'Upload & Share MP3'}
                        {uploading && (
                            <div style={{
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                                height: 2,
                                background: 'var(--emo-happy)',
                                width: `${progress}%`,
                                transition: 'width 0.3s ease'
                            }} />
                        )}
                        <input type="file" accept="audio/*" onChange={handleFileUpload} hidden disabled={uploading} />
                    </label>
                </div>
            </div>
        </div>
    );
}
