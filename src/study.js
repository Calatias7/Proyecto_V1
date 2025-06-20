import { loadFlashcards } from './storage.js';

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
    back.textContent = card.type === 'classic' ? card.answer : card.isTrue ? 'Verdadero' : 'Falso';
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

export function startStudyMode() {
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
