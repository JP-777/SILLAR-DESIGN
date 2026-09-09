# Estado real del trabajo de diseño

> **Este documento manda sobre `traspaso/`.** Donde discrepen, gana éste.

Creado: 9 de septiembre de 2026 · Verificado contra el repositorio del producto en el commit `d617688` · Autor: líder técnico.

Sustituye a `traspaso/02_ESTADO_ACTUAL.md` y a `traspaso/12_DATOS_NO_RECUPERABLES.md` en todo lo que sigue. Aquellos se conservan **sin editar** porque son un registro fechado del 29 de agosto y borrar su contenido borraría la prueba de cómo se produjo el error que este documento corrige.

---

## 1 · Diez informes que se daban por perdidos, y no lo estaban

`traspaso/12_DATOS_NO_RECUPERABLES.md` declara irrecuperables varias investigaciones, con la instrucción —correcta— de *«no deben rellenarse de memoria»*. **No hace falta: existen.**

El inventario del 29 de agosto se hizo sobre una sola carpeta. Había **dos** árboles de investigación, y el segundo nunca se miró. Aquí están fundidos en `investigacion/`, que a partir de ahora es el único.

| Declarado irrecuperable | Fichero real |
|---|---|
| «Indicador de espera: no se puede afirmar el marcado exacto» | `investigacion/indicador-espera.md` |
| «Escala de movimiento: no se conserva el informe con fuentes» | `investigacion/escala-movimiento.md` |
| «Token de velo: no se recuperaron nombre ni valores finales» | `investigacion/token-velo-dialogo.md` |
| «No están los informes de View Transitions, `@starting-style`, transiciones de `display`, esqueletos CSS y umbrales de espera» | `investigacion/movimiento-plataforma-nativa.md`, `movimiento-prefers-reduced-motion.md`, `carga-umbrales-usabilidad.md` |
| «Faltan informes de GSAP, Three.js, Liquid Gooey, Motion y AutoAnimate» | `investigacion/gsap.md`, `three-js.md`, `liquid-gooey.md`, y `movimiento-dependencias.md` —que cubre Motion y AutoAnimate, con la versión exacta 0.10.0 y el defecto que la tumbó |

**La lección, que vale más que la corrección:** una búsqueda que no encuentra nada es una respuesta tan falible como cualquier otra, y encima convincente. El «no hay» se siente comprobado cuando solo es un sitio donde no se miró.

---

## 2 · Trabajo que ya está construido en el producto

`traspaso/02_ESTADO_ACTUAL.md` afirma que los tokens de movimiento «no están definidos en el `tokens.css` actual» y que «el velo sigue sin token recuperable». **Las dos son falsas sobre el producto.** Son ciertas sobre la copia caducada que vive en `propuestas/M01/_ds/`.

Valores reales, leídos en `frontend/src/shared/styles/tokens.css`:

```css
--duracion-control:    120ms;
--duracion-mensaje:    180ms;
--duracion-superficie: 240ms;

--duracion-salida-control:    var(--duracion-control);    /* 120ms */
--duracion-salida-mensaje:    var(--duracion-control);    /* 120ms */
--duracion-salida-superficie: var(--duracion-mensaje);    /* 180ms */

--duracion-cambio-reducido: 80ms;

--curva-entrada: cubic-bezier(0, 0, 0.38, 0.9);
--curva-salida:  cubic-bezier(0.2, 0, 1, 0.9);
--curva-bucle:   linear;

--velo-dialogo: color-mix(in srgb, var(--stone-900) 45%, transparent);
```

Notas:

- **El velo no se llama `--color-velo-dialogo`** como proponía el informe. Se llama **`--velo-dialogo`** y se construye con `color-mix`. El 45 % del informe sobrevivió; el nombre cambió.
- Las salidas **reutilizan** el escalón inferior en vez de inventar valores nuevos, exactamente como recomendaba `escala-movimiento.md`.
- La regla global de `prefers-reduced-motion` está en `frontend/src/shared/styles/base.css:82`.

### El Spinner ya es accesible

`traspaso/02` clasifica el trabajo de accesibilidad del Spinner como **PARCIAL / REQUIERE RECUPERACIÓN O RECONSTRUCCIÓN VERIFICADA**, y observa que el Spinner del bundle de diseño «solo tiene anillo `aria-hidden` y texto `sr-only` opcional; no constituye por sí solo una región de estado».

Cierto sobre el bundle. **Falso sobre el producto.** `frontend/src/shared/ui/index.tsx:396`:

```tsx
Spinner({ size = 'md', label, visibleLabel = true, announce = true })
  → <span className="ui-spinner-wrap" role={announce ? 'status' : undefined}>
       <span className="ui-spinner …" aria-hidden="true" />
       {label && <span className={visibleLabel ? undefined : 'sr-only'}>{label}</span>}
```

Es decir: `role="status"` en el envoltorio, anillo oculto a lectores, y **etiqueta visible por defecto**. Es lo que pide `investigacion/indicador-espera.md`. **No hay nada que reconstruir.**

---

## 3 · La regla 9 del traspaso está equivocada

