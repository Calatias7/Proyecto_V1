import { loadFlashcards, saveFlashcards } from './storage.js';
import { loadDecks, saveDecks, renderDeckOptions, addDeck, deleteDeck } from './decks.js';

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
    document.getElementById('deck').value = deck;
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

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark');
    const btn = document.getElementById('toggle-theme');
    if (btn) {
        btn.textContent = body.classList.contains('dark') ? 'Tema claro' : 'Tema oscuro';
    }
}

let studyQueue = [];
let studyIndex = 0;

function showStudyCard() {
    const container = document.getElementById('study-container');
    if (!container) return;
    container.innerHTML = '';
    if (studyIndex >= studyQueue.length) {
        container.textContent = 'Fin del estudio';
        return;
    }
    const card = studyQueue[studyIndex];
    const progress = document.createElement('p');
    progress.textContent = `Tarjeta ${studyIndex + 1} de ${studyQueue.length}`;
    container.appendChild(progress);
    const front = document.createElement('div');
    front.textContent = card.type === 'classic' ? card.question : card.statement;
    const showBtn = document.createElement('button');
    showBtn.textContent = 'Mostrar respuesta';
    showBtn.addEventListener('click', () => {
        showBtn.remove();
        const back = document.createElement('div');
        if (card.type === 'classic') {
            back.textContent = card.answer;
        } else {
            back.textContent = card.isTrue ? 'Verdadero' : 'Falso';
        }
        container.appendChild(back);
        const ok = document.createElement('button');
        ok.textContent = 'Correcto';
        ok.addEventListener('click', () => {
            container.classList.add('correct');
            setTimeout(() => container.classList.remove('correct'), 300);
            studyIndex++;
            showStudyCard();
        });
        const fail = document.createElement('button');
        fail.textContent = 'Incorrecto';
        fail.addEventListener('click', () => {
            container.classList.add('incorrect');
            setTimeout(() => container.classList.remove('incorrect'), 300);
            studyQueue.push(card);
            studyIndex++;
            showStudyCard();
        });
        container.appendChild(ok);
        container.appendChild(fail);
    });
    container.appendChild(front);
    container.appendChild(showBtn);
}

function startStudyMode() {
    const deck = document.getElementById('deck').value;
    studyQueue = loadFlashcards().filter(c => c.deck === deck);
    for (let i = studyQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [studyQueue[i], studyQueue[j]] = [studyQueue[j], studyQueue[i]];
    }
    studyIndex = 0;
    const container = document.getElementById('study-container');
    if (container) {
        container.classList.remove('hidden');
    }
    if (studyQueue.length === 0) {
        container.textContent = 'Este mazo aún no tiene tarjetas';
        return;
    }
    showStudyCard();
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
    const decks = loadDecks();

    if (cards.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Este mazo aún no tiene tarjetas';
        list.appendChild(p);
        updateClearButton();
        return;
    }

    decks.forEach(deck => {
        const wrapper = document.createElement('div');
        wrapper.className = 'deck-container';
        const title = document.createElement('h3');
        title.textContent = deck;
        wrapper.appendChild(title);

        const ul = document.createElement('ul');
        ul.className = 'deck-cards';

        const deckCards = [];
        cards.forEach((card, i) => {
            if (card.deck === deck) deckCards.push({ card, index: i });
        });

        if (deckCards.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Este mazo aún no tiene tarjetas';
            ul.appendChild(li);
        }

        deckCards.forEach(({ card, index }) => {
            const li = document.createElement('li');
            li.className = 'flashcard';

            const inner = document.createElement('div');
            inner.className = 'card-inner';

            const front = document.createElement('div');
            front.className = 'front';
            if (card.type === 'classic') {
                front.innerHTML = `<strong>Pregunta:</strong> ${card.question}`;
            } else {
                front.innerHTML = `<strong>Enunciado:</strong> ${card.statement}`;
            }

            const back = document.createElement('div');
            back.className = 'back';
            if (card.type === 'classic') {
                back.textContent = card.answer;
            } else {
                back.textContent = card.isTrue ? 'Verdadero' : 'Falso';
            }

            inner.appendChild(front);
            inner.appendChild(back);
            li.appendChild(inner);

            li.addEventListener('click', () => li.classList.toggle('flipped'));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteFlashcard(index); });

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.style.marginLeft = '0.5rem';
            editBtn.addEventListener('click', (e) => { e.stopPropagation(); editFlashcard(index); });

            li.appendChild(document.createElement('br'));
            li.appendChild(deleteBtn);
            li.appendChild(editBtn);
            ul.appendChild(li);
        });

        wrapper.appendChild(ul);
        list.appendChild(wrapper);
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
    const deleteDeckBtn = document.getElementById('delete-deck');
    if (deleteDeckBtn) {
        deleteDeckBtn.addEventListener('click', () => { deleteDeck(); renderList(); });
    }
    const clearBtn = document.getElementById('clear-all');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFlashcards);
    }
    const themeBtn = document.getElementById('toggle-theme');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    const studyBtn = document.getElementById('study-mode');
    if (studyBtn) {
        studyBtn.addEventListener('click', startStudyMode);
    }
    renderList();
}

document.addEventListener('DOMContentLoaded', init);
