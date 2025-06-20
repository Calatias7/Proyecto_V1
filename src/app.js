import { initTheme, toggleTheme } from "./theme.js";
import { startStudyMode } from "./study.js";
import { loadFlashcards, saveFlashcards } from './storage.js';
import { loadDecks, saveDecks, renderDeckOptions, addDeck, deleteDeck } from './decks.js';
import { exportData, importData } from './backup.js';

// Índice de tarjeta en modo edición, null si se está creando una nueva
let editingIndex = null;
let currentDeckView = null;

function ensureDefaultDeck() {
    const data = localStorage.getItem('decks');
    let save = false;
    let decks;
    if (!data) {
        decks = ['General'];
        save = true;
    } else {
        try {
            decks = JSON.parse(data);
            if (!decks.length) {
                decks = ['General'];
                save = true;
            }
        } catch (e) {
            decks = ['General'];
            save = true;
        }
    }
    if (save) saveDecks(decks);
}

function updateDeckSelects() {
    renderDeckOptions();
    const manageSelect = document.getElementById('deck-manage');
    const mainSelect = document.getElementById('deck');
    if (manageSelect && mainSelect) {
        manageSelect.innerHTML = mainSelect.innerHTML;
        manageSelect.value = mainSelect.value;
    }
}

function showSection(id) {
    document.querySelectorAll('.view').forEach(s => s.classList.add('hidden'));
    const section = document.getElementById(id);
    if (section) section.classList.remove('hidden');
    if (id === 'list-section') {
        const cards = document.getElementById('tarjetasDelMazo');
        if (cards) cards.classList.add('hidden');
        const decks = document.getElementById('mazosContainer');
        if (decks) decks.classList.remove('hidden');
        renderMazos();
        renderList();
    }
}

function closeMobileMenu() {
    const links = document.querySelector('.nav-links');
    if (links) links.classList.remove('show');
    const dropdown = document.querySelector('.dropdown');
    if (dropdown) dropdown.classList.remove('open');
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

// Muestra un mensaje temporal en la sección de tarjetas
function showCardMessage(text) {
    const msg = document.getElementById('card-message');
    if (!msg) return;
    msg.textContent = text;
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 2000);
}

// Limpia el formulario de tarjetas y reinicia el estado de edición
function resetFlashcardForm(keepSelections = true) {
    const form = document.getElementById('flashcard-form');
    const type = document.getElementById('type').value;
    const deck = document.getElementById('deck').value;
    if (form) form.reset();
    editingIndex = null;
    if (keepSelections) {
        document.getElementById('type').value = type;
        document.getElementById('deck').value = deck;
    }
    renderFields(document.getElementById('type').value);
    updateClearButton();
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
        if (!question || !answer) {
            alert('Completa pregunta y respuesta');
            return;
        }
        card = { type, deck, question, answer };
    } else {
        const statement = document.getElementById('statement').value.trim();
        const isTrue = document.getElementById('isTrue').checked;
        if (!statement) {
            alert('Completa el enunciado');
            return;
        }
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
    refreshCurrentDeckView();
    renderMazos();
    resetFlashcardForm();
    showCardMessage('Tarjeta guardada');
}

// Elimina una tarjeta por índice
function deleteFlashcard(index) {
    const cards = loadFlashcards();
    cards.splice(index, 1);
    saveFlashcards(cards);
    renderList();
    refreshCurrentDeckView();
    renderMazos();
}

// Borra todas las tarjetas almacenadas
function clearAllFlashcards() {
    const deck = document.getElementById('deck').value;
    if (!deck || !confirm(`¿Eliminar todas las tarjetas del mazo "${deck}"?`)) return;
    const remaining = loadFlashcards().filter(c => c.deck !== deck);
    saveFlashcards(remaining);
    renderList();
    refreshCurrentDeckView();
    renderMazos();
}

// Habilita o deshabilita el botón "Eliminar todas" según haya tarjetas
function updateClearButton() {
    const btn = document.getElementById('clear-all');
    if (btn) {
        const deck = document.getElementById('deck').value;
        const hasCards = loadFlashcards().some(c => c.deck === deck);
        btn.disabled = !hasCards;
    }
}

function refreshCurrentDeckView() {
    if (!currentDeckView) return;
    const container = document.getElementById('tarjetasDelMazo');
    if (container && !container.classList.contains('hidden')) {
        mostrarTarjetasDelMazo(currentDeckView);
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

function createCardElement(card, index, onEdit, onDelete) {
    const li = document.createElement('li');

    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';

    const flash = document.createElement('div');
    flash.className = 'flashcard';
    const inner = document.createElement('div');
    inner.className = 'card-inner';
    const front = document.createElement('div');
    front.className = 'front';
    front.textContent = card.type === 'classic' ? card.question : card.statement;
    const back = document.createElement('div');
    back.className = 'back';
    back.textContent = card.type === 'classic' ? card.answer : (card.isTrue ? 'Verdadero' : 'Falso');
    inner.appendChild(front);
    inner.appendChild(back);
    flash.appendChild(inner);
    flash.addEventListener('click', () => flash.classList.toggle('flipped'));

    // Ajusta la altura de la tarjeta para evitar que el texto se desborde
    requestAnimationFrame(() => {
        const maxHeight = Math.max(front.scrollHeight, back.scrollHeight, 120);
        inner.style.height = `${maxHeight}px`;
    });

    const botones = document.createElement('div');
    botones.className = 'botones';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-editar';
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', e => { e.stopPropagation(); onEdit(); });

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-eliminar';
    delBtn.textContent = 'Eliminar';
    delBtn.addEventListener('click', e => { e.stopPropagation(); onDelete(); });

    botones.appendChild(editBtn);
    botones.appendChild(delBtn);

    tarjeta.appendChild(flash);
    tarjeta.appendChild(botones);
    li.appendChild(tarjeta);
    return li;
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
            const li = createCardElement(
                card,
                index,
                () => editFlashcard(index),
                () => deleteFlashcard(index)
            );
            ul.appendChild(li);
        });

        wrapper.appendChild(ul);
        list.appendChild(wrapper);
    });

    updateClearButton();
}

