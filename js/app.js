// Arranque de la web: secciones, subsecciones y carga de datos

// Cada sección muestra los libros de un tipo de la hoja
const SECCIONES = {
  'manga':         { tipo: 'Manga' },
  'novela':        { tipo: 'Novela' },
  'novela-ligera': { tipo: 'Novela ligera' }
};

const estado = { seccion: 'manga', vista: 'biblioteca', filtros: {} };
let datos = null;
const app = document.getElementById('app');

// Filtros independientes para cada combinación de sección y vista
function filtroActual() {
  const clave = estado.seccion + '/' + estado.vista;
  if (!estado.filtros[clave]) estado.filtros[clave] = { q: '', idioma: '', estado: '' };
  return estado.filtros[clave];
}

// Conecta los controles de búsqueda y filtros con el estado y vuelve a pintar
function enlazarFiltros(contenedor, filtro, onChange) {
  contenedor.querySelectorAll('input, select').forEach(el => {
    el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', e => {
      filtro[el.id === 'buscar' ? 'q' : el.id] = e.target.value;
      onChange();
      // Mantiene el cursor en el buscador tras repintar
      const nuevo = contenedor.querySelector('#buscar');
      if (nuevo && el.id === 'buscar') { nuevo.focus(); const v = nuevo.value; nuevo.value = ''; nuevo.value = v; }
    });
  });
}

// Pinta la vista activa
function pintar() {
  if (!datos) return;
  const { tipo } = SECCIONES[estado.seccion];
  const filtro = filtroActual();
  if (estado.vista === 'biblioteca') {
    renderBiblioteca(app, datos.libros, tipo, filtro, pintar);
  } else {
    renderColecciones(app, datos.seriesRaw, datos.libros, tipo, filtro, pintar);
  }
}

// Marca como activo el botón pulsado dentro de su grupo
function marcar(selector, boton) {
  document.querySelectorAll(selector + ' .tab').forEach(b => b.classList.toggle('active', b === boton));
}

document.querySelectorAll('#secciones .tab').forEach(b => b.addEventListener('click', () => {
  estado.seccion = b.dataset.seccion;
  marcar('#secciones', b);
  pintar();
}));

document.querySelectorAll('#vistas .tab').forEach(b => b.addEventListener('click', () => {
  estado.vista = b.dataset.vista;
  marcar('#vistas', b);
  pintar();
}));

(async () => {
  if (!SHEET_ID || SHEET_ID.startsWith('PEGA_AQUI')) {
    app.innerHTML = '<div class="msg">Falta configurar <b>SHEET_ID</b> en js/datos.js con el ID de tu Google Sheet.</div>';
    return;
  }
  try {
    datos = await cargarDatos();
    if (datos.libros.length === 0) {
      app.innerHTML = `<div class="msg">No encuentro libros en la pestaña "${esc(SHEETS.libros)}".<br>
        Columnas leídas: ${esc(datos.columnasLibros.join(' | ') || '(ninguna)')}<br>
        Comprueba que la primera fila tenga "Título" y que el nombre de la pestaña coincida.</div>`;
      return;
    }
    pintar();
  } catch (err) {
    app.innerHTML = `<div class="msg">${esc(err.message)}<br>Revisa que la hoja esté compartida con "Cualquier persona con el enlace".</div>`;
  }
})();
