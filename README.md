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
npm install

# Start Expo dev server
npx expo start
```

## Project Structure

```
hifi-audio-log/
├── app/                  # Expo Router screens
│   ├── (tabs)/
│   │   ├── gear.tsx      # Gear inventory
│   │   ├── sessions.tsx  # Listening sessions
│   │   └── eq.tsx        # EQ profiles
│   └── _layout.tsx
├── components/           # Reusable UI components
├── store/                # State management
├── types/                # TypeScript interfaces
├── constants/            # App-wide constants
└── assets/               # Icons, fonts, images
```

## Roadmap
- [ ] Gear CRUD (add, edit, delete)
- [ ] Session logging with date/time
- [ ] EQ curve visualizer
- [ ] Export data to JSON
- [ ] Dark mode support

## License
MIT
