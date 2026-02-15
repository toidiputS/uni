import React from 'react';

export default function Footer({ setView }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            position: 'fixed',
            bottom: '24px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            padding: '0 24px',
            zIndex: 100,
            pointerEvents: 'none' // To allow clicking through if needed, but links should be clickable
        }}>
            <div style={{
                display: 'flex',
                gap: '24px',
                pointerEvents: 'auto',
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.3)',
                textTransform: 'uppercase',
                fontWeight: 300
            }}>
                <span>© {currentYear} It's LLC "What It Is"</span>
                <button
                    onClick={() => setView('privacy')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        padding: 0,
                        font: 'inherit',
                        letterSpacing: 'inherit',
                        transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={e => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.3)'}
                >
                    Privacy
                </button>
                <button
                    onClick={() => setView('tos')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        padding: 0,
                        font: 'inherit',
                        letterSpacing: 'inherit',
                        transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={e => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.3)'}
                >
                    Terms
                </button>
            </div>
        </footer>
    );
}
