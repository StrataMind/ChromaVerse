# 🎨 ChromaVerse - Next-Gen Color Game

A modern, interactive color guessing game with advanced UI/UX featuring glassmorphism design, particle effects, and dynamic gameplay mechanics.

## 🚀 Features

### 🎮 **Core Gameplay**
- **3 Game Modes**: RGB, HEX, and HSL color formats
- **3 Difficulty Levels**: Easy, Medium, Hard with adaptive challenge
- **Dynamic Scaling**: Difficulty increases with player level
- **30-Second Timer**: Fast-paced gameplay with circular progress indicator

### 🎯 **Advanced Mechanics**
- **Streak System**: Build combos for bonus points
- **Level Progression**: Unlock new levels every 5 correct answers
- **Hint System**: 3 hints per game to eliminate wrong options
- **Achievement System**: Unlock rewards for milestones

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Frosted glass effects with backdrop blur
- **Particle Animation**: Dynamic floating background particles
- **Smooth Animations**: Cubic-bezier transitions and micro-interactions
- **Progress Indicators**: Real-time visual feedback for all stats
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🔧 **Technical Features**
- **Local Storage**: Persistent best scores and achievements
- **Web Audio API**: Dynamic sound effects for game events
- **Settings Panel**: Toggle sound effects and animations
- **Error Handling**: Graceful fallbacks for unsupported features

## 🎯 How to Play

1. **Start**: Game begins automatically with a 30-second timer
2. **Observe**: Study the color displayed in the center
3. **Match**: Click the color option that matches the displayed color value
4. **Score**: Earn points based on difficulty and streak multipliers
5. **Progress**: Level up every 5 correct answers in a row

## 🎮 Game Modes

| Mode | Description | Example |
|------|-------------|---------|
| **RGB** | Red, Green, Blue values | `rgb(255, 128, 64)` |
| **HEX** | Hexadecimal color codes | `#FF8040` |
| **HSL** | Hue, Saturation, Lightness | `hsl(20, 100%, 63%)` |

## 🏆 Scoring System

- **Easy**: 10 points + level bonus + streak bonus
- **Medium**: 20 points + level bonus + streak bonus
- **Hard**: 30 points + level bonus + streak bonus

**Bonus Multipliers:**
- Level Bonus: +2 points per level
- Streak Bonus: +5 points every 3 consecutive correct answers

## 🎖️ Achievements

- **Score Master**: Reach 1000 points
- **Hot Streak**: Get 10 correct answers in a row
- **Level Up**: Unlock new levels (every 5 streak)

## 🛠️ Installation

1. **Download** all files to a folder
2. **Open** `index.html` in a modern web browser
3. **Play** - No additional setup required!

## 📁 File Structure

```
ChromaVerse/
├── index.html      # Main game interface
├── styles.css      # Modern styling with glassmorphism
├── script.js       # Game logic and mechanics
└── README.md       # This file
```

## 🌐 Browser Support

- **Chrome** 60+ ✅
- **Firefox** 55+ ✅
- **Safari** 12+ ✅
- **Edge** 79+ ✅

## 🎵 Audio Features

- **Correct Answer**: Ascending chord progression
- **Wrong Answer**: Descending tone sequence
- **Hint Used**: Single notification tone
- **Achievement**: Celebratory melody

*Audio can be disabled in settings panel*

## 📱 Mobile Support

Fully responsive design optimized for:
- **Touch Interactions**: Large, touch-friendly buttons
- **Mobile Layout**: Adaptive grid system
- **Performance**: Optimized animations for mobile devices

## 🔧 Customization

### Difficulty Adjustment
Edit `getVarianceByDifficulty()` in `script.js`:
```javascript
easy: 80,    // Higher = easier
medium: 50,  // Medium difficulty
hard: 25     // Lower = harder
```

### Timer Duration
Modify timer in constructor:
```javascript
this.timeLeft = 30; // Change to desired seconds
```

## 🎨 Design Credits

- **Font**: Inter (Google Fonts)
- **Icons**: Unicode Emoji
- **Color Palette**: Custom gradient system
- **Effects**: CSS backdrop-filter and particle system

## 📄 License

Open source - feel free to modify and distribute!

---

**Enjoy playing ChromaVerse! 🎨✨**