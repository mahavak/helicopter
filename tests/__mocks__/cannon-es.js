// Mock implementation of Cannon-ES for testing

const mockVec3 = {
  x: 0,
  y: 0,
  z: 0,
  set: jest.fn(),
  copy: jest.fn(),
  clone: jest.fn(),
  add: jest.fn(),
  subtract: jest.fn(),
  scale: jest.fn(),
  length: jest.fn(() => 0),
  normalize: jest.fn()
};

const mockQuaternion = {
  x: 0,
  y: 0,
  z: 0,
  w: 1,
  set: jest.fn(),
  setFromAxisAngle: jest.fn(),
  mult: jest.fn()
};

const mockBody = {
  position: mockVec3,
  velocity: mockVec3,
  angularVelocity: mockVec3,
  quaternion: mockQuaternion,
  mass: 1,
  material: null,
  shape: null,
  type: 1,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addShape: jest.fn(),
  removeShape: jest.fn(),
  wakeUp: jest.fn(),
  sleep: jest.fn()
};

const mockWorld = {
  gravity: mockVec3,
  bodies: [],
  constraints: [],
  contacts: [],
  addBody: jest.fn(),
  removeBody: jest.fn(),
  addConstraint: jest.fn(),
  removeConstraint: jest.fn(),
  step: jest.fn(),
  raycastClosest: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

const mockShape = {
  type: 1,
  material: null,
  body: null,
  boundingSphereRadius: 1,
  calculateLocalInertia: jest.fn(),
  volume: jest.fn(() => 1)
};

const mockMaterial = {
  friction: 0.3,
  restitution: 0.3,
  contactEquationStiffness: 1e8,
  contactEquationRelaxation: 3,
  frictionEquationStiffness: 1e8,
  frictionEquationRelaxation: 3
};

// Constructor functions
const Vec3 = jest.fn(() => ({ ...mockVec3 }));
const Quaternion = jest.fn(() => ({ ...mockQuaternion }));
const Body = jest.fn(() => ({ ...mockBody }));
const World = jest.fn(() => ({ ...mockWorld }));
const Box = jest.fn(() => ({ ...mockShape }));
const Sphere = jest.fn(() => ({ ...mockShape }));
const Cylinder = jest.fn(() => ({ ...mockShape }));
const Plane = jest.fn(() => ({ ...mockShape }));
const Material = jest.fn(() => ({ ...mockMaterial }));

// Constants
const BODY_TYPES = {
  DYNAMIC: 1,
  STATIC: 2,
  KINEMATIC: 4
};

module.exports = {
  Vec3,
  Quaternion,
  Body,
  World,
  Box,
  Sphere,
  Cylinder,
  Plane,
  Material,
  BODY_TYPES
};