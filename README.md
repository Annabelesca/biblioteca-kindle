# Biblioteca Kindle

Catálogo web de mi biblioteca de Kindle, organizado en tres secciones: **Manga**, **Novelas** y **Novelas ligeras**. Cada sección tiene dos vistas: **Biblioteca** (los libros) y **Colecciones** (las series, con los tomos que tengo y los que me faltan).

Los datos vienen de una hoja de cálculo de Google Sheets, así que basta con editar la hoja para que la web se actualice al recargarla.

## Estructura

```
biblioteca-kindle/
├── index.html          Estructura de la página y pestañas
├── css/
│   └── styles.css      Estilos
├── js/
│   ├── datos.js        Configuración (ID de la hoja) y lectura de Google Sheets
│   ├── libros.js       Vista Biblioteca
│   ├── series.js       Vista Colecciones
│   └── app.js          Pestañas y arranque de la web
└── README.md
```

El orden de carga está en `index.html`: primero `datos.js`, luego `libros.js` y `series.js`, y por último `app.js`.

## Cómo funciona

La página lee dos pestañas de la hoja de Google:

- **Biblioteca**: un libro por fila, con título, autor, tipo de libro, serie, volumen e idioma. El tipo de libro (Manga, Novela o Novela ligera) decide en qué sección aparece.
- **Series y colecciones**: una serie por fila, con los volúmenes que tengo, el total, los que me faltan y el estado (Completa, Incompleta o Por determinar).

Las columnas "Volúmenes que tengo", "Me faltan" y "Estado" se calculan con fórmulas dentro de la hoja, así que no hay que tocarlas. Para una serie solo hay que rellenar la columna "Total de volúmenes".

Cada serie se asigna a una sección según el tipo de sus libros en la pestaña Biblioteca. Si una serie tiene libros de varios tipos, aparece en el que más se repite. Una serie que no tenga libros registrados no aparece en ninguna colección.

## Configuración

1. La hoja de Google debe estar compartida como **"Cualquier persona con el enlace"** (permiso de lector).
2. En `js/datos.js`, la constante `SHEET_ID` contiene el identificador de la hoja, que es la parte larga de su URL entre `/d/` y `/edit`.
3. Si cambias el nombre de las pestañas de la hoja, actualiza también el objeto `SHEETS` en el mismo archivo.

## Publicación

La web se publica con GitHub Pages:

1. Ve a **Settings → Pages**.
2. En *Build and deployment*, elige la rama `main` y la carpeta `/ (root)`.
3. Guarda. Tras unos minutos la web estará en `https://tu-usuario.github.io/biblioteca-kindle/`.

Recuerda subir también las carpetas `css/` y `js/`. Si faltan, la página se verá sin formato o no cargará los datos.

## Solución de problemas

- **"Failed to fetch"**: suele significar que el navegador no ha podido leer la hoja. Comprueba que esté compartida con "Cualquier persona con el enlace" y prueba la web desde GitHub Pages, no abriendo el archivo directamente desde el ordenador.
- **"No se pudo leer la hoja ... (código 404)"**: el ID de `SHEET_ID` no es correcto o la hoja ha sido eliminada.
- **"No encuentro libros en la pestaña ..."**: el mensaje muestra las columnas que ha leído. Comprueba que la primera fila de la pestaña Biblioteca tenga "Título" y que el nombre de la pestaña coincida con `SHEETS`.
- **La pestaña Biblioteca sale vacía o con el primer libro raro**: la primera fila de la hoja no se está leyendo como encabezado (por ejemplo, el título "Título" está pegado a otros datos). La web lee las columnas por posición en ese caso, así que revisa que la hoja tenga los encabezados en la primera fila, sin celdas combinadas ni saltos de línea.
- **Una serie no aparece en Colecciones**: revisa que el nombre de la serie en la pestaña Biblioteca coincida exactamente con el de la pestaña Series y colecciones, y que ese libro tenga el tipo correcto.

## Privacidad

Cualquiera que conozca la dirección de la web puede ver el catálogo, y cualquiera con el enlace de la hoja puede ver sus datos. No guardes información sensible en ninguna de las dos.
