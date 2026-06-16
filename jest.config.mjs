const sharedConfig = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
};

export default {
  projects: [
    {
      ...sharedConfig,
      testEnvironment: 'jsdom',
      displayName: 'jsdom-tests',
    },
    {
      ...sharedConfig,
      testEnvironment: 'node',
      displayName: 'node-tests',
    },
  ],
};
