// src/recoil/atoms.js
import { atom } from 'recoil';

export const dreamSymbolsState = atom({
  key: 'dreamSymbolsState', // Unique key for this atom
  default: [],              // Default state (empty array)
});
