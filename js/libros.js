// Pestaña Biblioteca: muestra los libros de un tipo (Manga, Novela o Novela ligera)

// Devuelve los libros del tipo indicado que pasan los filtros de búsqueda e idioma
function filtrarLibros(libros, tipo, filtro) {
  const q = (filtro.q || '').toLowerCase();
  return libros.filter(r =>
    r['Tipo de libro'] === tipo &&
    (!q || [r['Título'], r['Autor'], r['Serie / colección']].join(' ').toLowerCase().includes(q)) &&
    (!filtro.idioma || r['Idioma'] === filtro.idioma));
}

// Pinta la pestaña Biblioteca dentro del contenedor
function renderBiblioteca(contenedor, libros, tipo, filtro, onChange) {
  const todos = libros.filter(r => r['Tipo de libro'] === tipo);
  const lista = filtrarLibros(libros, tipo, filtro);
  const idiomas = [...new Set(todos.map(r => r['Idioma']).filter(Boolean))].sort();

  contenedor.innerHTML = `
    <div class="controls">
      <input id="buscar" placeholder="Buscar título, autor o serie…" value="${esc(filtro.q)}">
      <select id="idioma">
        <option value="">Todos los idiomas</option>
        ${idiomas.map(i => `<option ${i === filtro.idioma ? 'selected' : ''}>${esc(i)}</option>`).join('')}
      </select>
    </div>
    <div class="stats">${lista.length} de ${todos.length} libros</div>
    <div class="wrap"><table>
      <thead><tr><th>Título</th><th>Autor</th><th>Serie</th><th class="center">Vol.</th><th>Idioma</th></tr></thead>
      <tbody>${lista.map(r => `
        <tr>
          <td><button class="link-libro" data-portada
                data-isbn="${esc(r['ISBN'])}"
                data-titulo="${esc(r['Título'])}"
                data-autor="${esc(r['Autor'])}">${esc(r['Título'])}</button></td>
          <td>${esc(r['Autor'])}</td>
          <td>${esc(r['Serie / colección'])}</td>
          <td class="center">${esc(r['Volumen'])}</td>
          <td>${esc(r['Idioma'])}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;

  enlazarFiltros(contenedor, filtro, onChange);
}
