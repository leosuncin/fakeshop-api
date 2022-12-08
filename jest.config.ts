import { pathsToModuleNameMapper } from 'ts-jest';
import type { JestConfigWithTsJest } from 'ts-jest/dist/types';
import { defaults as tsjPreset } from 'ts-jest/presets';

import { compilerOptions } from './tsconfig.json';

const config: JestConfigWithTsJest = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  transform: tsjPreset.transform,
  moduleDirectories: ['node_modules', __dirname],
  watchPathIgnorePatterns: ['globalConfig', 'dist', 'coverage'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};

export default config;
