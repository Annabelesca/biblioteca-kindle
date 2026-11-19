// Pestaña Colecciones: muestra las series de un tipo y cuántos tomos tengo

// Devuelve el tipo de una serie según sus libros (el más frecuente)
function tipoDeSerie(nombre, libros) {
  const cuenta = {};
  libros.forEach(r => {
    if (r['Serie / colección'] === nombre) {
      const t = r['Tipo de libro'];
      cuenta[t] = (cuenta[t] || 0) + 1;
    }
  });
  let mejor = null, max = 0;
  for (const t in cuenta) if (cuenta[t] > max) { max = cuenta[t]; mejor = t; }
  return mejor;
}

// Devuelve las series del tipo indicado que pasan los filtros de búsqueda y estado
function filtrarSeries(series, libros, tipo, filtro) {
  const q = (filtro.q || '').toLowerCase();
  return series.filter(r =>
    tipoDeSerie(r['Serie / colección'], libros) === tipo &&
    (!q || [r['Serie / colección'], r['Relacionado']].join(' ').toLowerCase().includes(q)) &&
    (!filtro.estado || r['Estado'] === filtro.estado));
}

// Pinta la pestaña Colecciones dentro del contenedor
function renderColecciones(contenedor, series, libros, tipo, filtro, onChange) {
  const todas = series.filter(r => tipoDeSerie(r['Serie / colección'], libros) === tipo);
  const lista = filtrarSeries(series, libros, tipo, filtro);

  contenedor.innerHTML = `
    <div class="controls">
      <input id="buscar" placeholder="Buscar serie…" value="${esc(filtro.q)}">
      <select id="estado">
        <option value="">Todos los estados</option>
        <option ${filtro.estado === 'Completa' ? 'selected' : ''}>Completa</option>
        <option ${filtro.estado === 'Incompleta' ? 'selected' : ''}>Incompleta</option>
        <option ${filtro.estado === 'Por determinar' ? 'selected' : ''}>Por determinar</option>
      </select>
    </div>
    <div class="stats">${lista.length} de ${todas.length} series</div>
    <div class="wrap"><table>
      <thead><tr><th>Serie</th><th class="center">Tengo</th><th class="center">Total</th><th class="center">Me faltan</th><th>Estado</th></tr></thead>
      <tbody>${lista.map(r => {
        const tengo = r['Volúmenes que tengo'] ? r['Volúmenes que tengo'].split(',').length : 0;
        const total = parseInt(r['Total de volúmenes'], 10);
        const pct = total > 0 ? Math.min(100, Math.round(tengo / total * 100)) : 0;
        return `
        <tr>
          <td>${esc(r['Serie / colección'])}${r['Relacionado'] ? `<span class="sub">${esc(r['Relacionado'])}</span>` : ''}</td>
          <td class="center">${esc(r['Volúmenes que tengo'] || '—')}</td>
          <td class="center">${esc(r['Total de volúmenes'] || '—')}
            ${total > 0 ? `<div class="bar"><span style="width:${pct}%"></span></div>` : ''}</td>
          <td class="center">${esc(r['Me faltan'] || '—')}</td>
          <td><span class="badge s-${cssName(r['Estado'])}">${esc(r['Estado'])}</span></td>
        </tr>`; }).join('')}
      </tbody>
    </table></div>`;

  enlazarFiltros(contenedor, filtro, onChange);
}
