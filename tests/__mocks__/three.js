// Mock implementation of Three.js for testing

const mockVector3 = {
  x: 0,
  y: 0,
  z: 0,
  set: jest.fn(function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }),
  add: jest.fn(function(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }),
  sub: jest.fn(function(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }),
  multiply: jest.fn(function(v) { this.x *= v.x; this.y *= v.y; this.z *= v.z; return this; }),
  multiplyScalar: jest.fn(function(s) { this.x *= s; this.y *= s; this.z *= s; return this; }),
  normalize: jest.fn(function() { const len = this.length(); if (len > 0) { this.x /= len; this.y /= len; this.z /= len; } return this; }),
  length: jest.fn(function() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }),
  copy: jest.fn(function(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }),
  clone: jest.fn(function() { return new Vector3(this.x, this.y, this.z); }),
  distanceTo: jest.fn(() => 0),
  setLength: jest.fn(function(length) { this.normalize().multiplyScalar(length); return this; }),
  applyMatrix4: jest.fn(function() { return this; }),
  applyQuaternion: jest.fn(function() { return this; }),
  applyEuler: jest.fn(function() { return this; })
};

const mockEuler = {
  x: 0,
  y: 0,
  z: 0,
  set: jest.fn(function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }),
  setFromQuaternion: jest.fn(function() { return this; }),
  copy: jest.fn(function(e) { this.x = e.x; this.y = e.y; this.z = e.z; return this; })
};

const mockQuaternion = {
  x: 0,
  y: 0,
  z: 0,
  w: 1,
  set: jest.fn(),
  setFromEuler: jest.fn(),
  multiply: jest.fn(),
  slerp: jest.fn()
};

const mockMatrix4 = {
  elements: new Array(16).fill(0),
  identity: jest.fn(),
  makeTranslation: jest.fn(),
  makeRotationX: jest.fn(),
  makeRotationY: jest.fn(),
  makeRotationZ: jest.fn(),
  multiply: jest.fn(),
  set: jest.fn()
};

const mockColor = {
  r: 1,
  g: 1,
  b: 1,
  set: jest.fn(),
  setHex: jest.fn(),
  setRGB: jest.fn(),
  copy: jest.fn(),
  clone: jest.fn(() => mockColor)
};

const mockMaterial = {
  color: Object.create(mockColor),
  emissive: Object.create(mockColor), 
  transparent: false,
  opacity: 1,
  side: 0,
  vertexColors: false,
  uniforms: {}
};

const mockGeometry = {
  attributes: {},
  index: null,
  boundingBox: null,
  boundingSphere: null,
  dispose: jest.fn(),
  computeBoundingBox: jest.fn(),
  computeBoundingSphere: jest.fn(),
  setIndex: jest.fn(),
  setAttribute: jest.fn(),
  getAttribute: jest.fn()
};

const mockVector2 = {
  x: 0,
  y: 0,
  set: jest.fn(function(x, y) { this.x = x; this.y = y; return this; }),
  copy: jest.fn(function(v) { this.x = v.x; this.y = v.y; return this; }),
  clone: jest.fn(function() { return new Vector2(this.x, this.y); })
};

const mockObject3D = {
  position: Object.create(mockVector3),
  rotation: Object.create(mockEuler),
  scale: Object.create(mockVector3),
  quaternion: Object.create(mockQuaternion),
  matrix: Object.create(mockMatrix4),
  matrixWorld: Object.create(mockMatrix4),
  parent: null,
  children: [],
  visible: true,
  userData: {},
  add: jest.fn(),
  remove: jest.fn(),
  getWorldPosition: jest.fn(() => Object.create(mockVector3)),
  getWorldQuaternion: jest.fn(() => Object.create(mockQuaternion)),
  lookAt: jest.fn(),
  updateMatrix: jest.fn(),
  updateMatrixWorld: jest.fn(),
  traverse: jest.fn((callback) => {
    // Simulate traversing children
    callback(mockObject3D);
    mockObject3D.children.forEach(child => callback(child));
  }),
  clone: jest.fn(() => Object.create(mockObject3D))
};

const mockMesh = {
  ...mockObject3D,
  geometry: mockGeometry,
  material: mockMaterial,
  isMesh: true
};

const mockGroup = {
  ...mockObject3D,
  isGroup: true,
  add: jest.fn(function(object) {
    this.children.push(object);
  }),
  remove: jest.fn(function(object) {
    const index = this.children.indexOf(object);
    if (index !== -1) this.children.splice(index, 1);
  })
};

const mockScene = {
  ...mockObject3D,
  background: null,
  fog: null,
  isScene: true
};

const mockCamera = {
  ...mockObject3D,
  fov: 75,
  aspect: 1,
  near: 0.1,
  far: 1000,
  zoom: 1,
  updateProjectionMatrix: jest.fn(),
  setViewOffset: jest.fn(),
  clearViewOffset: jest.fn()
};

const mockLight = {
  ...mockObject3D,
  color: mockColor,
  intensity: 1,
  isLight: true
};

