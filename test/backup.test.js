import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exportData, importData } from '../src/backup.js';
import { loadDecks, saveDecks } from '../src/decks.js';
import { loadFlashcards, saveFlashcards } from '../src/storage.js';

function createLocalStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = value;
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      for (const k of Object.keys(store)) delete store[k];
    }
  };
}

test('exportData returns JSON with decks and flashcards', () => {
  global.localStorage = createLocalStorage({
    decks: JSON.stringify(['General']),
    flashcards: JSON.stringify([{ q: 'q1' }])
  });
  const json = exportData();
  assert.deepStrictEqual(JSON.parse(json), {
    decks: ['General'],
    flashcards: [{ q: 'q1' }]
  });
});

test('importData restores decks and flashcards', () => {
  global.localStorage = createLocalStorage();
  const ok = importData(JSON.stringify({
    decks: ['General', 'Extra'],
    flashcards: [{ q: 1 }]
  }));
  assert.strictEqual(ok, true);
  assert.deepStrictEqual(loadDecks(), ['General', 'Extra']);
  assert.deepStrictEqual(loadFlashcards(), [{ q: 1 }]);
});
