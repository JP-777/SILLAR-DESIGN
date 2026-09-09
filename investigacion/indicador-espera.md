# Indicador de espera con movimiento reducido

**Veredicto: el estado de espera es información esencial, pero el giro no lo es; con movimiento reducido el anillo debe quedar quieto y el texto `Cargando…` debe permanecer visible y expuesto mediante una región `status` persistente.**

Fecha de consulta: 18 de agosto de 2026.

## Qué exige la norma

WCAG 2.2, criterio 2.2.2, reconoce expresamente que una animación de precarga puede considerarse esencial cuando durante esa fase no se puede interactuar y omitir el progreso haría pensar que la interfaz se congeló o se rompió. La misma norma define *esencial* de manera más estricta: al retirar algo cambiaría fundamentalmente la información o la función y no habría otra forma conforme de conseguirla. Por tanto:

- comunicar «la aplicación sigue esperando» sí puede ser esencial;
- hacer girar un anillo no lo es cuando texto estático y semántica accesible comunican el mismo estado;
- no hace falta abrir una excepción que conserve el giro bajo `prefers-reduced-motion`; conviene sustituirlo.

Fuentes: [WCAG 2.2 — Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide) y [WCAG 2.2 — Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).

Hay un segundo defecto independiente del movimiento. WCAG considera el estado de espera y el progreso mensajes de estado. La técnica de fallo F103 indica que la ausencia de `role="status"`, `role="alert"`, `role="log"` o una región `aria-live` predice un incumplimiento, y que el rol debe existir **antes** de insertar el mensaje dinámico. Un SVG o anillo puramente visual no cubre ese contrato. Fuente: [W3C F103](https://www.w3.org/WAI/WCAG22/Techniques/failures/F103.html).

## Patrón accesible

El patrón resuelto tiene dos piezas separadas:

1. La región cuyo contenido se está actualizando lleva `aria-busy="true"` mientras espera. Esto describe su estado y permite que las tecnologías de asistencia posterguen cambios internos incompletos.
2. Fuera de esa región ocupada vive, desde el primer render, una región `role="status"`, `aria-live="polite"` y `aria-atomic="true"`. Su contenido cambia una vez al comenzar y una vez al terminar.

`status` ya implica `aria-live="polite"` y `aria-atomic="true"` en WAI-ARIA 1.2; se escriben de forma explícita para que el contrato sea visible en el componente y para reducir diferencias históricas de implementación. El rol no recibe foco. `aria-busy` indica que una región está siendo modificada y que la tecnología de asistencia puede esperar hasta que el cambio esté completo. Fuentes: [WAI-ARIA 1.2 — role status](https://www.w3.org/TR/wai-aria-1.2/#status) y [WAI-ARIA 1.2 — aria-busy](https://www.w3.org/TR/wai-aria-1.2/#aria-busy).

La región de estado no debe vivir dentro del nodo con `aria-busy="true"`: hacerlo puede posponer precisamente el anuncio «Cargando…». Tampoco debe actualizar un contador, los puntos suspensivos ni mensajes temporizados cada pocos segundos. Solo se anuncian transiciones reales:

```text
reposo -> cargando     «Cargando resultados…»
cargando -> completado «Carga completada.»
```

Si la finalización mueve el foco a contenido nuevo y ese cambio ya comunica inequívocamente el resultado, puede omitirse «Carga completada». Si no mueve el foco —el caso habitual al refrescar una tabla— debe anunciarse.

## Qué hacen sistemas maduros

- Carbon exige comunicar el estado a tecnologías de asistencia y recomienda anunciar la finalización cuando la desaparición visual del indicador no basta. Su implementación concreta expone un título del SVG; para SILLAR, `role="status"` en un nodo persistente hace más explícito el ciclo completo. [Carbon — Loading accessibility](https://preview.carbondesignsystem.com/building-blocks/core/components/loading/accessibility).
- Fluent recomienda que los indicadores lleven una etiqueta verbal breve —por ejemplo, «Buscando…»— y señala `role="status"` para anunciar cambios. Para esperas largas propone además explicar la tarea, no intensificar el movimiento. [Fluent 2 — Wait UX](https://fluent2.microsoft.design/wait-ux).
- Atlassian documenta una política general más estricta: con reducción activa apaga el movimiento y exige comprobar que la interfaz siga siendo utilizable sin él. [Atlassian Design — Motion](https://atlassian.design/foundations/motion/).

No se encontró en la documentación pública consultada de Carbon o Fluent una variante visual concreta y documentada del spinner bajo `prefers-reduced-motion`. Sí documentan el canal textual/semántico que sobrevive al movimiento. Por tanto, el anillo estático con etiqueta no se atribuye a esos sistemas: es la síntesis propuesta para SILLAR.

## Código listo para aplicar

### Componente React + TypeScript

La región `status` se monta incluso en `reposo`. No se debe envolver el componente entero en `{estado !== "reposo" && ...}`, porque el rol llegaría al DOM a la vez que el mensaje y se perdería la garantía de anuncio indicada por F103.

```tsx
import { type ReactNode, useId } from "react";

type EstadoCarga = "reposo" | "cargando" | "completado";

type RegionConEsperaProps = {
  children: ReactNode;
  estado: EstadoCarga;
  etiqueta: string;
  mensajeCarga?: string;
};

export function RegionConEspera({
  children,
  estado,
  etiqueta,
  mensajeCarga = "Cargando…",
}: RegionConEsperaProps) {
  const regionId = useId();
  const estadoId = useId();
  const cargando = estado === "cargando";

  const mensaje =
    estado === "cargando"
      ? mensajeCarga
      : estado === "completado"
        ? "Carga completada."
        : "";

  return (
    <div className="region-con-espera">
      <section
        id={regionId}
        aria-label={etiqueta}
        aria-busy={cargando}
        aria-describedby={cargando ? estadoId : undefined}
      >
        {children}
      </section>

      <div
        id={estadoId}
        className="indicador-espera"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {cargando && (
          <span
            className="indicador-espera__anillo"
            aria-hidden="true"
            data-testid="indicador-espera-anillo"
          />
        )}
        <span className={cargando ? undefined : "solo-lector-pantalla"}>
          {mensaje}
        </span>
      </div>
    </div>
  );
}
```

El estado inicial es `reposo`; al disparar la petición pasa inmediatamente a `cargando`, y al resolver pasa a `completado`. No hay temporizador ni espera a `animationend`.

### CSS

Esta solución **no modifica la regla global actual**. Se añade después de ella y sustituye el giro solo en el componente. Los dos tokens de color deben enlazarse a los tokens validados existentes; no hay un color literal en el componente. No se encontraron en este encargo los nombres reales de esos tokens porque, por instrucción, no se inspeccionó el producto.

```css
/* Contrato de integración:
   --color-indicador-espera-pista  -> borde neutro validado
   --color-indicador-espera-activo -> estado informativo/acción validado
*/

@keyframes indicador-espera-girar {
  to {
    transform: rotate(1turn);
  }
}

.indicador-espera {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.indicador-espera:empty {
  display: none;
}

.indicador-espera__anillo {
  inline-size: 1rem;
  block-size: 1rem;
  flex: none;
  border: 0.1875rem solid var(--color-indicador-espera-pista);
  border-block-start-color: var(--color-indicador-espera-activo);
  border-radius: 50%;
  animation: indicador-espera-girar 800ms linear infinite;
}

.solo-lector-pantalla {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  /* Sustitución, no excepción para conservar movimiento. */
  .indicador-espera__anillo {
    animation: none !important;
  }
}
```

El anillo quieto queda como apoyo visual, pero la frase visible `Cargando…` es el indicador inequívoco. La duración de 800 ms solo afecta al modo sin reducción y no forma parte de la escala de transiciones; es el período de un bucle. No se encontró evidencia normativa para un período exacto del giro.

### Prueba Playwright

El nombre de la ruta y los botones son un adaptador deliberadamente visible: deben apuntar al caso real o a la ruta de prueba ya usada por el producto. Las cuatro afirmaciones son el contrato que no debe cambiar.

```ts
import { expect, test } from "@playwright/test";

test("sigue comunicando la espera con movimiento reducido", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/__pruebas__/region-con-espera");

  await page.getByRole("button", { name: "Cargar resultados" }).click();

  const region = page.getByRole("region", { name: "Resultados" });
  const estado = page.getByRole("status");
  const anillo = page.getByTestId("indicador-espera-anillo");

  await expect(region).toHaveAttribute("aria-busy", "true");
  await expect(estado).toHaveText("Cargando resultados…");
  await expect(estado).toBeVisible();
  await expect(anillo).toHaveCSS("animation-name", "none");

  await page.getByRole("button", { name: "Completar carga" }).click();

  await expect(region).toHaveAttribute("aria-busy", "false");
  await expect(estado).toHaveText("Carga completada.");
});
```

Qué afirma exactamente:

- la preferencia está activa de verdad;
- el movimiento se ha eliminado (`animation-name: none`), de modo que la prueba no «arregla» accesibilidad permitiendo girar;
- el estado funcional sigue siendo programáticamente determinable con `aria-busy="true"`;
- una región `status` visible sigue diciendo en español qué espera;
- la finalización se comunica una sola vez mediante un cambio de estado real.

No intenta comprobar que un lector de pantalla pronuncie el texto: Playwright no sustituye una prueba manual con NVDA/JAWS/VoiceOver. Sí fija el árbol y la transición de DOM que esos lectores consumen. Debe conservarse además una prueba manual por combinación navegador/lector compatible.

## Riesgos y huecos señalados

- No se inspeccionaron el `Spinner`, la regla global ni las rutas de prueba reales. El agente de aplicación debe mapear nombres, pero no cambiar las afirmaciones del test.
- `aria-live` tiene diferencias entre navegador y lector de pantalla; la prueba automática no certifica la locución. Es necesaria una pasada manual.
- Para progreso cuantificable debe usarse `<progress>` o `role="progressbar"` con valor. Este informe cubre espera indeterminada.
- Si varias zonas cargan a la vez, cada mensaje debe identificar su tarea; una sucesión de `Cargando…` sin objeto no aporta contexto.
