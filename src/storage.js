export function loadFlashcards() {
    const data = localStorage.getItem('flashcards');
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

export function saveFlashcards(cards) {
    localStorage.setItem('flashcards', JSON.stringify(cards));
}
