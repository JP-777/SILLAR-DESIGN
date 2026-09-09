# `prefers-reduced-motion`: cobertura por defecto

**Veredicto de investigación: una regla global puede volver seguras por defecto las animaciones CSS, incluidas las View Transitions, pero no puede gobernar animaciones creadas en JavaScript, canvas, vídeo ni contenido dentro de un Shadow DOM; esos casos necesitan consultar y escuchar la preferencia explícitamente.**

Fecha de corte: 18 de agosto de 2026.

## La cobertura que sí puede vivir una sola vez en CSS

Hay dos capas complementarias:

1. Los tiempos normales salen de tokens de movimiento. Esto da consistencia.
2. Una regla de seguridad global acorta cualquier animación o transición, incluso si alguien no usó esos tokens. Esto evita depender de la memoria de cada autor.

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration-fast: 0.001ms;
    --motion-duration-standard: 0.001ms;
    --motion-duration-slow: 0.001ms;
  }

  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    transition-delay: 0ms !important;
  }

  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

El valor casi cero, en lugar de `animation: none`, permite que código heredado que escuche `animationend` siga recibiendo el evento. No debe usarse ese evento para ejecutar la acción: bajo la regla del producto, el estado funcional cambia primero y la animación solo lo acompaña.

La regla mostrada ocupa **673 B en UTF-8 y 228 B en gzip** con su formato legible. No añade JavaScript ni trabajo por fotograma; solo altera valores calculados cuando coincide la media query.

Los pseudo-elementos de View Transitions se incluyen de forma expresa porque no son descendientes DOM alcanzados por `*`. La documentación de Chrome muestra precisamente esos tres selectores como cobertura para movimiento reducido.

### Cuánto garantiza y cómo se puede romper

La regla cubre animaciones CSS, transiciones CSS, desplazamiento suave declarado con CSS y las animaciones CSS de View Transitions. Una declaración posterior con `!important` y mayor precedencia, un estilo inline `!important`, otro origen de estilos o un Shadow DOM con su propia hoja pueden imponerse. Es decir: romper la protección exige una acción bastante deliberada, pero no es matemáticamente imposible.

Si el proyecto usa cascade layers, la regla puede ponerse en una capa de seguridad declarada antes que las demás: las declaraciones `!important` invierten el orden de prioridad entre capas. Eso debe encajarse con la arquitectura CSS real; este informe no ha leído esos documentos.

`reduce` significa “reducir movimiento no esencial”, no necesariamente eliminar toda variación visual. Aun así, el backstop casi cero es coherente con la exigencia concreta de que una omisión futura no deje movimiento activo. Un indicador de carga que deje de girar debe conservar texto o estructura estática que comunique el estado.

## Lo que CSS no puede cubrir

La regla global no detiene ni adapta:

- Web Animations API (`element.animate()` y objetos `Animation`);
- bucles con `requestAnimationFrame`, timers o cambios de estilo realizados desde JavaScript;
- scroll imperativo con `{ behavior: "smooth" }`;
- canvas, WebGL y librerías que dibujan sus propios fotogramas;
- GIF/APNG animados, Lottie y otros reproductores;
- vídeo con reproducción automática;
- animaciones dentro de Shadow DOM ajenos;
- una biblioteca que aplique duración o transformaciones mediante JavaScript.

En esos casos se necesita `matchMedia`. La consulta inicial no basta: hay que escuchar `change` y cancelar cualquier movimiento que ya esté en curso.

```ts
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)")

function syncMotionPreference(event: MediaQueryListEvent | MediaQueryList) {
  if (event.matches) {
    runningAnimations.forEach((animation) => animation.cancel())
    runningAnimations.clear()
  }
}

syncMotionPreference(reducedMotion)
reducedMotion.addEventListener("change", syncMotionPreference)

// En el desmontaje del único consumidor:
reducedMotion.removeEventListener("change", syncMotionPreference)
```

Esto es el mecanismo, no una propuesta de `hook`. Si hoy existe un solo consumidor JavaScript, cabe localmente allí. Solo cuando aparezca un segundo consumidor real tiene sentido extraer una suscripción compartida. En una aplicación con renderizado en servidor, la creación del `MediaQueryList` tendría además que ocurrir solo en cliente.

El ejemplo JavaScript ocupa **482 B sin minificar y 260 B gzip**. El coste de cada motor real dependerá además de cómo conserve y cancele sus animaciones.

Al cancelar, el DOM o el estado de React ya debe representar el resultado final. `cancel()` no puede ser la operación que confirme, guarda o navega.

## Cambio de preferencia en caliente

- **CSS:** las media queries se reevalúan automáticamente cuando cambia la preferencia; no hace falta recargar.
- **JavaScript:** `MediaQueryList` emite `change`. Hay que actualizar futuros movimientos y cortar los actuales.
- **Medios autónomos:** hay que pausar o sustituir vídeo, canvas o reproductores desde el mismo listener. Una hoja CSS no puede hacerlo.

La guía de web.dev documenta tanto la reevaluación dinámica de CSS como el listener necesario para Web Animations API. El hook `useReducedMotion` de Motion también declara que reacciona en caliente, pero eso no convierte a Motion en requisito: `matchMedia` ya ofrece la señal.

## Prueba mínima que evita regresiones

La comprobación no debe limitarse al valor al cargar:

1. Abrir una vista con movimiento permitido.
2. Iniciar una animación JavaScript que dure lo suficiente para observarla.
3. Activar “reducir movimiento” en el sistema o en la emulación del navegador sin recargar.
4. Confirmar que la animación en curso se corta, que la siguiente no comienza y que la acción funcional ya ocurrió.
5. Repetir con View Transitions, scroll suave, esqueletos y cualquier Shadow DOM usado.

## No encontrado

No hay una primitiva del navegador que aplique automáticamente `prefers-reduced-motion` a toda animación JavaScript o a todo medio animado de una página. Tampoco hay una regla CSS capaz de atravesar Shadow DOM arbitrarios. La cobertura completa exige inventariar esos motores cuando aparezcan.

## Fuentes

- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)
- [web.dev: cambios dinámicos y Web Animations API](https://web.dev/articles/prefers-reduced-motion)
- [MDN: evento `change` de `MediaQueryList`](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event)
- [Chrome: View Transitions y movimiento reducido](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#react-to-the-reduced-motion-preference)
- [MDN: medios animados que CSS no controla](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Browsing_safely)
