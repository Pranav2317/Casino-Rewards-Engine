# 🎰 Casino Rewards Engine

A real-time full-stack casino slot machine rewards tracking system with multi-user WebSocket communication, live analytics, and sound effects. Each browser tab acts as an independent slot machine in a shared casino environment.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socket.io&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chart.js&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=flat&logo=jquery&logoColor=white)

---

## Features

### 🎰 Slot Machine
- Single pay-line slot machine with random number generation
- Two image states: **Full Spin** (animation) and **Slot Result** (with number overlay)
- Client-side HTML5 Canvas rendering of result numbers on the slot machine image
- 300ms real-time chip monitor showing rapidly cycling numbers

### 🏆 Win Detection
| Combination | Credits | Description |
|-------------|---------|-------------|
| **777** | 5 credits | Jackpot |
| **333** | 2 credits | Mid-tier win |
| **0XX** (starts with 0) | 5 credits | ~10% win probability |

### 🎁 Rewards System
- Each spin earns **1 reward point** tracked per member
- **5 Points** → Free Meal reward unlocked
- **10 Points** → Fuel Discount reward unlocked
- Rewards persist per session and are polled every 5 seconds

### 📡 Real-Time Multi-User (WebSockets)
- Built with **Socket.IO** for real-time bidirectional communication
- When a player wins, **all other connected clients** are notified instantly
- Each browser tab acts as an independent slot machine
- Winner announcements display with sound effects and animated banners

### 💰 House Ledger
- Starts at **$1,000,000** base
- Decreases with each play and win payout
- Live **Chart.js** line chart updates every 10 seconds
- Gold-themed gradient chart with dark background

### 🔊 Sound Effects
- Powered by **Howler.js** audio sprite
- **Play** sound on spin (0–4s)
- **Win** sound on winning result (4–5s)
- **Yahoo** sound when another player wins (10–14.5s)
- **Ping** sound on connection and reward unlocks (15–16s)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Server** | Node.js, Express.js |
| **Real-Time** | Socket.IO (WebSockets) |
| **Frontend** | HTML5, CSS3, jQuery |
| **Charts** | Chart.js |
| **Audio** | Howler.js |
| **Image Rendering** | HTML5 Canvas API |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/Pranav2317/Casino-Rewards-Engine.git

# Navigate to the project directory
cd Casino-Rewards-Engine

# Install dependencies
npm install

# Start the server
npm start
```

### Usage

1. Open your browser and go to **http://localhost:3000**
2. Enter a fake rewards card number in the input field
3. Click the slot machine image to spin
4. Watch the chip monitor cycle numbers in real-time
5. Open multiple browser tabs to simulate multiple players
6. When one tab wins, all other tabs get notified with a sound and banner

---

## Project Structure

```
Casino-Rewards-Engine/
├── server.js                 # Node.js/Express server with Socket.IO hub
├── index.html                # Main UI with all client-side logic
├── package.json              # Dependencies and scripts
├── Assets/
│   ├── slotmachine_slot3.png       # Idle slot machine image
│   ├── slotmachine_fullspin.png    # Spinning animation image
│   ├── slotmachine_result.jpg      # Result template for canvas overlay
│   └── slotmachinesprite.mp3       # Audio sprite (play/win/yahoo/ping)
├── Scripts/
│   ├── jquery-1.6.4.js             # jQuery library
│   ├── Chart.js/                   # Chart.js library
│   └── howler/                     # Howler.js audio library
└── App_Code/                       # Original ASP.NET backend (reference)
    ├── slotHub.cs                  # Original SignalR hub
    └── Startup.cs                  # Original OWIN startup
```

---

## Architecture

```
┌──────────────┐     WebSocket      ┌──────────────────┐
│  Browser Tab │◄──────────────────►│   Node.js Server  │
│  (Player 1)  │   Socket.IO        │                    │
└──────────────┘                    │  ┌──────────────┐  │
                                    │  │  Slot RNG    │  │
┌──────────────┐     WebSocket      │  │  Engine      │  │
│  Browser Tab │◄──────────────────►│  ├──────────────┤  │
│  (Player 2)  │   Socket.IO        │  │  Rewards     │  │
└──────────────┘                    │  │  Tracker     │  │
                                    │  ├──────────────┤  │
┌──────────────┐     WebSocket      │  │  House       │  │
│  Browser Tab │◄──────────────────►│  │  Ledger      │  │
│  (Player N)  │   Socket.IO        │  └──────────────┘  │
└──────────────┘                    └──────────────────────┘
```

---

## Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `genslots` | Client → Server | Request random slot numbers |
| `numberreturn` | Server → Client | Return generated slot number |
| `slotresult` | Client → Server | Submit a spin with current number + member ID |
| `resultreturn` | Server → Client | Return win/loss result and credits |
| `annoucewinner` | Server → All Others | Broadcast winner to other players |
| `genrewards` | Client → Server | Request reward points for a member |
| `rewardsreturn` | Server → Client | Return current reward points |
| `getledger` | Client → Server | Request current house ledger |
| `returnledger` | Server → Client | Return house ledger amount |
| `errorrtn` | Server → Client | Return error message |

---

## Future Improvements

- [ ] **Database persistence** — Replace in-memory storage with PostgreSQL/MongoDB
- [ ] **User authentication** — JWT-based login instead of text input
- [ ] **Weighted RNG** — Configurable probability per symbol (RTP ~95%)
- [ ] **Player credits system** — Balance management with deposits/withdrawals
- [ ] **Play history & audit log** — Timestamped log of every spin
- [ ] **Rate limiting** — Server-side throttle (max 1 spin per 3 seconds)
- [ ] **Configurable pay table** — JSON-based win combinations
- [ ] **Mobile responsive** — Optimized layout for smaller screens
- [ ] **Deploy to Render/Railway** — Live hosted version with WebSocket support

---

## License

This project is for educational and portfolio demonstration purposes.
