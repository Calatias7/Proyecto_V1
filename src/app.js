import { loadFlashcards, saveFlashcards } from './storage.js';
import { loadDecks, saveDecks, renderDeckOptions, addDeck } from './decks.js';

// Índice de tarjeta en modo edición, null si se está creando una nueva
let editingIndex = null;

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
    const deck = document.getElementById('deck').value;
    const cards = loadFlashcards();
    let card;

    if (type === 'classic') {
        const question = document.getElementById('question').value.trim();
        const answer = document.getElementById('answer').value.trim();
        card = { type, deck, question, answer };
    } else {
        const statement = document.getElementById('statement').value.trim();
        const isTrue = document.getElementById('isTrue').checked;
        card = { type, deck, statement, isTrue };
    }

    if (editingIndex !== null) {
        cards[editingIndex] = card;
        editingIndex = null;
    } else {
        cards.push(card);
    }
    saveFlashcards(cards);
    renderList();
    event.target.reset();
    document.getElementById('type').value = type;
    renderFields(type);
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
    if (!confirm('¿Eliminar todas las tarjetas?')) return;
    localStorage.removeItem('flashcards');
    renderList();
}

// Habilita o deshabilita el botón "Eliminar todas" según haya tarjetas
function updateClearButton() {
    const btn = document.getElementById('clear-all');
    if (btn) {
        btn.disabled = loadFlashcards().length === 0;
    }
}

// Carga una tarjeta en el formulario para editarla
function editFlashcard(index) {
    const cards = loadFlashcards();
    const card = cards[index];
    if (!card) return;

    const typeSelect = document.getElementById('type');
    typeSelect.value = card.type;
    renderFields(card.type);

    const deckSelect = document.getElementById('deck');
    if (deckSelect) {
        if (!loadDecks().includes(card.deck)) {
            const decks = loadDecks();
            decks.push(card.deck);
            saveDecks(decks);
            renderDeckOptions();
        }
        deckSelect.value = card.deck;
    }

    if (card.type === 'classic') {
        document.getElementById('question').value = card.question;
        document.getElementById('answer').value = card.answer;
    } else {
        document.getElementById('statement').value = card.statement;
        document.getElementById('isTrue').checked = card.isTrue;
    }

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

        const deckLabel = document.createElement('em');
        deckLabel.textContent = 'Mazo: ' + card.deck;
        li.appendChild(deckLabel);
        li.appendChild(document.createElement('br'));

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
    typeSelect.addEventListener('change', e => renderFields(e.target.value));
    document.getElementById('flashcard-form').addEventListener('submit', addFlashcard);
    renderDeckOptions();
    const addDeckBtn = document.getElementById('add-deck');
    if (addDeckBtn) {
        addDeckBtn.addEventListener('click', addDeck);
    }
    const clearBtn = document.getElementById('clear-all');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFlashcards);
    }
    renderList();
}

document.addEventListener('DOMContentLoaded', init);
