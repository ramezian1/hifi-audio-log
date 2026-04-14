# 🎧 Hi-Fi Audio Log

A mobile app to track your headphone/DAC gear, listening sessions, and EQ profiles — built with React Native (Expo).

## Features

- 🎧 **Gear inventory** — add, edit, and delete headphones, DACs, amps, IEMs, cables, and more
- 📝 **Listening sessions** — log tracks, artists, albums, notes, ratings (1–5), date/time, and duration
- 🎛️ **EQ profiles** — store EQ band settings with a live frequency response curve visualizer
- 📊 **Home dashboard** — recent gear, recent sessions, and stats at a glance
- 💾 **Backup & Restore** — export all data to JSON and re-import it anytime
- 🔍 **Search & filter** — filter sessions by rating and search by track, artist, or gear name
- 🗑️ **Swipe to delete** — swipe left on any gear or EQ entry to delete with confirmation
- 🌙☀️ **Dark/light theme** — toggle between dark and light mode from the Home screen; preference is saved

## Tech Stack

- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based)
- **State / Storage:** Zustand + AsyncStorage (persisted, local-first)
- **UI:** React Native Paper (Material Design 3, dark + light themes)
- **Charts:** react-native-svg (biquad DSP frequency response rendering)
- **Testing:** Jest + React Native Testing Library (82 unit tests)

## Getting Started

```bash
# Install dependencies (Recommended Sequence)
npm install react@19.2.0 react-dom@19.2.0 --legacy-peer-deps
npm install jest@29 --save-dev --legacy-peer-deps
npm install --legacy-peer-deps

# Start the dev server
npm start
```

Scan the QR code with **Expo Go** on your iOS or Android device.

## Project Structure

```
hifi-audio-log/
├── app/                        # Expo Router screens
│   ├── (tabs)/                 # Tab navigator screens
│   │   ├── _layout.tsx         # Tab bar layout
│   │   ├── index.tsx           # Home / dashboard
│   │   ├── gear.tsx            # Gear list screen
│   │   ├── sessions.tsx        # Listening sessions screen
│   │   └── eq.tsx              # EQ profiles screen (with curve chart)
│   ├── gear/
│   │   └── [id].tsx            # Gear detail & edit screen
│   ├── sessions/
│   │   └── [id].tsx            # Session detail & edit screen
│   ├── modals/
│   │   ├── add-gear.tsx        # Add gear modal
│   │   ├── add-session.tsx     # Add session modal
│   │   ├── add-eq.tsx          # Add EQ profile modal
│   │   └── backup-restore.tsx  # Backup & Restore modal
│   ├── _layout.tsx             # Root stack layout
│   ├── index.tsx               # Entry point
│   └── +not-found.tsx          # 404 screen
├── components/                 # Reusable UI components
│   ├── EQCurveChart.tsx        # Biquad DSP frequency response SVG chart
│   ├── EQProfileCard.tsx       # EQ profile card
│   ├── GearForm.tsx            # Shared gear add/edit form
│   ├── GearCard.tsx            # Gear list card
│   ├── SessionForm.tsx         # Shared session add/edit form
│   └── SessionRow.tsx          # Session list row
├── store/                      # Zustand state management
│   ├── useGearStore.ts
│   ├── useSessionStore.ts
│   ├── useEQStore.ts
│   └── useThemeStore.ts        # Dark/light theme persistence
├── types/                      # TypeScript interfaces
│   └── index.ts                # GearItem, ListeningSession, EQProfile, EQBand
├── utils/                      # Utility functions
│   └── importExport.ts         # JSON backup/restore helpers
├── constants/                  # App-wide constants
└── __tests__/                  # Jest unit tests
```

## Usage Notes

### Adding a Session

1. Go to the **Sessions** tab and tap the **+** button
2. Optionally select gear from the inline picker
3. Fill in track, artist, album, notes, and/or rating
4. Date & time defaults to now — format is `MM/DD/YYYY HH:mm`
5. Tap **Save**

### Backup & Restore

- Tap the **Backup & Restore** button on the Home screen
- **Export** saves all gear, sessions, and EQ profiles as a JSON file
- **Import** reads a previously exported JSON file and restores your data

### EQ Profiles

- Each EQ profile supports up to 10 bands with frequency, gain, Q, and filter type
- Profiles can optionally be linked to a specific piece of gear
- Each profile card displays a **live frequency response curve** computed from the band settings using biquad DSP math (peaking, low shelf, high shelf filters)
- The curve renders on a log-frequency axis (20Hz–20kHz) with ±18dB range

### Theme Toggle

- Tap the sun/moon icon in the top-right corner of the Home screen to switch between dark and light mode
- Your preference is saved automatically and persists across app restarts

## Roadmap

- [x] Gear CRUD (add, edit, delete)
- [x] Session logging with date/time
- [x] EQ profile storage
- [x] Export / import data to JSON
- [x] Home dashboard with stats
- [x] Search and filter sessions
- [x] Swipe-to-delete for gear and EQ profiles
- [x] Backup & Restore modal
- [x] Friendly date format (MM/DD/YYYY HH:mm)
- [x] Dark/light theme toggle
- [x] EQ curve visualizer

## License

MIT
