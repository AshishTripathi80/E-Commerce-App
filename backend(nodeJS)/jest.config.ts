import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    testMatch: ['**/test/**/*.test.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/test/$1',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!test/**',
    ],
}

export default config; 