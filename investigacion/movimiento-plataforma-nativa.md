# Movimiento y carga con la plataforma web

**Veredicto de investigación: View Transitions, `@starting-style`, transiciones discretas y CSS bastan para los casos descritos con cero dependencia; el navegador antiguo pierde el movimiento, no la acción. La excepción estructural es React: una View Transition de una SPA debe envolver el commit DOM sin meter la espera de red dentro.**

Fecha de corte: 18 de agosto de 2026.

## 1. View Transitions API

### Qué resuelve

El navegador captura el estado anterior y el siguiente, crea pseudo-elementos con esas capturas y anima entre ambos. Sirve para relacionar visualmente una navegación, un cambio de filtro, una reordenación o el traslado de un elemento sin implementar FLIP a mano.

La transición por defecto es un crossfade de toda la raíz. En un panel administrativo conviene nombrar solo el elemento cuyo cambio necesita explicación; animar toda la página en cada actualización añade movimiento y coste de captura.

### Soporte real

| Modalidad | Soporte estable comprobado | Estado |
|---|---|---|
| Mismo documento / SPA | Chromium 111+, Safari 18+, Firefox 144+ | Baseline desde octubre de 2025; todavía faltará en equipos corporativos desactualizados. |
| Entre documentos / MPA | Chromium 126+ y Safari 18.2+ | Sigue sin ser Baseline. A agosto de 2026 no se encontró confirmación de soporte estable en Firefox; Mozilla lo incluyó en el trabajo de Interop 2026. |

La parte relevante para React es la primera.

### Adopción progresiva

```ts
function commitView(update: () => void) {
  if (!document.startViewTransition) {
    update()
    return
  }

  document.startViewTransition(() => flushSync(update))
}
```

El ejemplo demuestra el límite de integración; no justifica crear este helper con un solo uso. Sin soporte, `update()` ocurre inmediatamente. Si una transición falla por nombres duplicados u otra razón, el nuevo estado sigue alcanzándose.

En React, el callback de `startViewTransition()` necesita que el nuevo DOM esté comprometido cuando termina. `flushSync` lo fuerza, pero React advierte que puede perjudicar el rendimiento y reactivar fallbacks de Suspense; debe quedar en el punto concreto de integración, no rodear actualizaciones generales.

### Lo que obliga a reestructurar

- La petición de red sucede **antes** de `startViewTransition()`. La guía de Chrome advierte que la página queda congelada mientras se espera una promesa devuelta por su callback.
- La acción y el estado de negocio no esperan a la animación. Solo el commit visual se envuelve.
- Cada `view-transition-name` visible debe ser único. Duplicados hacen que se omita la transición.
- Para animar elementos concretos hay que asignar nombres estables y estilizar los pseudo-elementos.
- Solo puede ejecutarse una transición de documento a la vez; una nueva hace que la anterior salte al final.
- La regla global de movimiento reducido debe incluir los pseudo-elementos de View Transitions.

### Bytes y fallo sin soporte

- Runtime de biblioteca: **0 B**.
- El wrapper ilustrativo son **167 B de TypeScript sin minificar / 131 B gzip**; las reglas CSS concretas suelen quedar en unas pocas centenas de bytes.
- Coste en ejecución: capturas de las superficies nombradas, memoria temporal para ellas y composición. Nombrar grandes tablas o toda la raíz aumenta ese coste.
- Sin soporte: cambio instantáneo. No hace falta polyfill y no se rompe la navegación.

## 2. `@starting-style`, `display` y `overlay`

### ¿Ya abren y cierran un diálogo sin dejar hueco?

Sí, en navegadores actuales. `@starting-style` aporta el estado inicial de entrada; `transition-behavior: allow-discrete` permite que `display` se mantenga visible durante la salida y pase a `none` al final. En un `<dialog>` o popover, añadir `overlay` a la lista retrasa también su retirada de la top layer.

```css
.dialogo {
  opacity: 0;
  transition:
    opacity var(--motion-duration-fast) var(--motion-ease-standard),
    display var(--motion-duration-fast) allow-discrete,
    overlay var(--motion-duration-fast) allow-discrete;
}

.dialogo[open] {
  opacity: 1;
}

@starting-style {
  .dialogo[open] {
    opacity: 0;
  }
}
```

No hay colores en el ejemplo. Un `::backdrop` debe usar exclusivamente la variable validada que corresponda, nunca un literal.

### Límites de estructura

- Funciona naturalmente si el `<dialog>` permanece montado y se controla con `showModal()`/`close()`.
- `@starting-style` sí permite entrada al insertar un nodo, pero CSS no puede animar la salida de un nodo que React desmonta de inmediato. Para ese patrón hay que mantenerlo montado hasta la salida o conservar el diálogo nativo.
- Esperar `transitionend` para ejecutar la acción sería contrario a las reglas: el cierre funcional ocurre primero; la transición conserva solo la representación visual de salida.
- `overlay` continúa marcado como disponibilidad limitada. Si falta, el diálogo sigue abriendo y cerrando; puede abandonar la top layer antes de que termine el efecto visual.

### Bytes y fallo sin soporte

