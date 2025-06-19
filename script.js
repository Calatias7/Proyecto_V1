// ----- Gestión de mazos -----
function loadDecks() {
    const data = localStorage.getItem('decks');
    if (!data) return [{ name: 'Mazo 1', cards: [] }];
    try {
        const decks = JSON.parse(data);
        if (Array.isArray(decks) && decks.length > 0) {
            return decks;
        }
        return [{ name: 'Mazo 1', cards: [] }];
    } catch (e) {
        return [{ name: 'Mazo 1', cards: [] }];
    }
}

function saveDecks(decks) {
    localStorage.setItem('decks', JSON.stringify(decks));
}

let currentDeckIndex = 0;
let editingIndex = null; // Índice de tarjeta en modo edición, null si nueva

function loadFlashcards() {
    const decks = loadDecks();
    const deck = decks[currentDeckIndex] || { cards: [] };
    return deck.cards;
}

function saveFlashcards(cards) {
    const decks = loadDecks();
    if (!decks[currentDeckIndex]) return;
    decks[currentDeckIndex].cards = cards;
    saveDecks(decks);
}

// Renderiza el formulario según el tipo de tarjeta seleccionado
function renderFields(type) {
    const container = document.getElementById('dynamic-fields');
    container.innerHTML = '';

    if (type === 'classic') {
        container.innerHTML = `
            <label for="question">Pregunta:</label>
            <input type="text" id="question" required>
            <label for="answer">Respuesta:</label>
            <input type="text" id="answer" required>
        `;
    } else if (type === 'tf') {
        container.innerHTML = `
            <label for="statement">Enunciado:</label>
            <input type="text" id="statement" required>
            <label>
                <input type="checkbox" id="isTrue"> Es verdadero
            </label>
        `;
    }
}

// Agrega una tarjeta nueva a la lista y guarda en localStorage
function addFlashcard(event) {
    event.preventDefault();
    const type = document.getElementById('type').value;
    const cards = loadFlashcards();
    let card;

    if (type === 'classic') {
        const question = document.getElementById('question').value.trim();
        const answer = document.getElementById('answer').value.trim();
        card = { type, question, answer };
    } else {
        const statement = document.getElementById('statement').value.trim();
        const isTrue = document.getElementById('isTrue').checked;
        card = { type, statement, isTrue };
    }

    if (editingIndex !== null) {
        // Si estamos editando, reemplazamos la tarjeta existente
        cards[editingIndex] = card;
        editingIndex = null;
    } else {
        // Si no, agregamos una nueva
        cards.push(card);
    }
    saveFlashcards(cards);
    renderList();
    event.target.reset();
    renderFields(type); // Reiniciar campos según tipo
}

// Elimina una tarjeta por índice
function deleteFlashcard(index) {
    const cards = loadFlashcards();
    cards.splice(index, 1);
    saveFlashcards(cards);
    renderList();
}

// Borra todas las tarjetas almacenadas
function clearAllFlashcards() {
    const decks = loadDecks();
    if (!decks[currentDeckIndex]) return;
    decks[currentDeckIndex].cards = [];
    saveDecks(decks);
    renderList();
}

// Habilita o deshabilita el botón "Eliminar todas" según haya tarjetas
function updateClearButton() {
    const btn = document.getElementById('clear-all');
    if (btn) {
        btn.disabled = loadFlashcards().length === 0;
    }
}

// ----- Funciones para manejar mazos -----
function renderDeckOptions() {
    const select = document.getElementById('deck-select');
    if (!select) return;
    const decks = loadDecks();
    select.innerHTML = '';
    decks.forEach((deck, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = deck.name;
        select.appendChild(opt);
    });
    select.value = currentDeckIndex;
}

function createDeck() {
    const name = prompt('Nombre del mazo:');
    if (!name) return;
    const decks = loadDecks();
    decks.push({ name: name.trim(), cards: [] });
    currentDeckIndex = decks.length - 1;
    saveDecks(decks);
    renderDeckOptions();
    renderList();
}