function renderMazos() {
    const container = document.getElementById('mazosContainer');
    if (!container) return;
    container.innerHTML = '';
    loadDecks().forEach(deck => {
        const card = document.createElement('div');
        card.className = 'mazo-card';
        card.textContent = deck;
        card.addEventListener('click', () => mostrarTarjetasDelMazo(deck));
        container.appendChild(card);
    });
}

function mostrarTarjetasDelMazo(nombreDelMazo) {
    currentDeckView = nombreDelMazo;
    const decksContainer = document.getElementById('mazosContainer');
    if (decksContainer) decksContainer.classList.add('hidden');

    const container = document.getElementById('tarjetasDelMazo');
    if (!container) return;
    container.innerHTML = '';

    const back = document.createElement('button');
    back.id = 'back-to-mazos';
    back.textContent = 'Volver';
    back.addEventListener('click', () => {
        container.classList.add('hidden');
        if (decksContainer) decksContainer.classList.remove('hidden');
        renderList();
    });
    container.appendChild(back);

    const title = document.createElement('h3');
    title.textContent = nombreDelMazo;
    container.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'deck-cards';

    const allCards = loadFlashcards();
    const deckCards = [];
    allCards.forEach((c,i)=>{ if(c.deck===nombreDelMazo) deckCards.push({card:c,index:i});});

    if (deckCards.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Este mazo aún no contiene tarjetas';
        list.appendChild(li);
    }

    deckCards.forEach(({card,index}) => {
        const li = createCardElement(
            card,
            index,
            () => { editFlashcard(index); showSection('card-section'); },
            () => { deleteFlashcard(index); mostrarTarjetasDelMazo(nombreDelMazo); }
        );
        list.appendChild(li);
    });

    container.appendChild(list);
    container.classList.remove('hidden');
    renderList();
}

// Configura eventos iniciales
function init() {
    ensureDefaultDeck();
    initTheme();
    const typeSelect = document.getElementById('type');
    renderFields(typeSelect.value);
    typeSelect.addEventListener('change', e => renderFields(e.target.value));
    document.getElementById('flashcard-form').addEventListener('submit', addFlashcard);
    updateDeckSelects();

    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const links = document.querySelector('.nav-links');
            if (links) links.classList.toggle('show');
        });
    }
    const creationBtn = document.getElementById('creation-btn');
    if (creationBtn) {
        creationBtn.addEventListener('click', (e) => { e.preventDefault(); document.querySelector('.dropdown').classList.toggle('open'); });
    }
    const cardLink = document.getElementById('nav-create-card');
    if (cardLink) {
        cardLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('card-section');
            resetFlashcardForm();
            closeMobileMenu();
        });
    }
    const deckLink = document.getElementById('nav-create-deck');
    if (deckLink) {
        deckLink.addEventListener('click', (e) => { e.preventDefault(); showSection('deck-section'); closeMobileMenu(); });
    }
    const viewLink = document.getElementById('nav-view-decks');
    if (viewLink) {
        viewLink.addEventListener('click', (e) => { e.preventDefault(); showSection('list-section'); closeMobileMenu(); });
    }
    const addDeckBtn = document.getElementById('add-deck');
    if (addDeckBtn) {
        addDeckBtn.addEventListener('click', () => {
            addDeck();
            updateDeckSelects();
            updateClearButton();
            renderList();
            renderMazos();
        });
    }
    const deleteDeckBtn = document.getElementById('delete-deck');
    if (deleteDeckBtn) {
        deleteDeckBtn.addEventListener('click', () => {
            deleteDeck();
            updateDeckSelects();
            renderList();
            updateClearButton();
            renderMazos();
        });
    }
    const deckSelect = document.getElementById('deck');
    if (deckSelect) {
        deckSelect.addEventListener('change', updateClearButton);
        const manage = document.getElementById('deck-manage');
        if (manage) {
            deckSelect.addEventListener('change', () => { manage.value = deckSelect.value; });
            manage.addEventListener('change', () => { deckSelect.value = manage.value; updateClearButton(); });
        }
    }
    const clearBtn = document.getElementById('clear-all');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFlashcards);
    }
    const themeBtn = document.getElementById('toggle-theme');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    const exportBtn = document.getElementById('export-data');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const blob = new Blob([exportData()], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'flashcards.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
    const importBtn = document.getElementById('import-data');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.addEventListener('change', () => {
                const file = input.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    if (importData(reader.result)) {
                        updateDeckSelects();
                        renderList();
                        renderMazos();
                        showCardMessage('Datos importados');
                    } else {
                        alert('Archivo inválido');
                    }
                };
                reader.readAsText(file);
            });
            input.click();
        });
    }
    const studyBtn = document.getElementById('study-mode');
    if (studyBtn) {
        studyBtn.addEventListener('click', startStudyMode);
    }
    showSection('card-section');
    renderList();
    renderMazos();
}

document.addEventListener('DOMContentLoaded', init);
