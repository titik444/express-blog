import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  rootDir: './src',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/__tests__/**/*.spec.ts'],

  // Supaya Prisma & Express tidak crash karena koneksi paralel
  maxWorkers: 1,

  // Auto load env.test
  setupFiles: ['<rootDir>/../jest.setup.ts']
}

export default config
