export function loadDecks() {
    const data = localStorage.getItem('decks');
    if (!data) return ['General'];
    try {
        const decks = JSON.parse(data);
        return decks.length ? decks : ['General'];
    } catch (e) {
        return ['General'];
    }
}

export function saveDecks(decks) {
    localStorage.setItem('decks', JSON.stringify(decks));
}

export function renderDeckOptions() {
    const select = document.getElementById('deck');
    if (!select) return;
    select.innerHTML = '';
    loadDecks().forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        select.appendChild(opt);
    });
}

export function addDeck() {
    const input = document.getElementById('new-deck');
    const name = input.value.trim();
    if (!name) return;
    const decks = loadDecks();
    if (!decks.includes(name)) {
        decks.push(name);
        saveDecks(decks);
    }
    input.value = '';
    renderDeckOptions();
    document.getElementById('deck').value = name;
}
