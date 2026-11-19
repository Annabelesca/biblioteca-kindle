// Portadas: se obtienen de Open Library a partir del ISBN (no se guardan en el proyecto)

// Deja solo los dígitos del ISBN (evita caracteres raros de la hoja)
function isbnLimpio(isbn) {
  return String(isbn || '').replace(/[^0-9X]/gi, '');
}

// URL de la portada. size: 'S', 'M' o 'L'. default=false hace que falle si no existe
function urlPortada(isbn, size = 'M') {
  const i = isbnLimpio(isbn);
  return i ? `https://covers.openlibrary.org/b/isbn/${i}-${size}.jpg?default=false` : '';
}

// Devuelve la etiqueta <img> para una miniatura; si no hay portada, se oculta
function imgPortada(isbn, alt, clase = 'thumb') {
  const url = urlPortada(isbn, 'M');
  if (!url) return '';
  return `<img class="${clase}" src="${url}" alt="${esc(alt)}" loading="lazy" onerror="this.style.display='none'">`;
}

// Abre el popup con la portada grande
function abrirPortada(isbn, titulo, autor) {
  let modal = document.getElementById('modal-portada');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-portada';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-caja" role="dialog" aria-modal="true">
        <button class="modal-cerrar" aria-label="Cerrar">&times;</button>
        <div class="modal-cuerpo"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.classList.contains('modal-cerrar')) cerrarPortada();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarPortada(); });
  }
  const cuerpo = modal.querySelector('.modal-cuerpo');
  const url = urlPortada(isbn, 'L');
  cuerpo.innerHTML = `
    <div class="modal-portada"></div>
    <h2 class="modal-titulo">${esc(titulo)}</h2>
    ${autor ? `<p class="modal-autor">${esc(autor)}</p>` : ''}`;
  const hueco = cuerpo.querySelector('.modal-portada');
  const sinPortada = () => { hueco.innerHTML = '<div class="modal-sin">Sin portada disponible</div>'; };
  if (!url) { sinPortada(); } else {
    const img = new Image();
    img.className = 'modal-img';
    img.alt = titulo;
    img.onerror = sinPortada;
    img.src = url;
    hueco.appendChild(img);
  }
  modal.classList.add('abierto');
}

function cerrarPortada() {
  const modal = document.getElementById('modal-portada');
  if (modal) modal.classList.remove('abierto');
}

// Un solo listener para todos los elementos con data-portada (libros y series)
document.addEventListener('click', e => {
  const el = e.target.closest('[data-portada]');
  if (!el) return;
  abrirPortada(el.dataset.isbn, el.dataset.titulo, el.dataset.autor);
});
