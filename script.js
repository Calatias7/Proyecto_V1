// Utilidades para acceder a localStorage
function loadFlashcards() {
    const data = localStorage.getItem('flashcards');
    return data ? JSON.parse(data) : [];
}

function saveFlashcards(cards) {
    localStorage.setItem('flashcards', JSON.stringify(cards));
}

let editIndex = null;
let studyIndex = 0;
let showAnswer = false;

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

// Agrega o actualiza una tarjeta y guarda en localStorage
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

    if (editIndex !== null) {
        cards[editIndex] = card;
        editIndex = null;
    } else {
        cards.push(card);
    }

    saveFlashcards(cards);
    renderList();
    renderStudyCard();
    event.target.reset();
    renderFields(type);
}

// Carga una tarjeta en el formulario para editarla
function loadForEdit(index) {
    const cards = loadFlashcards();
    const card = cards[index];
    document.getElementById('type').value = card.type;
    renderFields(card.type);

    if (card.type === 'classic') {
        document.getElementById('question').value = card.question;
        document.getElementById('answer').value = card.answer;
    } else {
        document.getElementById('statement').value = card.statement;
        document.getElementById('isTrue').checked = card.isTrue;
    }

    editIndex = index;
}

// Elimina una tarjeta por índice con confirmación
function deleteFlashcard(index) {
    if (!confirm('¿Eliminar tarjeta?')) return;
    const cards = loadFlashcards();
    cards.splice(index, 1);
    saveFlashcards(cards);
    renderList();
    renderStudyCard();
}

function clearFlashcards() {
    if (!confirm('¿Eliminar todas las tarjetas?')) return;
    saveFlashcards([]);
    renderList();
    renderStudyCard();
}

function exportFlashcards() {
    const data = JSON.stringify(loadFlashcards());
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.json';
    a.click();
    URL.revokeObjectURL(url);
}

function getFilteredCards() {
    const cards = loadFlashcards();
    const keyword = document.getElementById('search').value.trim().toLowerCase();
    const filterType = document.getElementById('filter-type').value;
    return cards.filter(card => {
        const matchesType = filterType === 'all' || card.type === filterType;
        let text = '';
        if (card.type === 'classic') {
            text = `${card.question} ${card.answer}`;
        } else {
            text = card.statement;
        }
        const matchesKey = !keyword || text.toLowerCase().includes(keyword);
        return matchesType && matchesKey;
    });
}

// Muestra todas las tarjetas en el listado
function renderList() {
    const list = document.getElementById('flashcard-list');
    list.innerHTML = '';
    const cards = loadFlashcards();

    cards.forEach((card, index) => {
        if (!getFilteredCards().includes(card)) return;
        const li = document.createElement('li');
        li.className = 'flashcard ' + card.type;
        if (card.type === 'classic') {
            li.innerHTML = `<strong>Pregunta:</strong> ${card.question}<br>` +
                           `<strong>Respuesta:</strong> ${card.answer}`;
        } else {
            li.innerHTML = `<strong>Enunciado:</strong> ${card.statement}<br>` +
                           `<strong>Es verdadero:</strong> ${card.isTrue ? 'Sí' : 'No'}`;
        }
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => loadForEdit(index));
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Eliminar';
        delBtn.addEventListener('click', () => deleteFlashcard(index));
        li.appendChild(document.createElement('br'));
        li.appendChild(editBtn);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

function renderStudyCard() {
    const study = document.getElementById('study-card');
    const cards = loadFlashcards();
    if (cards.length === 0) {
        study.textContent = 'No hay tarjetas';
        study.className = 'flashcard';
        return;
    }
    if (studyIndex >= cards.length) studyIndex = 0;
    const card = cards[studyIndex];
    study.className = 'flashcard ' + card.type;
    if (!showAnswer) {
        study.textContent = card.type === 'classic' ? card.question : card.statement;
    } else {
        study.textContent = card.type === 'classic' ? card.answer : (card.isTrue ? 'Verdadero' : 'Falso');
    }
}

function flipCard() {
    showAnswer = !showAnswer;
    renderStudyCard();
}

function nextCard() {
    const cards = loadFlashcards();
    if (cards.length === 0) return;
    studyIndex = (studyIndex + 1) % cards.length;
    showAnswer = false;
    renderStudyCard();
}

function prevCard() {
    const cards = loadFlashcards();
    if (cards.length === 0) return;
    studyIndex = (studyIndex - 1 + cards.length) % cards.length;
    showAnswer = false;
    renderStudyCard();
}

// Configura eventos iniciales
function init() {
    const typeSelect = document.getElementById('type');
    renderFields(typeSelect.value);
    typeSelect.addEventListener('change', e => renderFields(e.target.value));
    document.getElementById('flashcard-form').addEventListener('submit', addFlashcard);
    document.getElementById('search').addEventListener('input', renderList);
    document.getElementById('filter-type').addEventListener('change', renderList);
    document.getElementById('clear-cards').addEventListener('click', clearFlashcards);
    document.getElementById('export-cards').addEventListener('click', exportFlashcards);
    document.getElementById('flip-card').addEventListener('click', flipCard);
    document.getElementById('next-card').addEventListener('click', nextCard);
    document.getElementById('prev-card').addEventListener('click', prevCard);
    renderList();
    renderStudyCard();
}

document.addEventListener('DOMContentLoaded', init);