function renameDeck() {
    const decks = loadDecks();
    const deck = decks[currentDeckIndex];
    if (!deck) return;
    const name = prompt('Nuevo nombre del mazo:', deck.name);
    if (!name) return;
    deck.name = name.trim();
    saveDecks(decks);
    renderDeckOptions();
}

function deleteDeck() {
    const decks = loadDecks();
    if (decks.length <= 1) return;
    if (!confirm('¿Eliminar este mazo?')) return;
    decks.splice(currentDeckIndex, 1);
    if (currentDeckIndex >= decks.length) {
        currentDeckIndex = decks.length - 1;
    }
    saveDecks(decks);
    renderDeckOptions();
    renderList();
}

function handleDeckChange(e) {
    currentDeckIndex = parseInt(e.target.value, 10) || 0;
    renderList();
}

// Carga una tarjeta en el formulario para editarla
function editFlashcard(index) {
    const cards = loadFlashcards();
    const card = cards[index];
    if (!card) return;

    // Establece el tipo y dibuja los campos correspondientes
    const typeSelect = document.getElementById('type');
    typeSelect.value = card.type;
    renderFields(card.type);

    if (card.type === 'classic') {
        document.getElementById('question').value = card.question;
        document.getElementById('answer').value = card.answer;
    } else {
        document.getElementById('statement').value = card.statement;
        document.getElementById('isTrue').checked = card.isTrue;
    }

    // Guardamos el índice en edición
    editingIndex = index;
}

// Muestra todas las tarjetas en el listado
function renderList() {
    const list = document.getElementById('flashcard-list');
    list.innerHTML = '';
    const cards = loadFlashcards();

    cards.forEach((card, index) => {
        const li = document.createElement('li');
        li.className = 'flashcard';

        if (card.type === 'classic') {
            const qLabel = document.createElement('strong');
            qLabel.textContent = 'Pregunta:';
            li.appendChild(qLabel);
            li.appendChild(document.createTextNode(' ' + card.question));
            li.appendChild(document.createElement('br'));

            const aLabel = document.createElement('strong');
            aLabel.textContent = 'Respuesta:';
            li.appendChild(aLabel);
            li.appendChild(document.createTextNode(' ' + card.answer));
        } else {
            const sLabel = document.createElement('strong');
            sLabel.textContent = 'Enunciado:';
            li.appendChild(sLabel);
            li.appendChild(document.createTextNode(' ' + card.statement));
            li.appendChild(document.createElement('br'));

            const tLabel = document.createElement('strong');
            tLabel.textContent = 'Es verdadero:';
            li.appendChild(tLabel);
            li.appendChild(document.createTextNode(' ' + (card.isTrue ? 'Sí' : 'No')));
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.addEventListener('click', () => deleteFlashcard(index));

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.style.marginLeft = '0.5rem';
        editBtn.addEventListener('click', () => editFlashcard(index));

        li.appendChild(document.createElement('br'));
        li.appendChild(deleteBtn);
        li.appendChild(editBtn);
        list.appendChild(li);
    });

    updateClearButton();
}

// Configura eventos iniciales
function init() {
    const typeSelect = document.getElementById('type');
    renderFields(typeSelect.value);
    typeSelect.addEventListener('change', (e) => renderFields(e.target.value));
    document.getElementById('flashcard-form').addEventListener('submit', addFlashcard);
    const clearBtn = document.getElementById('clear-all');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFlashcards);
    }

    renderDeckOptions();
    const deckSelect = document.getElementById('deck-select');
    if (deckSelect) {
        deckSelect.addEventListener('change', handleDeckChange);
    }
    const addDeckBtn = document.getElementById('add-deck');
    if (addDeckBtn) {
        addDeckBtn.addEventListener('click', createDeck);
    }
    const renameDeckBtn = document.getElementById('rename-deck');
    if (renameDeckBtn) {
        renameDeckBtn.addEventListener('click', renameDeck);
    }
    const deleteDeckBtn = document.getElementById('delete-deck');
    if (deleteDeckBtn) {
        deleteDeckBtn.addEventListener('click', deleteDeck);
    }

    renderList();
}

document.addEventListener('DOMContentLoaded', init);
