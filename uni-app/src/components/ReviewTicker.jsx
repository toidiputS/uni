import React, { useMemo } from 'react';

/**
 * ReviewTicker
 * A side-scrolling ticker for short reviews.
 * Displays 4-5 icons (hearts/shamrocks) based on current holiday logic.
 */

const REVIEWS = [
    { text: "It feels like the app is breathing with us.", author: "Sarah & Leo", rating: 5 },
    { text: "The most intimate chat experience I've ever had.", author: "James M.", rating: 5 },
    { text: "Bell is the perfect witness to our connection.", author: "Elena", rating: 4 },
    { text: "Visualizing our emotions changed how we talk.", author: "T & K", rating: 5 },
    { text: "Finally, a digital space that values our resonance.", author: "Mimi", rating: 5 },
    { text: "The Soul Songs are simply breathtaking.", author: "David W.", rating: 4 },
    { text: "Pure magic in every message.", author: "Chloe", rating: 5 },
];

export default function ReviewTicker() {
    // Determine icon based on date
    const icon = useMemo(() => {
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const day = now.getDate();

        // Switch to Shamrock specifically on St. Patrick's Day (3.17)
        if (month === 3 && day === 17) return "🍀";

        // Default for Valentine's / Current run
        return "❤️";
    }, []);

    const doubledReviews = [...REVIEWS, ...REVIEWS];

    return (
        <div className="review-ticker-container">
            <div className="review-ticker-track">
                {doubledReviews.map((rev, i) => (
                    <div key={i} className="review-item">
                        <div className="review-rating">
                            {[...Array(rev.rating)].map((_, j) => (
                                <span key={j} className="rating-icon">{icon}</span>
                            ))}
                        </div>
                        <p className="review-text">"{rev.text}"</p>
                        <span className="review-author">— {rev.author}</span>
                    </div>
                ))}
            </div>

            <style>{`
                .review-ticker-container {
                    width: 100%;
                    overflow: hidden;
                    padding: 40px 0;
                    position: relative;
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                }

                .review-ticker-track {
                    display: flex;
                    gap: 40px;
                    width: max-content;
                    animation: scroll 60s linear infinite;
                }

                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                .review-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    width: 320px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    padding: 30px;
                    border-radius: 32px;
                    backdrop-filter: blur(20px);
                }

                .review-rating {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 16px;
                }

                .rating-icon {
                    font-size: 14px;
                    filter: drop-shadow(0 0 8px rgba(255,255,255,0.2));
                }

                .review-text {
                    font-size: 15px;
                    color: var(--uni-text);
                    line-height: 1.6;
                    margin-bottom: 16px;
                    font-weight: 200;
                    font-style: italic;
                    opacity: 0.9;
                }

                .review-author {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: var(--uni-text-dim);
                    opacity: 0.5;
                }
            `}</style>
        </div>
    );
}
