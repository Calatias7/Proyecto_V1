// Utilidades para acceder a localStorage
function loadFlashcards() {
    const data = localStorage.getItem('flashcards');
    return data ? JSON.parse(data) : [];
}

function saveFlashcards(cards) {
    localStorage.setItem('flashcards', JSON.stringify(cards));
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

    cards.push(card);
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

// Muestra todas las tarjetas en el listado
function renderList() {
    const list = document.getElementById('flashcard-list');
    list.innerHTML = '';
    const cards = loadFlashcards();

    cards.forEach((card, index) => {
        const li = document.createElement('li');
        li.className = 'flashcard';
        if (card.type === 'classic') {
            li.innerHTML = `<strong>Pregunta:</strong> ${card.question}<br>` +
                           `<strong>Respuesta:</strong> ${card.answer}`;
        } else {
            li.innerHTML = `<strong>Enunciado:</strong> ${card.statement}<br>` +
                           `<strong>Es verdadero:</strong> ${card.isTrue ? 'Sí' : 'No'}`;
        }
        const btn = document.createElement('button');
        btn.textContent = 'Eliminar';
        btn.addEventListener('click', () => deleteFlashcard(index));
        li.appendChild(document.createElement('br'));
        li.appendChild(btn);
        list.appendChild(li);
    });
}

// Configura eventos iniciales
function init() {
    const typeSelect = document.getElementById('type');
    renderFields(typeSelect.value);
    typeSelect.addEventListener('change', (e) => renderFields(e.target.value));
    document.getElementById('flashcard-form').addEventListener('submit', addFlashcard);
    renderList();
}

document.addEventListener('DOMContentLoaded', init);
