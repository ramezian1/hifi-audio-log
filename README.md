# 🎧 Hi-Fi Audio Log

A mobile app to track your headphone/DAC gear, listening notes, and EQ profiles.

## Features
- 🎧 Gear inventory (headphones, DACs, amps, cables)
- 📝 Listening session notes with ratings
- 🎚️ EQ profile storage and comparison
- 📊 Gear stats and listening history

## Tech Stack
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Navigation:** Expo Router
- **Storage:** AsyncStorage (local-first)
- **UI:** React Native Paper

## Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the dev server
npm start
```

## Project Structure

```
hifi-audio-log/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Tab navigator screens
│   │   ├── _layout.tsx     # Tab bar layout
│   │   ├── index.tsx       # Home / dashboard
│   │   ├── gear.tsx        # Gear list screen
│   │   ├── sessions.tsx    # Listening sessions screen
│   │   └── eq.tsx          # EQ profiles screen
│   ├── gear/               # Gear stack screens
│   │   └── [id].tsx        # Gear detail screen
│   ├── modals/             # Modal screens
│   │   ├── add-gear.tsx    # Add gear modal
│   │   ├── add-session.tsx # Add session modal
│   │   └── add-eq.tsx      # Add EQ profile modal
│   ├── _layout.tsx         # Root stack layout
│   ├── index.tsx           # Entry point
│   └── +not-found.tsx      # 404 screen
├── components/             # Reusable UI components
├── store/                  # Zustand state management
├── types/                  # TypeScript interfaces
├── constants/              # App-wide constants
├── utils/                  # Utility functions (export/import)
└── __tests__/              # Jest unit tests
```

## Roadmap
- [ ] Gear CRUD (add, edit, delete)
- [ ] Session logging with date/time
- [ ] EQ curve visualizer
- [ ] Export data to JSON
- [ ] Dark mode support

## License
MIT
