import { loadFlashcards, saveFlashcards } from './storage.js';
import { loadDecks, saveDecks } from './decks.js';

export function exportData() {
  const data = {
    decks: loadDecks(),
    flashcards: loadFlashcards()
  };
  return JSON.stringify(data, null, 2);
}

export function importData(json) {
  let data;
  try {
    data = JSON.parse(json);
  } catch {
    return false;
  }
  if (!data || !Array.isArray(data.decks) || !Array.isArray(data.flashcards)) {
    return false;
  }
  saveDecks(data.decks.length ? data.decks : ['General']);
  saveFlashcards(data.flashcards);
  return true;
}
