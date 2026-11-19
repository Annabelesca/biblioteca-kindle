# Biblioteca Kindle

Catálogo web de mi biblioteca de Kindle: libros, series y tomos. Permite buscar y filtrar los títulos, y ver qué volúmenes tengo de cada serie y cuáles me faltan.

Los datos vienen de una hoja de cálculo de Google Sheets, así que basta con editar la hoja para que la web se actualice al recargarla. No hay que generar ni subir nada más.

## Contenido

- `index.html`: la web completa (HTML, CSS y JavaScript en un solo archivo, sin dependencias).
- `README.md`: este archivo.

## Cómo funciona

La página lee dos pestañas de la hoja de Google:

- **Biblioteca**: un libro por fila, con título, autor, tipo, serie, volumen e idioma.
- **Series y colecciones**: una serie por fila, con los volúmenes que tengo, el total, los que me faltan y el estado (Completa, Incompleta o Por determinar).

