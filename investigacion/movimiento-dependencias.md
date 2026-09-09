# Dependencias para movimiento y estados de carga

**Veredicto de investigación: ninguna dependencia gana sitio para diálogos, apariciones o esqueletos; AutoAnimate sí resuelve un FLIP genérico que no cabe limpiamente en pocas líneas, pero su versión 0.10.0 no reacciona a cambios de `prefers-reduced-motion` en caliente y añade observadores y sondeos periódicos. Motion ofrece todavía más, con un coste muy superior y movimiento reducido desactivado por defecto.**

Fecha de corte y versiones consultadas: 18 de agosto de 2026; `@formkit/auto-animate` 0.10.0, `react-loading-skeleton` 3.5.0 y `motion` 13.1.0. No se instaló ningún paquete.

## Cómo se midió

- `npm view` para versión, dependencias y licencia declarada.
- `npm pack --dry-run --json` para inspeccionar el artefacto publicado y comprobar el archivo de licencia.
- Compresión gzip local de las salidas ya publicadas, sin compilar contra el producto.
- Cuando el tamaño final depende del import y del tree-shaking, se informa como rango o proxy, no como una precisión falsa.

El peso exacto del chunk Vite de SILLAR no se puede conocer sin compilar el producto, al que esta investigación no accede. Queda señalado en cada caso.

## `react-loading-skeleton` 3.5.0

**QUÉ RESUELVE**  Un componente React que genera una o varias líneas, adapta su tamaño al texto contenedor, permite círculo/anchura/altura y aporta tema. Es comodidad de marcado, no una capacidad difícil de reproducir.

**QUÉ PESA**  Artefacto npm: 7.6 kB comprimido y 26.7 kB desempaquetado. Entrada ESM publicada: 4,617 B crudos / 1,621 B gzip; CSS: 1,255 B / 531 B gzip. Proxy total antes de minificación y deduplicación de Vite: **2.15 kB gzip**. Tamaño exacto del chunk final: no medido por falta deliberada de acceso al producto.

**QUÉ ARRASTRA**  Ninguna dependencia runtime; React `>=16.8.0` como peer, ya presente en el producto.

**LICENCIA**  MIT. El tarball publicado contiene `LICENSE` de 1,050 B, además del identificador en `package.json`.

**REDUCED-MOTION**  Correcto por defecto en CSS: su media query oculta el pseudo-elemento animado y responde en caliente. Sin embargo, la hoja publicada contiene colores literales por defecto (`#ebebeb` y `#f5f5f5`). Aunque pueden sobrescribirse, esos literales siguen viajando en el CSS; si la regla “ningún color escrito a mano” se aplica también al código de terceros distribuido, hay una incompatibilidad material.

**SIN ELLA**  Entre 10 y 25 líneas de CSS y el marcado local. El ejemplo del informe de plataforma ya cubre estructura, variables de color y movimiento reducido. **Coste bajo; aquí termina la justificación como dependencia.**

### Alternativas y coste

| Alternativa | Bytes propios | Rendimiento | Mantenimiento |
|---|---:|---|---|
| CSS local | Menos de 1 kB sin minificar en el ejemplo | Una animación de background solo bajo `no-preference`; puede omitirse por completo | Mantener la geometría junto al componente real |
| `<progress>` nativo | 0 B de runtime | Adecuado si existe progreso medible; no reserva la forma del contenido | Semántica nativa; no sustituye un esqueleto |

## `@formkit/auto-animate` 0.10.0

**QUÉ RESUELVE**  Observa los hijos directos de un contenedor y anima altas, bajas y movimientos. Calcula posiciones y tamaños, aplica FLIP con Web Animations API, conserva temporalmente nodos borrados para su salida y corrige scroll. Ese conjunto robusto no es razonable en unas pocas decenas de líneas.

