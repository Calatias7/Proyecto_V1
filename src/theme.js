export function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') {
    document.body.classList.add('dark');
  }
  updateButton();
}

export function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateButton();
}

function updateButton() {
  const btn = document.getElementById('toggle-theme');
  if (btn) {
    btn.textContent = document.body.classList.contains('dark')
      ? 'Tema claro'
      : 'Tema oscuro';
  }
}