const mockAudioListener = {
  ...mockObject3D,
  context: {
    currentTime: 0,
    createOscillator: jest.fn(),
    createGain: jest.fn(),
    createAnalyser: jest.fn(),
    createDelay: jest.fn(),
    createBiquadFilter: jest.fn(),
    destination: {}
  },
  gain: {
    connect: jest.fn(),
    disconnect: jest.fn()
  }
};

const mockAudio = {
  ...mockObject3D,
  isPlaying: false,
  hasPlaybackControl: true,
  sourceType: 'empty',
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  setBuffer: jest.fn(),
  setLoop: jest.fn(),
  setVolume: jest.fn(),
  getVolume: jest.fn(() => 1)
};

const mockShaderMaterial = {
  ...mockMaterial,
  uniforms: {
    time: { value: 0 },
    intensity: { value: 1 },
    matrixColor: { value: Object.create(mockColor) },
    voidColor: { value: Object.create(mockColor) },
    resolution: { value: Object.create(mockVector2) },
    phase: { value: 0 },
    opacity: { value: 1 }
  },
  vertexShader: '',
  fragmentShader: '',
  isShaderMaterial: true
};

const mockTexture = {
  image: null,
  mapping: 1000,
  wrapS: 1001,
  wrapT: 1001,
  magFilter: 1006,
  minFilter: 1008,
  format: 1023,
  type: 1009,
  anisotropy: 1,
  encoding: 3000,
  dispose: jest.fn()
};

const mockBufferGeometry = {
  attributes: {},
  index: null,
  boundingBox: null,
  boundingSphere: null,
  dispose: jest.fn(),
  computeBoundingBox: jest.fn(),
  computeBoundingSphere: jest.fn(),
  setIndex: jest.fn(),
  setAttribute: jest.fn(),
  getAttribute: jest.fn(),
  addGroup: jest.fn(),
  setFromPoints: jest.fn()
};

const mockBufferAttribute = {
  array: [],
  count: 0,
  itemSize: 1,
  normalized: false,
  usage: 35044,
  updateRange: { offset: 0, count: 0 },
  setUsage: jest.fn(),
  copy: jest.fn(),
  clone: jest.fn(),
  setArray: jest.fn(),
  setItemSize: jest.fn(),
  setNormalized: jest.fn()
};

const mockAudioLoader = {
  load: jest.fn((url, onLoad, onProgress, onError) => {
    if (onLoad) {
      // Simulate loading an audio buffer
      setTimeout(() => onLoad({}), 0);
    }
  }),
  setPath: jest.fn(),
  setResponseType: jest.fn(),
  setWithCredentials: jest.fn(),
  setRequestHeader: jest.fn()
};