**QUÉ PESA**  Artefacto npm: 16.9 kB comprimido y 59.2 kB desempaquetado. Core preminificado publicado: 8,406 B crudos / **3,266 B gzip**; adaptador React publicado: 1,142 B / **475 B gzip**. El proxy combinado es **3.74 kB gzip** antes de que Vite deduplique y vuelva a minificar. El ESM sin minificar completo es 27,409 B / 6,999 B gzip. Tamaño exacto del chunk final: no medido.

**QUÉ ARRASTRA**  Cero dependencias runtime declaradas. El adaptador importa React, ya presente, pero el paquete no lo declara como peer. En ejecución crea `MutationObserver`, `ResizeObserver` e `IntersectionObserver`; además, el código 0.10.0 programa sondeos de posición cada dos segundos, escalonados, para los elementos observados. En listas grandes ese trabajo de medición y mantenimiento es parte del coste, aunque se programe con prioridad baja.

**LICENCIA**  MIT. El tarball publicado contiene `LICENSE` de 1,052 B.

**REDUCED-MOTION**  Al inicializar, consulta `matchMedia("(prefers-reduced-motion: reduce)")` y no habilita la animación si coincide. Dos límites aparecen en el propio código 0.10.0:

- no registra un listener `change`, por lo que un cambio de preferencia en caliente no deshabilita una instancia ya creada;
- si se pasa un plugin de animación, la comprobación se omite.

El controlador permite `disable()` y cancela movimientos en curso, así que se puede cablear una solución central; deja de ser cumplimiento automático y añade integración que mantener.

**SIN ELLA**  Para una lista conocida, una View Transition progresiva ocupa alrededor de 10–20 líneas entre commit y CSS, y el navegador antiguo salta directamente al resultado. Para replicar el comportamiento genérico de AutoAnimate —inserción, borrado retenido, reordenación, resize, scroll, interrupciones y observación— el propio fuente tiene cientos de líneas. Solo el segundo problema es el valor diferencial real de la dependencia.

### Alternativas y coste

| Alternativa | Peso | Qué pierde o añade |
|---|---:|---|
| View Transitions API | 0 B runtime; centenas de bytes de integración | Resuelve un cambio conocido y degrada a instantáneo. No observa cualquier mutación automáticamente. |
| FLIP manual para un caso | Aproximadamente 30–60 líneas iniciales | Barato si solo hay un reordenamiento controlado; crece rápido con borrados, resize y scroll. La preferencia debe gestionarse en JS. |
| Motion con layout/reorder | Decenas de kB gzip | Más control, gestos y springs; mucho más peso y política reduced-motion no segura por defecto. |

### Mantenimiento observado

La versión 0.10.0 es reciente y el repositorio estaba activo en julio de 2026. También hay incidencias abiertas sobre React StrictMode, nodos borrados que quedan superpuestos, transformaciones del padre y comportamiento fuera del viewport. No prueban que el paquete falle en SILLAR, pero señalan los bordes que habría que ensayar con tablas, virtualización y filtros reales.

## `motion` 13.1.0

**QUÉ RESUELVE**  Springs, keyframes, gestos, drag, layout compartido, presencia/salida de componentes, valores derivados y orquestación declarativa. Es una plataforma de movimiento; no solo una transición de diálogo o un esqueleto.

**QUÉ PESA**  La documentación oficial indica unos **34 kB gzip** para el componente `motion`. `LazyMotion` baja el render inicial a **4.6 kB**, pero carga después un paquete de funciones de aproximadamente **15 kB** (`domAnimation`) o **25 kB** (`domMax`). Son mediciones Rollup del propio proyecto; Webpack puede ser algo mayor. El tarball del wrapper `motion` mide 170.9 kB comprimido / 683.0 kB desempaquetado, pero ese no es el peso enviado al navegador.

**QUÉ ARRASTRA**  `framer-motion`, `tslib`; a su vez `framer-motion` arrastra `motion-dom`, `motion-utils` y `tslib`. React y React DOM son peers. La cadena añade API, actualizaciones y superficie de pruebas aunque el tree-shaking reduzca bytes.

