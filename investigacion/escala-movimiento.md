# Escala de movimiento

**Veredicto: tres duraciones bastan para los casos descritos; se sostienen 120/180/240 ms, pero conviene reutilizar el escalón inferior para las salidas (120/120/180 ms) y cambiar las curvas propuestas por curvas realmente direccionales de entrada y salida.**

Fecha de consulta: 18 de agosto de 2026.

## Escala resultante

| Rol | Entrada | Salida | Uso |
|---|---:|---:|---|
| Control | 120 ms | 120 ms | hover, presión, toggle, indicación local |
| Mensaje | 180 ms | 120 ms | aviso, menú, popover, validación contextual |
| Superficie | 240 ms | 180 ms | diálogo, panel, cajón o superficie compuesta |
| Cambio reducido | 80 ms de opacidad | 80 ms de opacidad | sin desplazamiento, escala ni rotación |

No hace falta un cuarto escalón ahora. Una transición de página completa o una visualización espacial grande podría justificarlo, pero aún no es un segundo caso real. El período de un bucle —por ejemplo un indicador indeterminado— es otra magnitud y debe llevar un token por función, no ampliar esta escala.

## Evidencia para las duraciones

- Nielsen Norman Group sitúa la mayoría de animaciones de interfaz entre 100 y 500 ms y recomienda escoger la duración más corta que no resulte brusca; advierte que es más habitual pasarse de largo que quedarse corto. También muestra 100 ms como microinteracción. [NN/g — Executing UX Animations](https://www.nngroup.com/articles/animation-duration/).
- Atlassian usa 50–150 ms para interacciones y 150–400 ms para entradas, salidas o desplazamientos; ofrece como referencias 150 ms para un desplegable y 250 ms para un diálogo. [Atlassian Design — Motion](https://atlassian.design/foundations/motion/).
- Carbon coloca las microinteracciones en 90–120 ms, usa 150 ms para expansión pequeña y 240 ms para expansión y comunicación del sistema. [Carbon — Motion overview](https://carbondesignsystem.com/elements/motion/overview/).

Por eso 120 ms encaja en controles frecuentes, 180 ms crea un escalón útil para mensajes sin saltar directamente a 240, y 240 ms coincide con una referencia publicada para comunicación/superficie. No hay una fuente que valide exactamente 180 ms; es una interpolación de sistema entre referencias de 150 y 240 ms.

Tampoco se encontró investigación de usabilidad que establezca «dos tercios» como proporción universal para salidas. Sí existe la convención convergente de que las entradas ayudan a localizar y las salidas deben quitarse de en medio. Reutilizar el escalón inferior produce esa diferencia sin inventar un cuarto valor de 160 ms. Para controles se mantienen 120 ms en ambos sentidos: reducirlos por debajo obligaría a crear otro token y el beneficio no está demostrado.

## Curvas: ajuste a la propuesta

La curva propuesta para entrar, `cubic-bezier(.2,0,.4,1)`, parte con velocidad vertical nula; se comporta como una curva de inicio y asentamiento, no como una entrada que responde de inmediato. La evidencia recomienda *ease-out* al entrar y *ease-in* al salir:

- NN/g explica que una entrada desacelera hasta detenerse y una salida acelera al abandonar el encuadre.
- Carbon publica para movimiento productivo `cubic-bezier(0,0,.38,.9)` al entrar y `cubic-bezier(.2,0,1,.9)` al salir.

Para un panel de trabajo se adoptan esas dos curvas productivas como valores propuestos para validación. No son una exigencia normativa; son referencias implementadas en un sistema maduro. `linear` queda reservado a cambios de velocidad constante, principalmente bucles.

## Regla de no bloqueo

Los tokens describen la presentación, nunca el calendario de la acción:

- el estado, navegación, petición o cierre se ejecuta al activar el control;
- no se usa `setTimeout` para esperar la transición;
- no se espera `transitionend` ni `animationend` para habilitar el siguiente paso;
- si conservar un nodo para animar su salida mantiene un velo, foco atrapado o superficie interactiva, esa salida se omite.

La animación puede acompañar un DOM ya actualizado; no puede decidir cuándo se actualiza.

## Código listo para aplicar

### Tokens y política global

Este bloque **sustituye** el bloque global actual de reducción cuando se adopte la escala. El arreglo del indicador de espera puede aplicarse antes sin tocar la regla existente; al migrar a esta política, su texto accesible sigue siendo necesario aunque el anillo también quede detenido.

```css
:root {
  --duracion-control: 120ms;
  --duracion-mensaje: 180ms;
  --duracion-superficie: 240ms;

  --duracion-salida-control: var(--duracion-control);
  --duracion-salida-mensaje: var(--duracion-control);
  --duracion-salida-superficie: var(--duracion-mensaje);

  --duracion-cambio-reducido: 80ms;

  --curva-entrada: cubic-bezier(0, 0, 0.38, 0.9);
  --curva-salida: cubic-bezier(0.2, 0, 1, 0.9);
  --curva-bucle: linear;
}

@keyframes vista-reducida-entrar {
  from { opacity: 0; }
}

@keyframes vista-reducida-salir {
  to { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation: none !important;
    transition-property: opacity !important;
    transition-duration: var(--duracion-cambio-reducido) !important;
    transition-delay: 0ms !important;
    transition-timing-function: var(--curva-entrada) !important;
  }

  /* Las capturas de View Transitions no deben interpolar posición ni tamaño. */
  ::view-transition-group(*),
  ::view-transition-image-pair(*) {
    animation: none !important;
  }

  ::view-transition-old(*) {
    animation: vista-reducida-salir
      var(--duracion-cambio-reducido)
      var(--curva-salida)
      both !important;
  }

  ::view-transition-new(*) {
    animation: vista-reducida-entrar
      var(--duracion-cambio-reducido)
      var(--curva-entrada)
      both !important;
  }
}
```

La regla global hace que sea necesario salirse **adrede** para introducir movimiento espacial:

- las animaciones de `@keyframes` quedan desactivadas;
- cualquier `transition` se restringe a `opacity` durante 80 ms;
- `transform`, `translate`, `scale`, `rotate`, `filter` y cambios de geometría se aplican instantáneamente, no se interpolan;
- las View Transitions reciben un fundido explícito de 80 ms sin transformación de grupo.

No se usa `transform: none !important`: un `transform` puede ser parte del estado final o del posicionamiento, y borrarlo rompería la interfaz. Se impide su **transición**, no su valor.

### Ejemplo de consumo

```css
.aviso {
  transition:
    opacity var(--duracion-mensaje) var(--curva-entrada),
    translate var(--duracion-mensaje) var(--curva-entrada);
}

.aviso[data-saliendo="true"] {
  transition-duration: var(--duracion-salida-mensaje);
  transition-timing-function: var(--curva-salida);
}

.dialogo {
  transition:
    opacity var(--duracion-superficie) var(--curva-entrada),
    scale var(--duracion-superficie) var(--curva-entrada);
}

.dialogo[data-saliendo="true"] {
  transition-duration: var(--duracion-salida-superficie);
  transition-timing-function: var(--curva-salida);
}
```

Bajo reducción, el selector global convierte ambos ejemplos en un fundido de 80 ms. El autor del componente no necesita agregar otra media query.

## Sobre los 80 ms

No se encontró una norma ni un estudio que prescriba 80 ms para movimiento reducido. Es una decisión de escala defendible porque cae dentro del intervalo rápido de interacción de Atlassian, por debajo de los 100 ms usados como referencia de respuesta prácticamente inmediata y permite percibir un cambio de opacidad sin introducir desplazamiento vestibular.

La opacidad no siempre se clasifica como *motion animation* en WCAG, pero también puede molestar a una minoría. Por eso 80 ms es el máximo por defecto, no una obligación de animar: un componente crítico puede cambiar instantáneamente si una prueba con usuarios lo exige.

## Prueba de contrato recomendada

```ts
import { expect, test } from "@playwright/test";

test("la política reducida conserva solo opacidad durante 80 ms", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/__pruebas__/movimiento");

  const muestra = page.getByTestId("muestra-movimiento");
  await expect(muestra).toHaveCSS("transition-property", "opacity");
  await expect(muestra).toHaveCSS("transition-duration", "0.08s");
  await expect(muestra).toHaveCSS("animation-name", "none");
});
```

Esta prueba no valida que una transición «se vea bonita». Impide tres regresiones objetivas: recuperar una transición espacial, superar 80 ms o reactivar keyframes bajo reducción. Playwright documenta `reducedMotion: "reduce"` en [`page.emulateMedia`](https://playwright.dev/docs/api/class-page#page-emulate-media).

## Riesgos y huecos señalados

- El selector universal es deliberadamente estricto. Una excepción futura tendría que documentar por qué el movimiento es esencial y llevar su propia prueba.
- CSS no alcanza animaciones creadas en JavaScript ni `requestAnimationFrame`. Esta política no autoriza movimiento JS; todo caso futuro debe escuchar cambios de `matchMedia` en caliente y detener su ejecución.
- `transition-property: opacity` puede crear un fundido en cambios de opacidad que antes eran instantáneos. Es precisamente el comportamiento por defecto pedido; debe comprobarse que ningún control dependa de desaparecer antes de recibir eventos. La lógica debe usar `hidden`, `inert`, desmontaje o estado funcional inmediatamente.
- No se encontró evidencia para 180 ms exactos ni para 80 ms exactos. Son decisiones de escala trazables, no umbrales normativos.

