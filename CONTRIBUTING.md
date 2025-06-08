# 🤝 Contributing to Matrix Helicopter

Thank you for your interest in contributing to the Matrix Helicopter project! This is a contemplative, open-source helicopter meditation simulation that welcomes contributions from developers, philosophers, artists, and anyone passionate about mindful technology.

## 🌟 Philosophy of Contribution

Before contributing, please understand our core principles:

- **Contemplation over Competition** - Features should enhance reflection, not add complexity
- **Mindfulness over Speed** - Quality and thoughtfulness trump rapid development
- **Philosophy over Technology** - Technical decisions should serve the meditative experience
- **Accessibility over Exclusivity** - The experience should be welcoming to all

## 🚀 Getting Started

### Development Environment Setup

1. **Prerequisites**
   ```bash
   # Required
   Node.js 18+
   Git
   
   # Recommended
   Docker (for consistent testing)
   VS Code (with recommended extensions)
   ```

2. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub
   git clone https://github.com/YOUR_USERNAME/helicopter.git
   cd helicopter
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Run Tests**
   ```bash
   # Quick test run
   npm test
   
   # Docker-based testing (recommended)
   npm run test:docker
   
   # Watch mode for development
   npm run test:watch
   ```

### Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run typecheck    # Run type checking

# Testing
npm test             # Run all tests
npm run test:docker  # Run tests in Docker
npm run test:watch   # Watch mode
npm run test:coverage # Generate coverage report

# Quality Assurance
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
```

## 🎯 Types of Contributions

### 🧘 Philosophical Contributions
- **New Meditation Zones** - Design contemplative spaces
- **Achievement Concepts** - Create mindfulness-based progression
- **Narrative Elements** - Add philosophical depth to experiences
- **Accessibility Features** - Make meditation accessible to all

### 🔧 Technical Contributions
- **Flight Physics** - Improve helicopter realism and feel
- **Performance Optimization** - Enhance rendering and memory usage
- **Cross-Platform Support** - Expand device and browser compatibility
- **Test Coverage** - Add tests for existing or new functionality

### 🎨 Creative Contributions
- **Visual Design** - Matrix-inspired aesthetics and effects
- **Audio Experience** - Ambient soundscapes and 3D audio
- **Animation Systems** - Smooth, meditative visual transitions
- **User Interface** - Intuitive, minimalist design

### 📚 Documentation Contributions
- **Code Documentation** - Improve inline comments and API docs
- **User Guides** - Help others learn to fly and meditate
- **Philosophy Documentation** - Explain the deeper concepts
- **Technical Architecture** - Document system designs

## 🛠️ Development Guidelines

### Code Quality Standards

#### JavaScript/ES6+
```javascript
// Use clear, contemplative variable names
const helicopterZenState = calculateMindfulness(flightData);

// Prefer functional programming for meditation logic
const processContemplation = (insight) => insight
  .filter(isRelevant)
  .map(deepenUnderstanding)
  .reduce(synthesizeWisdom, initialWisdom);

// Document complex philosophical algorithms
/**
 * Calculates the depth of contemplation based on flight stability
 * and zone presence. Higher stability in meditation zones increases
 * contemplative depth exponentially.
 */
function calculateContemplationDepth(flightStability, zonePresence) {
  // Implementation...
}
```

#### Three.js Best Practices
```javascript
// Dispose of resources properly for long meditation sessions
function cleanupMeditationZone(zone) {
  zone.geometry.dispose();
  zone.material.dispose();
  zone.texture?.dispose();
}

