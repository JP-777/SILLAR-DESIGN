# Token de velo de diálogo

**Veredicto: un único token semántico al 45 % puede servir en ambos temas; no hay evidencia para introducir dos valores, siempre que la superficie del diálogo oscuro use su token de elevación y no dependa solo del velo para separarse.**

Fecha de consulta: 18 de agosto de 2026.

## Resultado propuesto

| Tema | Base | Opacidad | Token consumido |
|---|---|---:|---|
| Claro | neutro más oscuro validado | 45 % | `--color-velo-dialogo` |
| Oscuro | el mismo neutro más oscuro validado | 45 % | `--color-velo-dialogo` |

Nombre: `--color-velo-dialogo`.

Se conserva el 45 % del valor existente y se elimina el color literal. No se encontró evidencia normativa que fije una opacidad «correcta» para un velo, ni una investigación de usabilidad que demuestre que 45 % es universal. Cambiarlo sin observar las superficies reales sería más arbitrario que tokenizar el comportamiento ya conocido.

## Por qué un valor puede servir en ambos temas

El velo tiene dos trabajos: indicar que la interfaz posterior está bloqueada y reducir su protagonismo. No tiene que fabricar por sí solo toda la separación visual del diálogo.

- Carbon define un único token `$overlay`, negro al 60 %, repetido en sus temas. [Carbon — Color tokens](https://carbondesignsystem.com/elements/color/tokens/).
- Fluent llama *smoke* al material que oscurece la interfaz tras un modal y especifica que no depende del modo: siempre es negro translúcido. [Fluent 2 — Material, Smoke](https://fluent2.microsoft.design/material#smoke).

Esto contradice la sospecha de que el tema oscuro necesita automáticamente un velo distinto. En un tema oscuro, un velo negro cambia menos el fondo; la separación principal debe venir de una superficie de diálogo más elevada —normalmente algo más clara que el fondo—, su borde y, si corresponde, su sombra. Volver claro el velo oscurecido puede invertir relaciones de luminancia y competir con el contenido.

Si el diálogo oscuro usa exactamente la misma superficie que el fondo y no tiene borde ni elevación perceptible, el defecto está en la superficie del diálogo. Aumentar o invertir el velo puede ocultarlo en unas pantallas y empeorarlo en otras.

## Cuánto atenúa el 45 %

Al componer una base oscura con alfa 0,45, cada canal del fondo aporta el 55 % restante a la mezcla —la composición exacta se realiza en el espacio de color que implemente el navegador—. En tema claro el descenso es evidente; en tema oscuro es más sutil, pero el contenido posterior sigue reconocible y la superficie elevada conserva la jerarquía.

Carbon usa 60 %, lo que demuestra que sistemas maduros aceptan una atenuación mayor, pero no demuestra que SILLAR deba copiarla. Para una herramienta usada durante horas, conservar 45 % evita oscurecer innecesariamente toda la escena y mantiene contexto suficiente para reconocer de dónde surgió el diálogo.

WCAG no impone una relación de contraste entre el velo y el contenido bloqueado. Los componentes inactivos están exceptuados del requisito de contraste no textual; el texto y los controles **del diálogo** sí deben conservar sus contrastes normales contra la superficie del diálogo. Fuente: [WCAG 2.2 — Non-text Contrast](https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html).

Esto no significa que el fondo pueda volverse irreconocible por sistema; significa que «45 %» no puede justificarse con una supuesta razón WCAG. Es una decisión de jerarquía visual que debe comprobarse con capturas de las pantallas extremas de ambos temas.

## Código listo para aplicar

El nombre `--color-neutro-mas-oscuro` representa el **token físico ya validado** de la paleta, no un color nuevo. El agente que aplica debe sustituir ese identificador por su nombre real. No se encontró el nombre exacto porque este encargo prohíbe inspeccionar el producto.

```css
:root {
  --opacidad-velo-dialogo: 45%;
  --color-velo-dialogo: color-mix(
    in srgb,
    var(--color-neutro-mas-oscuro) var(--opacidad-velo-dialogo),
    transparent
  );
}

/* Se declaran ambos temas para dejar explícito que el valor no cambia. */
[data-tema="claro"],
[data-tema="oscuro"] {
  --opacidad-velo-dialogo: 45%;
}

.dialogo::backdrop {
  background: var(--color-velo-dialogo);
}

/* Para un velo que no sea ::backdrop. */
.velo-dialogo {
  position: fixed;
  inset: 0;
  background: var(--color-velo-dialogo);
}
```

`transparent` no introduce un color visible ajeno a la paleta: aporta alfa cero. El color efectivo procede del token validado. `color-mix()` evita reescribir componentes RGB a mano.

Si la matriz de navegadores objetivo no admite `color-mix()`, el sistema de tokens debe publicar `--color-velo-dialogo` como un color con alfa ya calculado en cada tema. No debe añadirse un `rgba(...)` literal como *fallback*, porque perpetuaría exactamente la excepción que se quiere eliminar.

## Comprobación antes de aplicar

El 45 % se debe mirar al menos sobre cuatro casos representativos:

1. tema claro con la superficie más clara y con la más cromática permitida;
2. tema oscuro con la superficie más oscura y con la superficie elevada más cercana al diálogo;
3. texto y controles densos detrás, para confirmar que se reconocen como contexto pero no compiten;
4. el diálogo pequeño y el más grande, verificando borde, superficie, foco visible y sombra.

Criterios de aceptación:

- se entiende sin color adicional que el fondo no está disponible;
- el diálogo se distingue del área velada en ambos temas;
- el fondo todavía permite reconocer la pantalla de origen;
- ningún texto o control activo del diálogo pierde contraste;
- el velo es `inert` por comportamiento del diálogo nativo o por la implementación correspondiente; el color no sustituye bloqueo de interacción ni gestión del foco.

Si falla solo el tema oscuro, primero se corrige o valida el token de superficie elevada/borde. Solo si capturas comparables demuestran que eso no basta se crea una variante temática del **mismo token semántico**; no se crean dos nombres.

## Riesgos y huecos señalados

- No se inspeccionó la paleta, por lo que falta mapear `--color-neutro-mas-oscuro` al identificador real validado.
- No se encontró un umbral normativo de opacidad ni un estudio que establezca 45 %. Carbon y Fluent respaldan la arquitectura de un velo oscuro común, no ese número concreto.
- No se ejecutó una prueba visual sobre las pantallas reales. Sin esas capturas no se puede afirmar que la superficie elevada oscura ya tenga separación suficiente.
- `color-mix()` debe contrastarse con la matriz de navegadores que soporte SILLAR. Si no está en ella, el color con alfa debe salir del generador o de los archivos de tokens, no de un literal local.

