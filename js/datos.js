// ====== CONFIGURACIÓN ======
// ID de tu Google Sheet: la parte larga de la URL entre /d/ y /edit
const SHEET_ID = '1z_Eyk3lfgLKS9aWI1RR-Y1YDCyXkyd0v';
// Nombres exactos de las pestañas de la hoja
const SHEETS = { libros: 'Biblioteca', series: 'Series y colecciones' };
// ===========================

// Escapa texto antes de meterlo en el HTML
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cssName = s => String(s ?? '').replace(/\s+/g, '-');

// Convierte un CSV en una lista de filas (respeta comillas y comas dentro de los campos)
function parseCSV(text) {
  const rows = []; let row = [], field = '', i = 0, quoted = false;
  while (i < text.length) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
    i++;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim() !== ''));
}

// Orden de las columnas de la pestaña Biblioteca (se usa si el encabezado no se lee bien)
const COLUMNAS_LIBROS = ['Título', 'Autor', 'Tipo de libro', 'Serie / colección', 'Volumen', 'Idioma', 'ISBN'];

// Lee una pestaña de la hoja y devuelve una lista de objetos.
// Si se pasan columnasEsperadas y la primera fila no tiene el primer encabezado,
// se usan esos nombres por posición y todas las filas se tratan como datos.
async function loadSheet(name, columnasEsperadas) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo leer la hoja "${name}" (código ${res.status}).`);
  const filas = parseCSV(await res.text());
  let keys = filas[0].map(h => h.normalize('NFC').replace(/\s+/g, ' ').trim());
  let body = filas.slice(1);
  if (columnasEsperadas && !keys.includes(columnasEsperadas[0])) {
    keys = columnasEsperadas;
    body = filas;
  }
  const rows = body.map(r => Object.fromEntries(keys.map((h, i) => [h, (r[i] ?? '').trim()])));
  rows.headers = keys;
  return rows;
}

// Carga los libros y las series de la hoja
async function cargarDatos() {
  const libros = await loadSheet(SHEETS.libros, COLUMNAS_LIBROS);
  const series = await loadSheet(SHEETS.series);
  return {
    libros: libros.filter(r => r['Título']),
    seriesRaw: series.filter(r => r['Estado']),
    columnasLibros: libros.headers || []
  };
}