// Use efficient rendering for 60fps meditation
const renderLoop = () => {
  // Update only what's necessary
  updatePhilosophicalSystems(deltaTime);
  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
};
```

### Testing Philosophy

#### Test Coverage Goals
- **Unit Tests**: 70%+ coverage for core systems
- **Integration Tests**: All cross-system interactions
- **Philosophy Tests**: Meditation and achievement mechanics
- **Performance Tests**: 60fps maintenance under load

#### Test Writing Guidelines
```javascript
describe('Helicopter Physics', () => {
  test('should maintain stability during contemplation', () => {
    // Arrange: Set up peaceful flight conditions
    const helicopter = new HelicopterController(mockScene, mockCamera);
    const contemplativeControls = { gentle: true, mindful: true };
    
    // Act: Apply contemplative control inputs
    helicopter.processControls(contemplativeControls, deltaTime);
    
    // Assert: Verify peaceful flight characteristics
    expect(helicopter.velocity).toBeMindful();
    expect(helicopter.angularVelocity).toBeGentle();
  });
});
```

### Git Workflow

#### Branch Naming
```bash
# Feature branches
git checkout -b feature/meditation-zone-expansion
git checkout -b feature/advanced-flight-physics

# Bug fixes
git checkout -b fix/helicopter-instability
git checkout -b fix/audio-memory-leak

# Philosophy enhancements
git checkout -b philosophy/ship-of-theseus-zone
git checkout -b philosophy/achievement-system-v2
```

#### Commit Messages
Follow the contemplative commit format:

```bash
# Format: type(scope): contemplative description
git commit -m "feat(meditation): add Ship of Theseus contemplation zone"
git commit -m "fix(physics): resolve helicopter drift during mindful hovering"
git commit -m "docs(philosophy): expand Cave of Shadows documentation"
git commit -m "test(integration): add cross-system meditation flow tests"

# Types: feat, fix, docs, style, refactor, test, chore, philosophy
```

## 🧪 Testing Contributions

### Running the Test Suite

Our comprehensive test suite ensures the contemplative experience remains stable:

```bash
# Full test suite (265 tests)
npm test

# Docker-based testing (recommended for consistency)
npm run test:docker

# Watch specific test files during development
npm run test:watch -- tests/helicopter/

# Generate detailed coverage report
npm run test:coverage
```

### Writing New Tests

When adding new features, please include tests:

1. **Unit Tests** for individual components
2. **Integration Tests** for system interactions
3. **Philosophy Tests** for meditation mechanics
4. **Performance Tests** for rendering/memory

Example test structure:
```javascript
// tests/new-feature/NewFeature.test.js
const { NewFeature } = require('../../src/new-feature/NewFeature.js');

describe('NewFeature', () => {
  describe('Contemplative Behavior', () => {
    test('should enhance mindfulness when used properly', () => {
      // Test implementation
    });
  });
  
  describe('Performance', () => {
    test('should maintain 60fps during intensive use', () => {
      // Performance test
    });
  });
});
```

## 🔄 Pull Request Process

### Before Submitting
1. **Run Tests**: Ensure all tests pass locally
   ```bash
   npm test && npm run test:docker
   ```

2. **Check Code Quality**:
   ```bash
   npm run lint
   npm run typecheck
   ```

3. **Update Documentation**: Add/update relevant docs

4. **Test Manually**: Experience your changes in the simulation

### PR Template

When submitting a pull request, please use this template:

```markdown
## 🚁 Matrix Helicopter Contribution

### 🎯 Purpose
Brief description of what this PR accomplishes and why.

### 🧘 Philosophical Impact
How does this change enhance the contemplative experience?

### 🔧 Technical Changes
- List of technical modifications
- New dependencies (if any)
- Performance considerations

### 🧪 Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed
- [ ] Docker tests pass

### 🎮 User Experience
Describe how this affects the meditation/flight experience.

### 📸 Screenshots/Videos
If applicable, show visual changes.

