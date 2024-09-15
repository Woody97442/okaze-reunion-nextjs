import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jsdom', // Pour les tests frontend
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'd.ts'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // configurer Jest DOM avec TS
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/$1',
    },
};

export default config;
