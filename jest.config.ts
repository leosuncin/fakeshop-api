import type { InitialOptionsTsJest } from 'ts-jest/dist/types';
import { defaults as tsjPreset } from 'ts-jest/presets';
import { pathsToModuleNameMapper } from 'ts-jest/utils';

import { compilerOptions } from './tsconfig.json';

const config: InitialOptionsTsJest = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  transform: tsjPreset.transform,
  moduleDirectories: ['node_modules', '.'],
  watchPathIgnorePatterns: ['globalConfig', 'dist', 'coverage'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};

export default config;