### ✅ Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or properly documented)
```

### Review Process
1. **Automated Testing**: GitHub Actions will run all tests
2. **Code Review**: Maintainers will review for quality and philosophy alignment
3. **Testing**: Changes will be tested in the full simulation
4. **Merge**: Approved PRs will be merged into the main branch

## 🎨 Design Guidelines

### Visual Aesthetics
- **Color Palette**: Primarily Matrix greens (#00ff00, #003300) with strategic blacks
- **Typography**: Monospace fonts for code elements, clean sans-serif for UI
- **Animation**: Smooth, gentle transitions that don't break contemplation
- **Lighting**: Subtle, atmospheric lighting that enhances mood

### User Interface Principles
- **Minimalism**: Remove anything that doesn't serve contemplation
- **Intuitive Controls**: Flight should feel natural and peaceful
- **Progressive Disclosure**: Advanced features revealed through contemplation
- **Accessibility**: Support for different abilities and preferences

### Audio Design
- **Ambient Soundscapes**: Non-intrusive background audio
- **3D Spatial Audio**: Immersive positioning for environmental sounds
- **Dynamic Volume**: Audio that responds to flight state and location
- **Silence**: Respect for quiet contemplation when appropriate

## 🤔 Philosophy Guidelines

### Meditation Zone Design
When creating new contemplative spaces:

1. **Philosophical Foundation**: Base on established philosophical concepts
2. **Environmental Storytelling**: Let the space convey meaning through design
3. **Interactive Elements**: Subtle ways to engage with the philosophical theme
4. **Peaceful Pacing**: No time pressure or stressful elements

### Achievement System Principles
- **Contemplative Progress**: Achievements through mindfulness, not skill
- **Intrinsic Motivation**: Rewards that enhance understanding
- **Non-Competitive**: Personal journey rather than comparison
- **Meaningful Milestones**: Achievements that reflect real contemplative growth

## 🐛 Bug Reports

### Before Reporting
1. **Search Existing Issues**: Check if the bug is already reported
2. **Reproduce Consistently**: Ensure the bug occurs reliably
3. **Test in Multiple Browsers**: Verify cross-platform behavior
4. **Check Console**: Look for JavaScript errors or warnings

### Bug Report Template
```markdown
## 🐛 Bug Report

### Expected Behavior
What should happen during meditation/flight?

### Actual Behavior
What actually happens?

### Steps to Reproduce
1. Step one
2. Step two
3. Observe issue

### Environment
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop/Mobile
- Version: v0.1.0

### Console Output
```
Paste any console errors here
```

### Additional Context
Screenshots, videos, or other helpful information.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## ✨ Feature Request

### Philosophical Motivation
Why would this enhance the contemplative experience?

### Proposed Implementation
How might this work technically?

### User Experience
How would users interact with this feature?

### Alternatives Considered
What other approaches did you consider?

### Additional Context
Any other relevant information.
```

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and philosophy discussions
- **Documentation**: Check the [Wiki](https://github.com/mahavak/helicopter/wiki)
- **Code Comments**: Detailed explanations in the source code

### Common Questions

**Q: How do I add a new meditation zone?**
A: See the `src/environment/` directory and existing zone implementations. Each zone needs philosophical grounding, environmental design, and achievement integration.

**Q: Why are my tests failing?**
A: Run `npm run test:docker` for consistent results. Check that you're following the testing patterns in existing test files.

**Q: How do I improve performance?**
A: Profile using browser dev tools, optimize Three.js rendering, and ensure proper resource disposal. See the performance guidelines in the codebase.

## 🙏 Recognition

### Contributors
All contributors will be recognized in:
- **README.md**: Contributors section
- **Release Notes**: Major contributions highlighted
- **In-Game Credits**: Name in the simulation's credits
- **Philosophy Documentation**: Philosophical contributors in concept docs

### Types of Recognition
- **Code Contributors**: Technical improvements and bug fixes
- **Philosophy Contributors**: Conceptual and design contributions
- **Documentation Contributors**: Writing and explanation improvements
- **Community Contributors**: Helping others and fostering discussion

---

## 🚁 Final Words

Contributing to Matrix Helicopter means joining a contemplative community focused on mindful technology. Whether you're debugging flight physics, designing meditation zones, or improving documentation, your contributions help create a more peaceful digital experience.

Remember: *"There is no spoon, but there is always room for thoughtful improvement."*

Thank you for contributing to the journey of digital contemplation! 🧘‍♂️✨

---

*For questions about contributing, please open a GitHub Discussion or reach out through the project's communication channels.*