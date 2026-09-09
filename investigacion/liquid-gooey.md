# Liquid Gooey — técnica de filtro SVG

**Veredicto de investigación: no se encontró una biblioteca única identificable como “Liquid Gooey”; el efecto habitual es una técnica nativa de unas 25–40 líneas —desenfoque SVG más umbral de alfa—, sin dependencia ni build. En superficies grandes o animadas el filtro se recalcula por fotograma y puede ser caro; debe aislarse del texto. Su único encaje plausible es un detalle pequeño de la tienda pública y, si no reacciona, conviene hornearlo.**

Fecha de corte: 18 de agosto de 2026. Sin URL, repositorio o nombre npm aportado, el informe audita la técnica que las fuentes y ejemplos denominan “gooey/liquid”, no un paquete comercial concreto.

**QUÉ RESUELVE**  Hace que dos o más formas cercanas parezcan fusionarse como líquido. Se desenfoca la imagen para mezclar sus alfas y luego una matriz de color aumenta el contraste del canal alfa hasta recuperar bordes sólidos y conservar el puente entre formas. No gestiona física, layout, gestos ni animación: el movimiento lo aporta CSS o JavaScript aparte.

**DÓNDE VIVIRÍA**  **Tienda pública**, como acento decorativo pequeño y separado del contenido. En el panel o mostrador, formas que se fusionan continuamente no comunican mejor un estado y añaden pintura y distracción durante una jornada larga. Si se aplica a controles o texto, su superficie adecuada es **ninguna**.

**¿SE PUEDE HORNEAR?**  **Sí** si la composición no responde a puntero, estado o datos. SVG estático, WebP/AVIF o incluso formas CSS normales preservan el aspecto sin filtrar cada frame. **No** si la fusión depende de que el usuario acerque elementos o de posiciones dinámicas; ahí el filtro necesita ejecutarse mientras cambian los píxeles.

**QUÉ PESA**  Técnica nativa: 0 B de dependencia y aproximadamente **0.8–1.2 kB de HTML/CSS legible** para una implementación local. El peso exacto depende del marcado y keyframes. No se encontró un tarball de “Liquid Gooey” que medir. Las primitivas SVG ya viven en el navegador.

**QUÉ CUESTA CORRER**  `feGaussianBlur` es una convolución: cada píxel de salida consulta píxeles vecinos. El coste crece con el área filtrada, el radio y los frames; después `feColorMatrix` procesa de nuevo el buffer. El estándar describe que el elemento y sus descendientes se dibujan primero en un buffer intermedio y luego se filtran como grupo. En superficies grandes y con hijos móviles, ese buffer cambia y el navegador puede volver a aplicar el filtro cada fotograma. No se encontró una cifra universal de CPU o batería.

**QUÉ ARRASTRA**  Ninguna dependencia. Requiere soporte nativo para filtros SVG, ampliamente disponible, y CSS/JS solo si se anima. No necesita build propio. Un navegador que ignore `filter: url(...)` muestra las formas separadas; si son decorativas, esa es una degradación válida.

**LICENCIA**  No aplica una licencia de biblioteca: `filter`, `feGaussianBlur`, `feColorMatrix` y `feBlend` son capacidades de la plataforma web. El ejemplo mínimo de este informe puede mantenerse como código propio del proyecto. Si JP se refería a un componente o paquete con el nombre “Liquid Gooey”, su licencia queda **no encontrada** hasta disponer de su URL exacta.

**REDUCED-MOTION**  El filtro estático no implica movimiento. La técnica no incluye una política automática para la animación que se añada. Si el movimiento es CSS, la protección global lo alcanza y un bloque `no-preference` evita iniciarlo; la media query responde en caliente. Si las posiciones cambian con `requestAnimationFrame` o una biblioteca JS, queda fuera de esa red y hay que escuchar `matchMedia` y detener el loop.

**SIN ELLA**  Es la propia respuesta: **sí, cabe en unas pocas decenas de líneas**. No hay una capacidad externa que justifique una dependencia para el efecto básico. La parte delicada no es escribir la matriz, sino limitar el área, aislar texto, probar navegadores y evitar un loop innecesario.

## Código mínimo

```html
<svg aria-hidden="true" focusable="false" width="0" height="0">
  <defs>
    <filter id="sillar-goo" x="-15%" y="-15%" width="130%" height="130%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
      <feColorMatrix
        in="blur"
        type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 18 -7"
        result="goo"
      />
      <feBlend in="SourceGraphic" in2="goo" />
    </filter>
  </defs>
</svg>

<div class="goo" aria-hidden="true">
  <span class="goo__blob goo__blob--a"></span>
  <span class="goo__blob goo__blob--b"></span>
</div>
```

```css
.goo {
  position: absolute;
  inset: 0;
  filter: url("#sillar-goo");
  pointer-events: none;
}

.goo__blob {
  position: absolute;
  inline-size: 5rem;
  block-size: 5rem;
  border-radius: 50%;
  background: var(--color-brand-soft);
}

.goo__blob--b {
  background: var(--color-accent-soft);
}

@media (prefers-reduced-motion: no-preference) {
  .goo__blob--b {
    animation: goo-drift var(--motion-duration-decorative) ease-in-out infinite alternate;
  }
}

@keyframes goo-drift {
  to { transform: translateX(4rem); }
}
```