**LICENCIA**  MIT para `motion`, `framer-motion`, `motion-dom` y `motion-utils`; 0BSD para `tslib`. Los tarballs revisados incluyen `LICENSE.md` o `LICENSE.txt` en cada uno. Tener el texto en npm no lo copia automáticamente al artefacto comercial de SILLAR: el build de publicación tendría que conservar o agregar esos textos.

**REDUCED-MOTION**  **No por defecto.** `MotionConfig` usa `reducedMotion="never"` como valor inicial. Configurar una vez `reducedMotion="user"` desactiva transformaciones y layout pero conserva opacidad y color; `useReducedMotion()` sí responde a cambios en caliente. La configuración raíz evita corregir cada componente, pero sigue siendo una corrección obligatoria para que el paquete cumpla.

**SIN ELLA**  Los tres casos actuales —View Transition, diálogo y esqueleto— cuestan pocas decenas de líneas con plataforma web. Drag accesible, springs encadenados o presencia genérica sí costarían cientos de líneas y pruebas, pero no se ha aportado hoy un segundo caso real que los necesite. **Para el alcance investigado, “sin ella” cuesta poco.**

## Comparación corta

| Opción | Valor que no cabe en pocas líneas | Peso navegador orientativo | Reduced motion por defecto | Texto de licencia en tarball |
|---|---|---:|---|---|
| CSS / APIs nativas | Ninguno para los casos simples | 0 B runtime | Sí con la hoja base | No aplica |
| `react-loading-skeleton` | No | ~2.15 kB gzip, proxy publicado | Sí | Sí |
| AutoAnimate | FLIP genérico de mutaciones DOM | ~3.74 kB gzip, proxy publicado | Solo al inicializar; no cambio en caliente | Sí |
| Motion | Gestos, springs, presencia y layout como sistema | 34 kB normal; 4.6 kB inicial con carga diferida | No (`never`) | Sí, incluida la cadena revisada |

## No encontrado

- No se obtuvo el tamaño exacto dentro del build Vite de SILLAR porque el encargo excluye el producto. Los tamaños npm no se presentan como sustituto de ese dato.
- No se encontró en AutoAnimate 0.10.0 una suscripción al cambio en caliente; el fuente publicado muestra únicamente la consulta durante `autoAnimate()`.
- No se encontró una capacidad de `react-loading-skeleton` que justifique su coste frente al CSS local bajo estas restricciones.

## Fuentes

- [AutoAnimate: documentación oficial](https://auto-animate.formkit.com/)
- [AutoAnimate 0.10.0: fuente de reduced motion y controlador](https://github.com/formkit/auto-animate/blob/master/src/index.ts)
- [AutoAnimate: `package.json`](https://github.com/formkit/auto-animate/blob/master/package.json)
- [AutoAnimate: incidencias abiertas](https://github.com/formkit/auto-animate/issues)
- [`react-loading-skeleton`: repositorio y API](https://github.com/dvtng/react-loading-skeleton)
- [`react-loading-skeleton`: CSS publicado](https://github.com/dvtng/react-loading-skeleton/blob/master/src/skeleton.css)
- [Motion: tamaño y `LazyMotion`](https://motion.dev/docs/react-reduce-bundle-size)
- [Motion: `MotionConfig`, valor por defecto de reduced motion](https://www.motion.dev/docs/react-motion-config)
- [Motion: accesibilidad y cambio en caliente](https://motion.dev/docs/react-use-reduced-motion)
- [Registro npm: AutoAnimate 0.10.0](https://www.npmjs.com/package/@formkit/auto-animate/v/0.10.0)
- [Registro npm: `react-loading-skeleton` 3.5.0](https://www.npmjs.com/package/react-loading-skeleton/v/3.5.0)
- [Registro npm: Motion 13.1.0](https://www.npmjs.com/package/motion/v/13.1.0)

