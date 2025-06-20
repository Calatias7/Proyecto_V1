import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadDecks,
  saveDecks,
  addDeck,
  deleteDeck
} from '../src/decks.js';
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

function setupDOM() {
  const elements = {
    'new-deck': { value: '' },
    'deck': {
      value: '',
      innerHTML: '',
      children: [],
      appendChild(child) {
        this.children.push(child);
      }
    }
  };
  global.document = {
    elements,
    getElementById(id) {
      return this.elements[id] || null;
    },
    createElement() {
      return { value: '', textContent: '', appendChild() {} };
    }
  };
}

test('loadDecks and saveDecks roundtrip', () => {
  global.localStorage = createLocalStorage();
  saveDecks(['General', 'Extra']);
  assert.deepStrictEqual(loadDecks(), ['General', 'Extra']);
});

test('addDeck stores new deck and updates input', () => {
  global.localStorage = createLocalStorage({ decks: JSON.stringify(['General']) });
  setupDOM();
  global.document.getElementById('new-deck').value = 'Extra';
  addDeck();
  assert.deepStrictEqual(loadDecks(), ['General', 'Extra']);
  assert.strictEqual(global.document.getElementById('new-deck').value, '');
  assert.strictEqual(global.document.getElementById('deck').value, 'Extra');
});

test('deleteDeck removes deck and related cards', () => {
  global.localStorage = createLocalStorage({
    decks: JSON.stringify(['General', 'Extra']),
    flashcards: JSON.stringify([
      { deck: 'Extra', q: 1 },
      { deck: 'General', q: 2 }
    ])
  });
  setupDOM();
  global.document.getElementById('deck').value = 'Extra';
  global.confirm = () => true;
  deleteDeck();
  assert.deepStrictEqual(loadDecks(), ['General']);
  assert.deepStrictEqual(loadFlashcards(), [{ deck: 'General', q: 2 }]);
  assert.strictEqual(global.document.getElementById('deck').value, 'General');
});

test('loadFlashcards and saveFlashcards roundtrip', () => {
  global.localStorage = createLocalStorage();
  const cards = [{ q: 'q1', a: 'a1' }];
  saveFlashcards(cards);
  assert.deepStrictEqual(loadFlashcards(), cards);
});
