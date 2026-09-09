# Mapa de archivos de SILLAR-DISENO

> Inspección solo lectura realizada el 29 de agosto de 2026. Se encontraron 39 archivos relevantes y no se encontró `.git` en `C:\SILLAR-DISENO`.

## `investigacion/` — fuentes intelectuales

Todos estos archivos deben conservarse.

| Ruta | Función y estado |
|---|---|
| `auragradients.md` | Informe fuente. Técnica de degradados, licencia no identificada, costes y versión manual. |
| `descubrimiento-minimo-catalogo.md` | Informe fuente. SEO mínimo, JSON-LD, canonical, sitemap y separación de trabajo. |
| `fotos-catalogo-publico.md` | Informe fuente. Formatos, responsive, lazy/LCP/CLS, derivados y cifra de 50 productos. |
| `limites-decodificacion-imagenes.md` | Informe fuente. Límites propuestos, parsers y evaluación .NET. |
| `morphicons.md` | Informe fuente. Biblioteca, peso/licencia/reduced motion y alternativa manual. |
| `orientacion-y-metadatos-de-fotos.md` | Informe fuente. Autoorientación, sRGB, privacidad y pruebas. |
| `pared-de-sillares.md` | Informe fuente principal de la animación y protocolo de medición. |
| `previsualizacion-enlaces-mensajeria.md` | Informe fuente. WhatsApp/OG, SPA y protocolo de prueba. |
| `previsualizacion-mensajeria-600kb.md` | Informe fuente. Contrato JPEG social y bucle de compresión. |
| `puerta-animaciones-ocasionales.md` | Informe fuente principal del permiso, hardware y catálogo de técnicas. |
| `salidas-renderizado-publico.md` | Informe fuente. Opciones de render y coste de migración. |
| `sileo.md` | Informe fuente ampliado; al final conserva las ideas manuales útiles. |
| `soporte-navegadores-peru.md` | Informe fuente temporal. Cuotas de julio de 2026 y tres escenarios de suelo. |

## `investigacion/pared-de-sillares/` — código de referencia

| Archivo | Tipo | Función |
|---|---|---|
| `ParedDeSillaresEspera.tsx` | fuente de referencia | Componente concreto; no framework. |
| `pared-de-sillares-espera.css` | fuente de referencia | Caídas/salida/reduced motion con tokens. |
| `IntegracionReinicioModulo.tsx` | ejemplo | Cableado de fases reales y desbloqueo inmediato. |
| `ParedDeSillaresEspera.harness.tsx` | prueba | Página de prueba aislada. |
| `pared-de-sillares-espera.spec.ts` | prueba | Playwright: umbral, no bloqueo, reducción y cambio caliente. |
| `benchmark-pared.html` | benchmark | Escenario sin build para medir la pared. |
| `ejecutar-benchmark-cdp.mjs` | herramienta | Ejecuta medición con Chrome DevTools Protocol. |

Estado: terminados como entrega para aplicar. No se ejecutaron contra el producto. Conservar juntos.

## `investigacion/puerta-animaciones-ocasionales/`

| Archivo | Tipo | Función |
|---|---|---|
| `PuertaAnimacionesOcasionales.tsx` | fuente de referencia | Context/provider/hook de permiso y precedencia. |
| `animaciones-ocasionales.css` | fuente de referencia | Defensa CSS y atributos de raíz. |
| `EjemploAnimacionOcasionalJS.tsx` | ejemplo | Cancelación/estado final de una animación JS. |
| `ejemplo-animacion-css.css` | ejemplo | Efecto CSS detrás de la puerta. |
| `PuertaAnimacionesOcasionales.harness.tsx` | prueba | Harness de estados sistema/instalación. |
| `puerta-animaciones-ocasionales.spec.ts` | prueba | Precedencia, fail closed y cambios calientes. |
| `benchmark-concurrencia.html` | benchmark | Compara compositor, paint y layout con 1–64 elementos. |
| `ejecutar-benchmark-concurrencia.mjs` | herramienta | Automatización CDP. |
| `integrar-pared-con-puerta.diff` | parche no aplicado | Muestra la integración posterior; no es estado del producto. |

## `propuestas/M01/` — propuesta visual del catálogo

| Archivo | Tipo | Función/estado |
|---|---|---|
| `Catálogo - cuatro estados.dc.html` | fuente de propuesta + tablero | Banco interactivo y comparación claro/oscuro/compacto de listado y detalle. Conservar. |
| `Listado de productos.dc.html` | fuente de propuesta | Pantalla de listado con cuatro estados. Conservar. |
| `Detalle de producto.dc.html` | fuente de propuesta | Pantalla de alta/edición con tres conflictos. Conservar. |
| `.thumbnail` | imagen PNG sin extensión visible | Miniatura 465×609 del tablero. Generada pero útil para identificación visual; conservar. |
| `harness.css` | auxiliar de revisión | Permite anidar temas y mostrar foco programático. Puede derivar respecto de tokens; no es CSS de producto. |
| `support.js` | runtime generado | Soporte de Design Compose para abrir prototipos. No contiene decisiones primarias; conservar si se quiere reproducibilidad. |

### `_ds/sillar-ui-25e4271c-0565-4ef0-832f-a8eba6ce38e5/`

| Archivo | Tipo | Función |
|---|---|---|
| `tokens/tokens.css` | fuente visual de la propuesta | Paleta, roles, temas, espacios, radios, tipografía y sombras. Valor intelectual alto. |
| `tokens/base.css` | fuente visual base | Reset mínimo, tipografía, foco, reduced motion y `sr-only`. |
| `styles.css` | entrada generada | Importa tokens/base/bundle. |
| `_ds_bundle.js` | generado por `cc-design-sync` | Implementaciones compiladas de 16 componentes SillarUI para la revisión. |
| `_ds_bundle.css` | generado por `cc-design-sync` | Estilos compilados de esos componentes. |

Componentes enumerados por metadata del bundle: Alert, Badge, Button, Card, ConfirmDialog, Drawer, EmptyState, FailureAlert, Field, Gallery, Input, Pagination, Spinner, Switch, Table y Toasts.

## Recursos visuales encontrados

- Una sola imagen independiente: `propuestas\M01\.thumbnail`, reconocida como PNG 465×609.
- No se encontraron SVG independientes, logos, fuentes binaria, screenshots adicionales ni exportaciones Figma.
- Los prototipos dibujan placeholders de fotos dentro de HTML/React; no hay fotografías de producto como assets separados.

## Archivos mencionados pero ausentes

No aparecen en el árbol actual:

- informes/código del indicador de espera, escala de movimiento y token de velo;
- informes de View Transitions, `@starting-style`, skeleton CSS y umbrales de espera;
- informes de Three.js, GSAP, Liquid Gooey, react-loading-skeleton, Motion y AutoAnimate;
- posible informe separado de SEO/WhatsApp previo a los que sí existen;
- diseños de sidebar, dashboard, shell global u otros módulos.

Ver `12_DATOS_NO_RECUPERABLES.md`; ausencia no debe interpretarse como tema nunca discutido.

## Git

`C:\SILLAR-DISENO\.git` no existe. Por tanto:

- no se pudieron inspeccionar commits, ramas, versiones anteriores o archivos borrados;
- los hashes SHA-256 observados sirven para inventario puntual, no como historial;
- no debe inicializarse Git como parte de este respaldo.