`traspaso/10_PROMPT_CONTINUACION.md` incluye entre sus «reglas no negociables» una escala de movimiento que **no coincide ni con el informe ni con el producto**, en las dos mitades:

| | Traspaso, regla 9 | Real |
|---|---|---|
| Salidas | 120 / 160 ms | **120 / 120 / 180 ms** |
| Curva de entrada | `cubic-bezier(.2,0,.4,1)` | **`cubic-bezier(0, 0, .38, .9)`** |
| Curva de salida | `cubic-bezier(.4,0,1,1)` | **`cubic-bezier(.2, 0, 1, .9)`** |

Quien diseñe siguiendo la regla 9 del traspaso diseña contra números que el producto no usa.

---

## 4 · Estado del producto funcional

`traspaso/12` abre una sección de incógnitas que empieza con *«por prohibición expresa no se inspeccionó el repositorio del producto»*. Se inspeccionó el 9 de septiembre de 2026. Respuestas:

**M01 Catálogo está cerrado**, 17 de 17 criterios con su prueba. **Pero se construyó sin usar las pantallas de Claude Design**: las de `propuestas/M01/` siguen siendo propuesta, nunca implementada, y contra tokens que cambiaron después.

**No hay procesador de imágenes instalado.** Ni ImageSharp, ni Magick.NET, ni NetVips: no aparecen en `Directory.Packages.props` ni los usa ningún `.cs`. Lo único que existe es un lector de cabeceras propio, `backend/Sillar.Core/Media/ImageDimensions.cs`, que obtiene ancho y alto — y el DTO lo dice sin adornos: *«ancho en píxeles, si se pudo leer»*, con la columna anulable. **No hay derivados, ni recodificación, ni normalización de orientación.** La decisión ImageSharp / Magick.NET sigue abierta y sin coste hundido.

**No existe nada de descubrimiento público.** `frontend/index.html` tiene cuatro etiquetas: charset, viewport, `color-scheme` y `<title>SILLAR</title>`. Sin OG, sin JSON-LD, sin SSR, sin prerender. Todo lo investigado en `previsualizacion-enlaces-mensajeria.md`, `salidas-renderizado-publico.md` y `descubrimiento-minimo-catalogo.md` **sigue íntegro por delante**: compartir un producto por WhatsApp hoy no enseña nada.

**El catálogo público sí está montado** en la web: `catalogPublicRoutes`, dentro del layout público de plataforma.

**El overlay de reconexión existe**: `frontend/src/platform/ReconnectingOverlay.tsx`. Se monta una sola vez en la raíz, lee un estado que vive fuera de React, y es `role="alertdialog"`. Su criterio está escrito: *nada de barras de progreso falsas; se dice cuánto lleva y qué pasa*.

**`useToasts` y `Toasts`** viven en `frontend/src/shared/ui/patterns.tsx:174` y `:187`. `useToasts()` devuelve `{ toasts, show(message, tone) }` con `tone: 'success' | 'danger'` y autocierre a 4000 ms; `Toasts` se pinta en un portal con `role="status"` y `aria-live="polite"`.

**La hoja base** es `frontend/src/shared/styles/base.css`, con los tokens al lado en `tokens.css`.

**El ERP no existe.** No hay una línea escrita de él. Cualquier pregunta sobre «el ERP local» no aplica todavía.

---

## 5 · Lo que sí falta de verdad

Para que la corrección no se pase de frenada:

- **Las referencias visuales.** La fotografía de sillares de Arequipa usada como inspiración, las capturas de sistemas de diseño maduros, los moodboards y las fotos reales de producto que produjeron las cifras de JPEG/WebP/AVIF. **No están, y no se reconstruyen: se vuelven a buscar.**
- **Las mediciones.** No hay benchmark de GPU representativo del PC de tienda de ocho años, ni tiempos de generación de derivados en ese equipo, ni ancho/DPR reales suficientes para cerrar un `srcset`. Los protocolos y las herramientas están terminados; la medición no se obtuvo.
- **El informe de `react-loading-skeleton`.** Puede estar dentro de `movimiento-dependencias.md`; hay que abrirlo para confirmarlo, no suponerlo.
- **El historial.** El árbol original no tenía Git. Versiones previas de prototipos y ficheros borrados no vuelven. A partir de este repositorio, sí.
- **La décima biblioteca** de «diez evaluadas y diez fuera» sigue sin identificarse con certeza.

---

## 6 · Decisiones que siguen abiertas y no deben inferirse

Adopción general de la identidad visual de M01 · arquitectura de render público · estrategia de derivados · ImageSharp frente a Magick.NET · límites de decodificación definitivos · contrato de imagen social definitivo · suelos de navegador para panel y para público · valor por defecto de las animaciones ocasionales · uso de la pared de sillares en el login · política de slugs históricos y redirecciones.

Todas son de JP. Un proveedor las investiga; ninguno las cierra.

---

## 7 · Cómo se verificó esto

Abriendo los ficheros, uno por uno, en el commit `d617688` del repositorio del producto. No por búsqueda de términos, no de memoria, y no citando lo que otro documento decía.

La regla que lo produjo, y que aplica a este documento igual que a los demás: **ni el fallo ni el acierto de una búsqueda son una respuesta; abrir el fichero lo es.**
