const table = document.getElementById('product-table');
const search = document.getElementById('search');
const deleteLinks = document.querySelectorAll('.delete-link');

search.addEventListener('input', () => {
  const term = search.value.toLowerCase();
  for (const row of table.tBodies[0].rows) {
    const name = row.cells[1].textContent.toLowerCase();
    row.style.display = name.includes(term) ? '' : 'none';
  }
});

for (const link of deleteLinks) {
  link.addEventListener('click', event => {
    if (!confirm('¿Eliminar este producto?')) {
      event.preventDefault();
    }
  });
}
