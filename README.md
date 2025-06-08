# 🚁 Matrix Helicopter - Philosophical Meditation Simulation

[![Tests](https://github.com/mahavak/helicopter/actions/workflows/test.yml/badge.svg)](https://github.com/mahavak/helicopter/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/coverage-34%25-yellow.svg)](./coverage)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

A contemplative helicopter flight simulation inspired by The Matrix, where philosophical exploration meets meditative gameplay. Navigate through digital landscapes while engaging in deep contemplation and unlocking insights through peaceful flight.

## 🌟 Features

### ✨ Core Experience
- **Realistic Helicopter Physics** - Advanced flight dynamics with collective, cyclic, and pedal controls
- **Matrix-Inspired Aesthetics** - Digital rain, code particles, and philosophical themes
- **Meditation Zones** - Specialized areas for contemplation and insight
- **Dynamic Day/Night Cycles** - Time-based atmospheric changes with Matrix transitions
- **Philosophical Achievement System** - Progress through contemplation and exploration

### 🎮 Flight Systems
- **Advanced Physics Engine** - Realistic lift, drag, and momentum simulation
- **Customizable Helicopters** - Theme-based visual modifications reflecting inner insights
- **Multiple Control Schemes** - Keyboard and gamepad support for all skill levels
- **Camera System** - Smooth third-person perspective with cinematic options

### 🌍 Environments
- **Cave of Shadows** - Deep contemplation on perception and reality
- **Garden of Forking Paths** - Exploration of choice and possibility
- **Observer's Paradox** - Questions about consciousness and observation
- **Ship of Theseus** - Identity and continuity exploration
- **Dynamic Weather** - Procedural weather systems affecting gameplay

### 🎵 Audio Experience
- **Procedural Soundscapes** - Adaptive audio based on flight and environment
- **Zone-Specific Narration** - Philosophical guidance in meditation areas
- **3D Spatial Audio** - Immersive helicopter and environmental sounds

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **Docker** (for consistent testing)
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/mahavak/helicopter.git
cd helicopter

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests in Docker (recommended)
npm run test:docker
```

### First Flight

1. **Launch the simulation**: `npm run dev`
2. **Basic Controls**:
   - `Space` - Collective (lift up)
   - `Shift` - Collective (lower)
   - `W/S` - Cyclic pitch (forward/backward)
   - `A/D` - Cyclic roll (left/right)
   - `Q/E` - Pedal (yaw left/right)
3. **Find a meditation zone** and hover peacefully to begin contemplation
4. **Explore the philosophy** through gentle flight and observation

## 🏗️ Architecture

### Project Structure
```
src/
├── helicopter/           # Flight mechanics and customization
│   ├── HelicopterController.js
│   └── HelicopterCustomization.js
├── environment/          # World systems
│   ├── DayNightCycle.js
│   └── WeatherSystem.js
├── audio/               # Sound and music systems
│   └── AudioManager.js
├── systems/             # Game logic
│   └── AchievementSystem.js
└── index.js            # Main entry point

tests/                   # Comprehensive test suite
├── helicopter/          # Flight system tests
├── environment/         # Environment tests
├── audio/              # Audio system tests
├── systems/            # Achievement tests
├── integration/        # Cross-system tests
└── __mocks__/          # Testing infrastructure
```

### Core Systems

#### 🚁 **Helicopter Controller**
- **Physics Engine**: Mass, lift, drag, gravity simulation
- **Control Processing**: Collective, cyclic, and pedal input handling
- **Visual Updates**: Rotor animation, glow effects, camera following
- **Ground Collision**: Realistic landing and takeoff mechanics

#### 🌅 **Day/Night Cycle**
- **Matrix Time Phases**: Digital dawn, code noon, virtual evening
- **Lighting Engine**: Dynamic sun positioning and intensity
- **Shader Effects**: Real-time sky and atmospheric rendering
- **Meditation Integration**: Time-based contemplation features

#### 🌧️ **Weather System**
- **Procedural Generation**: Dynamic weather pattern creation
- **Digital Effects**: Matrix rain, code snow, data storms
- **Performance Optimization**: Efficient particle systems
- **Atmospheric Integration**: Weather affects flight and mood

#### 🏆 **Achievement System**
- **Contemplative Milestones**: Progress through peaceful flight
- **Zone Mastery**: Deep exploration of philosophical areas
- **Insight Unlocking**: Content gated by contemplative achievements
- **Theme Progression**: Visual evolution through philosophical growth

## 🧪 Testing

Our comprehensive test suite ensures reliability and quality:

### Test Coverage
- **265 Total Tests** across all systems
- **90 Passing Tests** (34% coverage)
- **7 Test Suites** covering major components
- **Docker Integration** for consistent testing environments

### Running Tests

```bash
# Standard test run
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Docker-based testing (recommended)
npm run test:docker

# View detailed results
npm run test:verbose
```

### Test Categories
- **Unit Tests**: Individual component testing
- **Integration Tests**: Cross-system interactions
- **Philosophy Tests**: Meditation and achievement mechanics
- **Performance Tests**: Flight physics and rendering efficiency

## 🛠️ Development

### Development Setup

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Build for production
npm run build
```

### Code Quality
- **ESLint** configuration for consistent coding style
- **Jest** for comprehensive testing
- **Babel** for ES6+ compatibility
- **Docker** for environment consistency

### Contributing
Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and coding standards.

## 📊 Performance

### Optimization Features
- **Efficient Particle Systems** for weather and effects
- **Level-of-Detail** rendering for distant objects
- **Memory Management** for long meditation sessions
- **60 FPS Target** on modern hardware

### Browser Support
- **Chrome/Chromium** 90+ (recommended)
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🎯 Philosophy

### Core Concepts
- **Mindful Flight**: Using helicopter mechanics as meditation focus
- **Contemplative Exploration**: Discovery through peaceful observation
- **Digital Zen**: Finding tranquility in virtual environments
- **Progressive Insight**: Unlocking understanding through patient practice

### Meditation Zones
- **Cave of Shadows**: Exploration of perception vs. reality
- **Garden of Forking Paths**: Contemplation of choice and possibility
- **Observer's Paradox**: Questions about consciousness and measurement
- **Ship of Theseus**: Identity and continuity in the digital age

## 📈 Roadmap

### Current Status (v0.1.0)
- ✅ Core flight mechanics
- ✅ Basic meditation zones
- ✅ Day/night cycle system
- ✅ Achievement framework
- ✅ Comprehensive test suite

### Planned Features
- 🔄 **VR Support** - Immersive meditation experiences
- 🔄 **Multiplayer Contemplation** - Shared meditation sessions
- 🔄 **Advanced Weather** - More dynamic environmental systems
- 🔄 **Sound Design** - Enhanced 3D audio and music
- 🔄 **Mobile Support** - Touch-based flight controls

## 🤝 Contributing

We welcome contributions to the Matrix Helicopter project! Whether you're interested in:

- **Philosophy Integration** - Adding new meditation concepts
- **Technical Development** - Improving flight physics or rendering
- **Testing** - Expanding our comprehensive test suite
- **Documentation** - Helping others understand the project

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **The Matrix** franchise for philosophical inspiration
- **Three.js** community for 3D graphics foundation
- **Jest** team for robust testing framework
- **Open source contributors** who make projects like this possible

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [Wiki](https://github.com/mahavak/helicopter/wiki)
- **Issues**: [GitHub Issues](https://github.com/mahavak/helicopter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mahavak/helicopter/discussions)

---

*"There is no spoon, only the gentle rhythm of rotor blades and the peace found in digital skies."*

🚁✨ **Happy Flying and Deep Contemplation!** ✨🚁