Los números de `feColorMatrix` son coeficientes matemáticos para los canales, no colores. Los únicos colores visuales salen de variables CSS. Si SILLAR no tiene el token de duración usado en el ejemplo, debe emplearse el token real del sistema; no se propone crear uno por este caso hipotético.

El `x/y/width/height` ampliado evita cortar el halo, pero aumenta el área del buffer. Debe ajustarse al mínimo que no recorte el efecto. Un filtro de viewport completo es el peor caso; un contenedor pequeño limita el trabajo.

## Coste de render

Hay tres observaciones respaldadas por documentación de plataforma:

1. el contenido completo del elemento, incluidos descendientes, se rasteriza como grupo antes del filtro;
2. el blur necesita consultar múltiples píxeles por cada salida y se encarece con imagen y radio mayores;
3. si el contenido filtrado se mueve, el navegador no puede tratarlo simplemente como un bitmap estático reutilizable.

Chrome documentó un caso concreto de blur animado en el que el trabajo GPU llevó los frames a alrededor de 90 ms. No es una predicción para SILLAR: demuestra que promover una capa o usar `will-change` no garantiza que el blur deje de ejecutarse. MDN recomienda usar desenfoque con moderación, especialmente sobre elementos desplazados o animados.

El coste aproximado depende de:

- área del grupo filtrado y DPR;
- `stdDeviation` y extensión del filtro;
- cantidad y tamaño de formas;
- si cambia el contenido cada frame;
- implementación y GPU del navegador.

Para hardware modesto, el fallback no debe activarse después de detectar jank: debe existir ya. Una imagen estática o formas sin `filter` mantienen contenido y acciones intactos.

## Qué le hace al texto

Aplicar `filter` al contenedor de una tarjeta o hero arrastra **fondo, bordes, texto, decoraciones y todos sus descendientes** al mismo buffer. El blur y el umbral alteran los bordes de los glifos y su antialiasing. No se soluciona poniendo el texto encima dentro del mismo nodo filtrado: sigue siendo descendiente del grupo.

La separación correcta es estructural:

```tsx
<section className="public-promo">
  <div className="public-promo__goo" aria-hidden="true">{/* blobs */}</div>
  <div className="public-promo__content">{/* títulos, enlaces y botones */}</div>
</section>
```

```css
.public-promo__goo {
  position: absolute;
  inset: 0;
  filter: url("#sillar-goo");
  pointer-events: none;
}

.public-promo__content {
  position: relative;
  color: var(--color-text-primary);
  background: var(--color-surface-raised);
}
```

El texto y los controles son hermanos, no hijos del nodo filtrado. `aria-hidden="true"` excluye la decoración del árbol de accesibilidad y `pointer-events: none` deja pasar selección y clics. La superficie opaca validada también estabiliza el contraste frente a las formas móviles.

## Alternativas y coste

| Alternativa | Peso | Ejecución | Mantenimiento |
|---|---:|---|---|
| Filtro SVG local | ~0.8–1.2 kB legible | Blur + matriz por cada actualización del buffer | Bajo si el área es pequeña; pruebas de clipping y GPU |
| Dos formas CSS sin fusión | <0.5 kB | Sin filtro; solo composición normal | Mínimo; pierde el puente líquido |
| SVG estático horneado | Depende del path; normalmente texto vectorial pequeño | Sin filtro por frame si el path ya está resuelto | Regenerar si cambian tokens o geometría |
| AVIF/WebP horneado | No medible sin asset | Descarga/decodificación; 0 trabajo por frame después | Variantes por tema y densidad |
| Canvas/WebGL | Decenas de kB si usa motor, o mucho código propio | Loop y GPU si se anima | Desproporcionado para dos blobs |

El 80 % visual —formas orgánicas superpuestas y color— se logra con CSS o un SVG estático. La característica que se pierde es la fusión dinámica al acercarse. Si nadie interactúa con esa fusión, hornearla conserva precisamente lo que se ve.

## ¿Se puede escribir a mano en unas pocas decenas de líneas?

**Sí.** El filtro esencial son tres primitivas SVG y dos formas. No justifica una dependencia. Las únicas razones para evaluar un paquete específico serían que añadiera una simulación de fluidos, interacción accesible, authoring o degradación probada que el nombre genérico no permite atribuirle.

## No encontrado

- Un paquete, repositorio o producto único llamado “Liquid Gooey” a partir del nombre recibido.
- Licencia, versión, dependencias o tarball de ese posible artefacto concreto.
- Consumo universal de CPU/batería: depende del área, blur, DPR y hardware.
- Peso de un asset horneado: falta el arte y sus dimensiones.
- Compatibilidad exacta con los navegadores mínimos de SILLAR: no se proporcionó esa matriz; las primitivas individuales están ampliamente disponibles.

Si se facilita la URL exacta, este informe puede añadir una auditoría del artefacto sin cambiar el análisis de la técnica nativa.

## Fuentes

- [Especificación Filter Effects: buffer, descendientes y región](https://www.w3.org/TR/filter-effects-1/)
- [`feGaussianBlur`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feGaussianBlur)
- [`feColorMatrix` y soporte](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feColorMatrix)
- [Aplicar filtros SVG a HTML y coste del blur](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Applying_SVG_effects_to_HTML_content)
- [Chrome: coste de animar blur](https://developer.chrome.com/blog/animated-blur)
- [Rendimiento de animaciones, incluido SVG/canvas/WebGL](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate)
- [`aria-hidden` para contenido decorativo](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden)
- [`pointer-events: none`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/pointer-events)