- Runtime de biblioteca: **0 B**.
- El CSS del ejemplo ocupa **315 B sin minificar / 166 B gzip**.
- Sin `@starting-style`: no hay animación de entrada.
- Sin transición discreta de `display`: la salida desaparece inmediatamente.
- Sin `overlay`: puede perderse antes la top layer.
- En todos los casos, el diálogo conserva su comportamiento y deja de ocupar espacio al cerrarse.

## 3. Esqueletos solo con CSS

### Qué puede hacerse

El CSS puede dibujar bloques con la geometría aproximada del contenido y, solo cuando no se ha pedido reducción, mover un brillo. React ya conoce el estado de carga; no hace falta JavaScript adicional para la forma o la animación.

```html
<section aria-busy="true" aria-label="Cargando productos">
  <div class="esqueleto esqueleto--titulo" aria-hidden="true"></div>
  <div class="esqueleto esqueleto--linea" aria-hidden="true"></div>
  <div class="esqueleto esqueleto--linea" aria-hidden="true"></div>
</section>
```

```css
.esqueleto {
  background-color: var(--color-carga-base);
  border-radius: var(--radius-sm);
}

@media (prefers-reduced-motion: no-preference) {
  .esqueleto {
    background-image: linear-gradient(
      90deg,
      var(--color-carga-base),
      var(--color-carga-resalte),
      var(--color-carga-base)
    );
    background-size: 200% 100%;
    animation: brillo-carga var(--motion-duration-loading) linear infinite;
  }
}

@keyframes brillo-carga {
  to { background-position-x: -200%; }
}
```

Los nombres de variables son ilustrativos: tienen que mapearse a tokens existentes y validados, no crearse sin revisar el sistema de diseño.

`aria-busy="true"` comunica que la región está actualizándose. Los huesos son decorativos y deben quedar fuera del árbol accesible. Al completar, la aplicación cambia `aria-busy` a `false` y sustituye el contenido.

### Lo que CSS no puede decidir

CSS no sabe cuándo comenzó o terminó una petición. Tampoco puede aplicar de forma fiable el umbral de un segundo a la experiencia accesible: esconder visualmente un estado no impide necesariamente que un lector de pantalla lo anuncie. Si se quiere montar el indicador solo cuando la petición sigue viva tras el umbral, hacen falta un timer y el estado que React ya usa; no hace falta una biblioteca ni, con un solo caso, un hook.

Un esqueleto conserva el espacio y reduce saltos, pero debe aproximar la geometría real. Si se usa durante una actualización de una lista ya visible, sustituir datos útiles por huesos suele aportar menos que conservar la lista y marcarla como ocupada.

### Bytes y fallo sin soporte

- Runtime de biblioteca: **0 B**.
- El HTML y CSS mostrados suman **769 B sin minificar / 389 B gzip**; una variante sin brillo es sensiblemente menor.
- Si no existe soporte para la media query, la animación está dentro de `no-preference`, por lo que no se activa: degradación segura.
- Si no se admitiera el degradado, queda el color base procedente de la variable.
- Si falla todo el CSS, no hay esqueleto visual; el estado accesible y el contenido final siguen dependiendo del HTML/React.

## Pregunta principal: ¿se escribe a mano en pocas decenas de líneas?

| Capacidad | Respuesta |
|---|---|
| View Transition sencilla | Sí: detección, un commit y unas reglas CSS. Una solución genérica para muchas rutas ya no es el mismo problema y no debe abstraerse antes del segundo caso. |
| Entrada/salida de diálogo | Sí: unas 15 líneas de CSS si el diálogo permanece montado. |
| Esqueleto | Sí: entre 10 y 25 líneas de CSS más el marcado que representa la forma. |
| FLIP robusto de listas arbitrarias | No en pocas decenas: observar inserciones, borrados, reordenaciones, tamaños, scroll e interrupciones eleva mucho el coste. Se evalúa aparte en el informe de dependencias. |

## No encontrado

- No se encontró confirmación de soporte estable de View Transitions entre documentos en Firefox a la fecha de corte. La documentación actual aún marca `@view-transition` como disponibilidad limitada y Mozilla lo mantiene dentro del trabajo de Interop 2026.
- No se encontró una forma CSS de animar la salida de un nodo que React ya retiró físicamente del DOM.
- No existe un coste único en bytes para View Transitions: la API aporta 0 B de runtime, pero el CSS depende de cuántos estados y elementos se estilicen. Por eso se midieron los ejemplos concretos, no una cifra de escaparate.

## Fuentes

- [MDN: `startViewTransition()` y fallback](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition)
- [Chrome: View Transitions en SPA, integración con React y espera de red](https://developer.chrome.com/docs/web-platform/view-transitions/same-document)
- [React: advertencias de `flushSync`](https://react.dev/reference/react-dom/flushSync)
- [Firefox 144: soporte de View Transitions para SPA](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/144)
- [MDN: `@view-transition` entre documentos, disponibilidad limitada](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40view-transition)
- [Mozilla: Cross-document View Transitions en Interop 2026](https://hacks.mozilla.org/2026/02/launching-interop-2026/)
- [MDN: `@starting-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40starting-style)
- [MDN: transición de `display` y `overlay` en `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [MDN: `overlay` sigue con disponibilidad limitada](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overlay)
- [MDN: `aria-busy`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)