// Constructor functions
const Vector2 = jest.fn(function(x = 0, y = 0) {
  const instance = Object.create(mockVector2);
  instance.x = x;
  instance.y = y;
  return instance;
});
const Vector3 = jest.fn(function(x = 0, y = 0, z = 0) {
  const instance = Object.create(mockVector3);
  instance.x = x;
  instance.y = y;
  instance.z = z;
  return instance;
});
const Euler = jest.fn(function(x = 0, y = 0, z = 0) {
  const instance = Object.create(mockEuler);
  instance.x = x;
  instance.y = y;
  instance.z = z;
  return instance;
});
const Quaternion = jest.fn(function(x = 0, y = 0, z = 0, w = 1) {
  const instance = Object.create(mockQuaternion);
  instance.x = x;
  instance.y = y;
  instance.z = z;
  instance.w = w;
  return instance;
});
const Matrix4 = jest.fn(function() {
  return Object.create(mockMatrix4);
});
const Color = jest.fn(function(color) {
  return Object.create(mockColor);
});
const Object3D = jest.fn(function() {
  const instance = Object.create(mockObject3D);
  instance.position = Object.create(mockVector3);
  instance.rotation = Object.create(mockEuler);
  instance.scale = Object.create(mockVector3);
  instance.quaternion = Object.create(mockQuaternion);
  instance.matrix = Object.create(mockMatrix4);
  instance.matrixWorld = Object.create(mockMatrix4);
  instance.children = [];
  return instance;
});
const Group = jest.fn(function() {
  const instance = Object.create(mockGroup);
  instance.position = Object.create(mockVector3);
  instance.rotation = Object.create(mockEuler);
  instance.scale = Object.create(mockVector3);
  instance.quaternion = Object.create(mockQuaternion);
  instance.matrix = Object.create(mockMatrix4);
  instance.matrixWorld = Object.create(mockMatrix4);
  instance.children = [];
  return instance;
});
const Scene = jest.fn(() => ({ ...mockScene }));
const PerspectiveCamera = jest.fn(() => ({ ...mockCamera }));
const Mesh = jest.fn((geometry, material) => ({ 
  ...mockMesh,
  geometry: geometry || mockGeometry,
  material: material || mockMaterial
}));
const BoxGeometry = jest.fn(() => ({ ...mockGeometry }));
const SphereGeometry = jest.fn(() => ({ ...mockGeometry }));
const CylinderGeometry = jest.fn(() => ({ ...mockGeometry }));
const CapsuleGeometry = jest.fn(() => ({ ...mockGeometry }));
const PlaneGeometry = jest.fn(() => ({ ...mockGeometry }));
const MeshBasicMaterial = jest.fn(function(params = {}) {
  const material = Object.create(mockMaterial);
  material.color = Object.create(mockColor);
  material.emissive = Object.create(mockColor);
  return material;
});
const MeshLambertMaterial = jest.fn(function(params = {}) {
  const material = Object.create(mockMaterial);
  material.color = Object.create(mockColor);
  material.emissive = Object.create(mockColor);
  return material;
});
const MeshPhongMaterial = jest.fn(function(params = {}) {
  const material = Object.create(mockMaterial);
  material.color = Object.create(mockColor);
  material.emissive = Object.create(mockColor);
  return material;
});
const ShaderMaterial = jest.fn(function(params = {}) {
  const material = Object.create(mockShaderMaterial);
  material.color = Object.create(mockColor);
  material.emissive = Object.create(mockColor);
  material.uniforms = {
    time: { value: 0 },
    intensity: { value: 1 },
    matrixColor: { value: Object.create(mockColor) },
    voidColor: { value: Object.create(mockColor) },
    resolution: { value: Object.create(mockVector2) },
    phase: { value: 0 },
    opacity: { value: 1 },
    ...params.uniforms
  };
  return material;
});
const DirectionalLight = jest.fn(() => ({ ...mockLight }));
const AmbientLight = jest.fn(() => ({ ...mockLight }));
const PointLight = jest.fn(() => ({ ...mockLight }));
const AudioListener = jest.fn(() => ({ ...mockAudioListener }));
const Audio = jest.fn(() => ({ ...mockAudio }));
const Texture = jest.fn(() => ({ ...mockTexture }));
const AudioLoader = jest.fn(() => ({ ...mockAudioLoader }));
const BufferGeometry = jest.fn(() => ({ ...mockBufferGeometry }));
const BufferAttribute = jest.fn((array, itemSize) => ({
  ...mockBufferAttribute,
  array: array || [],
  itemSize: itemSize || 1,
  count: array ? array.length / (itemSize || 1) : 0
}));
const Float32BufferAttribute = jest.fn((array, itemSize) => ({
  ...mockBufferAttribute,
  array: array || new Float32Array(),
  itemSize: itemSize || 1,
  count: array ? array.length / (itemSize || 1) : 0
}));

// THREE.MathUtils
const MathUtils = {
  lerp: jest.fn((a, b, alpha) => a + (b - a) * alpha),
  clamp: jest.fn((value, min, max) => Math.max(min, Math.min(max, value))),
  mapLinear: jest.fn((x, a1, a2, b1, b2) => b1 + (x - a1) * (b2 - b1) / (a2 - a1)),
  smoothstep: jest.fn((x, min, max) => {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * (3 - 2 * x);
  }),
  smootherstep: jest.fn((x, min, max) => {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * x * (x * (x * 6 - 15) + 10);
  }),
  randFloat: jest.fn(() => Math.random()),
  randFloatSpread: jest.fn((range) => range * (0.5 - Math.random())),
  degToRad: jest.fn((degrees) => degrees * Math.PI / 180),
  radToDeg: jest.fn((radians) => radians * 180 / Math.PI)
};

// Constants
const FrontSide = 0;
const BackSide = 1;
const DoubleSide = 2;
const AdditiveBlending = 2;
const PCFSoftShadowMap = 1;

// Additional objects
const Clock = jest.fn(() => ({
  autoStart: true,
  startTime: 0,
  oldTime: 0,
  elapsedTime: 0,
  running: false,
  start: jest.fn(),
  stop: jest.fn(),
  getElapsedTime: jest.fn(() => 0),
  getDelta: jest.fn(() => 0.016)
}));

const Fog = jest.fn((color, near, far) => ({
  isFog: true,
  color: Object.create(mockColor),
  near: near || 1,
  far: far || 1000
}));

module.exports = {
  Vector2,
  Vector3,
  Euler,
  Quaternion,
  Matrix4,
  Color,
  Object3D,
  Group,
  Scene,
  PerspectiveCamera,
  Mesh,
  BoxGeometry,
  SphereGeometry,
  CylinderGeometry,
  CapsuleGeometry,
  PlaneGeometry,
  BufferGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  ShaderMaterial,
  DirectionalLight,
  AmbientLight,
  PointLight,
  AudioListener,
  Audio,
  AudioLoader,
  Texture,
  BufferAttribute,
  Float32BufferAttribute,
  Clock,
  Fog,
  MathUtils,
  FrontSide,
  BackSide,
  DoubleSide,
  AdditiveBlending,
  PCFSoftShadowMap
};