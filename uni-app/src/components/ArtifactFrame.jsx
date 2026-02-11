import React, { useMemo } from 'react';

export default function ArtifactFrame({ title, lyrics, date, participants, onClose }) {
    const [p1, p2] = participants || ['You', 'Partner'];

    return (
        <div className="modal-overlay artifact-overlay" onClick={onClose}>
            <div className="artifact-frame" onClick={(e) => e.stopPropagation()}>
                {/* The Paper / Print */}
                <div className="artifact-paper">
                    <div className="artifact-header">
                        <div className="artifact-uni-dot" />
                        <span>•UNI• ARCHIVE</span>
                    </div>

                    <h1 className="artifact-title">{title}</h1>
                    <div className="artifact-divider" />

                    <div className="artifact-lyrics">
                        {lyrics.split('\n').map((line, i) => (
                            <p key={i}>{line || '\u00A0'}</p>
                        ))}
                    </div>

                    <div className="artifact-footer">
                        <div className="artifact-names">
                            {p1} <span>&</span> {p2}
                        </div>
                        <div className="artifact-date">{date}</div>
                        <div className="artifact-serial">RES-ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                    </div>
                </div>

                <div className="artifact-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                        Print Artifact ⎙
                    </button>
                    <button className="btn btn-glass btn-sm" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
