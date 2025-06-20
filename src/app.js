import { loadFlashcards, saveFlashcards } from './storage.js';
import { loadDecks, saveDecks, renderDeckOptions, addDeck, deleteDeck } from './decks.js';

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
    }
}

function closeMobileMenu() {
    const links = document.querySelector('.nav-links');
    if (links) links.classList.remove('show');
    const dropdown = document.querySelector('.dropdown');
    if (dropdown) dropdown.classList.remove('open');
}

function initTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
        document.body.classList.add('dark');
    }
    const btn = document.getElementById('toggle-theme');
    if (btn) {
        btn.textContent = document.body.classList.contains('dark') ? 'Tema claro' : 'Tema oscuro';
    }
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

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark');
    const btn = document.getElementById('toggle-theme');
    if (btn) {
        btn.textContent = isDark ? 'Tema claro' : 'Tema oscuro';
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
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
    const bar = document.createElement('progress');
    bar.max = studyQueue.length;
    bar.value = studyIndex;
    container.appendChild(bar);
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
        cardLink.addEventListener('click', (e) => { e.preventDefault(); showSection('card-section'); closeMobileMenu(); });
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
    const studyBtn = document.getElementById('study-mode');
    if (studyBtn) {
        studyBtn.addEventListener('click', startStudyMode);
    }
    showSection('card-section');
    renderList();
    renderMazos();
}

document.addEventListener('DOMContentLoaded', init);
