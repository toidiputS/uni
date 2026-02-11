# •UNI• (you-n-eye)

> **The World’s First Conversational Generative Emotion Interface (CGEI)**

*Built for connection, powered by emotion.*

---

## 🌪️ The Concept
•UNI• is a messaging experience that turns your chat into living, breathing art. Instead of static gray bubbles, the interface reacts to the emotional "Resonance" between you and your partner.

- **"I love you"** → The screen glows pink, particles float like heartbeats.
- **"I hate you"** → The atmosphere turns dark, jagged, shaking with lightning.
- **"lol"** → The bubble ripples with laughter.

---

## 🚀 Key Features (v4 Pulse Architecture)

### 1. **Generative Atmosphere**
The background is a real-time evolving canvas driven by:
- **Deep Pool Imagery**: A curated library of 40+ high-fidelity scenes (Unsplash) matching every emotion.
- **Dynamic Selection**: Never see the same "Sadness" twice. Bell picks from a random pool.
- **Particle Synthesis**: Rain, sparks, fireflies, and dust rendered instantly on your GPU.

### 2. **Bell — The AI Companion**
**Bell** lives in the space between you. She is the white dot that breathes at the top of the screen.
- **Pulse Strategy (Hybrid AI)**:
    - **Fast Path**: Instant, local reaction to strong emotions & trivial chat (0ms latency).
    - **Deep Path**: Periodically consults Gemini 2.0 Flash for deep poetic insight.
- **The Observer**: She watches, listens, and adjusts the vibe without interrupting.

### 3. **Story Cards**
- One-tap "Capture" turns a moment into a beautiful, shareable artifact.
- Auto-generates a poetic title and background art.

---

## 🛠️ Technical Stack

- **Frontend**: React + Vite (Simulating Native App via PWA)
- **Styling**: Vanilla CSS (Visual Hierarchy Doctrine v3)
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **AI**: Gemini 2.0 Flash + Custom "Pulse" Local Engine
- **Audio**: Global "Resonance" Player (Seamless across pages)

---

## 📦 Installation & Dev

1.  **Clone repo**
    ```bash
    git clone https://github.com/Start-UNI/uni-app.git
    cd uni-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Env Setup**
    Create a `.env` file in root:
    ```env
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    VITE_gemini_api_key=...
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` (or `5173`)

---

## 📱 PWA Deployment

•UNI• is a **Progressive Web App**. To install on mobile:
1.  Navigate to the URL in Safari (iOS) or Chrome (Android).
2.  Tap "Share" -> "Add to Home Screen".
3.  Launch from home screen for full-screen immersive experience.

---

*"We don't just send messages. We send feelings."*
