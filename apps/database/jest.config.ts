/* eslint-disable */
export default {
  displayName: 'database',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['js', 'ts'],
  coverageDirectory: '../../coverage/apps/database',
  globalSetup: './jest.setup.ts',
};
