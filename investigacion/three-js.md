# Three.js 0.185.1

**Veredicto de investigación: Three.js sí aporta una infraestructura 3D que no es razonable reconstruir a mano para un visor de producto interactivo; para un fondo decorativo, incluso la importación selectiva conserva unos 130.6 kB gzip y un bucle GPU continuo, mientras que CSS o una imagen horneada entregan gran parte del aspecto sin JavaScript. Su superficie plausible es la tienda pública, no el panel.**

Fecha de corte: 18 de agosto de 2026. Se inspeccionó el tarball npm `three-0.185.1.tgz` y se empaquetaron casos aislados con esbuild 0.25.9. No se instaló ni compiló nada dentro del producto.

**QUÉ RESUELVE**  Escena 3D, cámaras, geometrías, materiales, luces, texturas, shaders, carga de modelos, controles, picking, animación y gestión de recursos WebGL. Ese conjunto sí excede ampliamente unas pocas decenas de líneas. Para un único rectángulo con un shader de fondo, la mayor parte de esa capacidad queda sin usar.

**DÓNDE VIVIRÍA**  **Tienda pública**, si existe un segundo caso real que requiera interacción 3D —por ejemplo, rotar o inspeccionar un producto—. Un fondo decorativo no justifica trasladarlo al panel ni al mostrador. En esas superficies de trabajo, un canvas continuo compite con tablas, formularios y equipos modestos durante horas.

**¿SE PUEDE HORNEAR?**  **Sí** cuando el efecto no responde al usuario, a datos ni al estado del producto: una imagen generada durante diseño o build conserva el fotograma y elimina el motor, el canvas y el bucle. **No** si la cámara, el objeto o el shader responden a arrastre, orientación, configuración o datos; aun entonces puede renderizarse solo cuando algo cambia en vez de mantener 60 fotogramas por segundo.

**QUÉ PESA**  Para el caso medido de fondo con un plano y `ShaderMaterial`: **518,621 B minificados / 130,590 B gzip**. Un renderer con escena y cámara vacías quedó prácticamente igual: 518,516 B / 130,517 B gzip. El namespace completo con el mismo empaquetador midió 730,368 B / 187,482 B gzip: la selección ahorró aproximadamente 30 %, pero `WebGLRenderer` retiene gran parte del núcleo. El build minificado completo publicado por Three mide 365,552 B / 86,811 B gzip; no se compara directamente con los casos anteriores porque usa otra cadena de minificación. No se incluyen aquí modelos, texturas, loaders, controles, postprocesado ni `@react-three/fiber`.

**QUÉ CUESTA CORRER**  El paquete solo ocupa CPU/GPU cuando la aplicación crea y dibuja la escena. Un fondo animado típico ejecuta un render por `requestAnimationFrame`: mantiene activa la GPU mientras la pestaña está visible, consume memoria para el drawing buffer y vuelve a ejecutar el shader para cada píxel y cada frame. No se encontró una cifra universal y defendible de CPU o batería; depende de resolución, DPR, shader, transparencias, overdraw, texturas, driver y temperatura. En segundo plano, `requestAnimationFrame` se pausa o se reduce fuertemente en los navegadores habituales, pero los recursos siguen asignados y la aplicación debe manejar pérdida de contexto.

**QUÉ ARRASTRA**  Cero dependencias runtime declaradas. Incluye tipos TypeScript. Los addons son importaciones explícitas del mismo paquete; loaders con decodificadores Draco/KTX, modelos, fuentes y texturas añadirían bytes, workers/WASM y mantenimiento no incluidos en la medición. No necesita un build propio: entrega ESM y Vite lo empaqueta. Sí necesita código propio para escena, shaders, resize, limpieza y fallback.

**LICENCIA**  MIT. El tarball publicado contiene `LICENSE` completo de 1,081 B y los builds llevan cabecera SPDX MIT. Esto permite señalar el texto desde el artefacto npm; Vite no lo copia automáticamente al producto comercial, por lo que una publicación de SILLAR tendría que conservarlo en sus avisos de terceros.

**REDUCED-MOTION**  **Inexistente por defecto.** No hay referencias a `prefers-reduced-motion` en el artefacto publicado. Three dibuja por JavaScript, fuera de la protección CSS global. La aplicación tiene que consultar la preferencia antes de importar/inicializar, escuchar `change`, detener inmediatamente `renderer.setAnimationLoop(null)` y mostrar un fondo estático. Ocultar el canvas sin detener el loop no basta.

**SIN ELLA**  Un renderer 3D general y robusto costaría miles de líneas y pruebas; para eso, “a mano” no es razonable. Un fondo de manchas o gradientes cuesta **20–40 líneas de CSS**; un shader de pantalla completa en WebGL crudo empieza en unas 50–100 líneas, pero una implementación de producción crece al añadir compilación de shaders, resize, limpieza, fallback y pérdida/restauración de contexto. Para el fondo decorativo, **sin Three cuesta poco**.

## Qué hace exactamente la importación selectiva

La medición usó estas dos entradas sobre el ESM publicado:

| Entrada | Crudo minificado | Gzip | Diferencia útil |
|---|---:|---:|---|
| Namespace completo | 730,368 B | 187,482 B | Base con el mismo empaquetador |
| `WebGLRenderer`, escena y cámara | 518,516 B | 130,517 B | −30.4 % gzip |
| Lo anterior + plano + `ShaderMaterial` | 518,621 B | 130,590 B | Prácticamente el mismo coste |

El resultado explica por qué `import { WebGLRenderer } from "three"` no equivale a traer un renderer diminuto: el renderer referencia materiales, programas, estados y utilidades internas. Tree-shaking sí elimina módulos desconectados, pero no puede eliminar la infraestructura que `WebGLRenderer` puede necesitar en ejecución.

El tamaño exacto dentro del Vite de SILLAR queda **no medido** porque este encargo excluye el producto. Los valores anteriores son un bundle navegador reproducible y aislado, no una estimación tomada del escaparate npm.

## Coste continuo, expresado sin una falsa precisión

En un fondo a pantalla completa, el suelo de trabajo puede aproximarse como:

`ancho CSS × alto CSS × DPR² × fotogramas por segundo × pasadas`

- 1366 × 768, DPR 1 y 60 fps: unos **62.9 millones de posiciones de píxel por segundo** por pasada.
- 1920 × 1080, DPR 2 y 60 fps: unos **497.7 millones** por pasada.
- 390 × 844, DPR 3 y 60 fps: unos **177.7 millones** por pasada.

No son mediciones de energía ni equivalen exactamente a invocaciones de fragment shader —clipping, overdraw, MSAA y postprocesado cambian el número—, pero muestran dos palancas reales: bajar de DPR 3 a 1 reduce el área interna nueve veces; bajar de 60 a 30 fps reduce a la mitad el trabajo temporal. El manual de Three desaconseja aplicar ciegamente `devicePixelRatio` en trabajo pesado y documenta un límite de píxeles para evitar carga GPU y consumo elevados.

Para un fondo que solo cambia lentamente, las opciones son, de menor a mayor coste:

1. renderizar una sola vez;
2. renderizar solo en resize o interacción;
3. limitar el buffer interno y los fps;
4. mantener un loop continuo.

`powerPreference: "low-power"` es solo una sugerencia al navegador, no una garantía. Tampoco hay degradación automática: Three no reduce DPR, complejidad o fps al detectar un equipo lento.

## Hardware modesto y fallo de WebGL

Three 0.185.1 usa **WebGL 2**; WebGL 1 dejó de estar soportado desde r163. WebGL está presente en navegadores modernos, pero el contexto puede faltar por hardware, driver, política del navegador, lista de bloqueo o límite de contextos. `getContext()` puede devolver `null` y el contexto también puede perderse después.

Para una decoración, el orden seguro es:

1. pintar siempre el fondo CSS o la imagen estática;
2. comprobar movimiento reducido y WebGL 2;
3. crear el canvas encima solo si ambas condiciones permiten hacerlo;
4. ante excepción o `webglcontextlost`, volver al fondo que ya está visible.

`WebGL.isWebGL2Available()` existe como addon oficial. `failIfMajorPerformanceCaveat: true` permite rechazar un contexto cuando el navegador detecta una penalización importante; evita aceptar silenciosamente un renderer por software, pero también amplía el número de usuarios que verán el fallback. En un ordenador integrado de hace ocho años no se puede prometer una tasa concreta sin una prueba física: **no se encontró un benchmark que represente “el ordenador de una tienda”**.

La pérdida de contexto invalida texturas y buffers. Aunque Three ayuda a administrar recursos, el producto debe probar pérdida/restauración o, para una decoración, abandonar el canvas y conservar la imagen estática.

## Movimiento reducido: reemplazo y cambio en caliente

El reemplazo apropiado para un fondo 3D no es congelarlo en un fotograma arbitrario después de cargarlo, sino evitar su inicialización y mostrar desde el principio una composición estática con los mismos tokens.

```ts
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)")
let stopThree: (() => void) | undefined

async function syncBackground() {
  stopThree?.()
  stopThree = undefined

  if (reducedMotion.matches) return // el fondo CSS ya está pintado

  const { startThreeBackground } = await import("./three-background")
  if (!reducedMotion.matches) stopThree = startThreeBackground()
}

reducedMotion.addEventListener("change", syncBackground)
syncBackground()
```

`startThreeBackground()` debe devolver una limpieza que pare el loop, retire listeners, libere geometrías/materiales/texturas y llame `renderer.dispose()`. Si la preferencia cambia mientras termina el `import()`, la segunda comprobación evita iniciar movimiento tarde. Esta integración no debe convertirse en hook hasta que exista un segundo uso real.

## Canvas decorativo, semántica y selección

El canvas debe ser hermano del contenido, no contener ni envolver texto o controles:

```tsx
<section className="public-hero">
  <canvas className="public-hero__canvas" role="presentation" />
  <div className="public-hero__content">{/* contenido semántico */}</div>
</section>
```

```css
.public-hero__canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
}

.public-hero__content {
  position: relative;
}
```

`role="presentation"` es adecuado solo si el canvas no comunica información. No debe tener `tabIndex`, listeners ni descendientes enfocables. Si el 3D es un visor de producto funcional, deja de ser decorativo: necesita nombre, instrucciones, alternativa operable por teclado y una representación textual/estática equivalente.

`pointer-events: none` permite seleccionar texto y activar controles que estén debajo. La información nunca debe existir únicamente dentro del canvas porque sus píxeles no aportan semántica HTML.

## Contraste que no cambia con el shader

Medir un fotograma bonito no garantiza el siguiente. Hay tres formas defendibles:

- colocar el texto sobre una superficie **opaca** cuyo fondo y texto ya son tokens validados;
- limitar matemáticamente los colores y luminancias posibles del shader y validar los extremos, no solo capturas;
- reservar el canvas a zonas sin texto.

Una capa semitransparente no garantiza contraste sobre valores arbitrarios: su resultado depende del píxel inferior. La opción más estable en un catálogo es una superficie opaca.

```css
.public-hero__copy {
  color: var(--color-text-primary);
  background: var(--color-surface-raised);
}
```

Los colores enviados como uniforms al shader también tienen que derivarse de las variables CSS. No se conoce la representación concreta de los tokens de SILLAR; por tanto, la conversión segura a RGB lineal queda **no encontrada**. Si los tokens no exponen canales numéricos compatibles, habría que generarlos durante build desde la misma paleta validada, no duplicarlos a mano en GLSL.

## Alternativas y su coste

### 1. Gradiente compuesto con CSS

```css
.public-hero {
  background:
    radial-gradient(circle at 18% 24%, var(--color-accent-soft), transparent 42%),
    radial-gradient(circle at 78% 32%, var(--color-brand-soft), transparent 38%),
    radial-gradient(circle at 52% 84%, var(--color-info-soft), transparent 44%),
    var(--color-surface-default);
}
```

Coste: alrededor de **0.4 kB de CSS legible**, 0 B de JavaScript, 0 dependencias y ningún loop. Si se mueve un pseudo-elemento con `transform`, la hoja base puede detenerlo bajo reduced motion; una capa grande sigue ocupando memoria de composición. Entrega el “campo de color” y profundidad aparente, no objetos 3D, iluminación ni perspectiva real.

### 2. Imagen horneada

Coste runtime: 0 B de JavaScript y ningún trabajo por fotograma; queda la descarga y decodificación de la imagen. El peso **no se puede dar sin dimensiones, calidad y arte concretos**. Debe medirse el AVIF/WebP producido, no asignarle un rango inventado. Para respetar la regla de color, cada variante se genera desde los tokens validados durante diseño/build; un cambio de tema puede requerir otro asset.

### 3. OGL 1.0.11

OGL es una capa WebGL pequeña orientada a shaders propios. El mismo fondo aislado con `Renderer`, `Program`, `Mesh` y `Triangle` midió **44,505 B / 12,851 B gzip**: cerca del 9.8 % del gzip del caso Three medido. Declara cero dependencias y Unlicense; el tarball incluye el texto completo dentro de `README.md`, aunque no en un archivo `LICENSE` separado.

El ahorro compra menos infraestructura: la aplicación asume shaders, capacidades y más bordes de WebGL. Reduced motion sigue siendo inexistente y el coste GPU por píxel es el mismo shader; bajar bytes no baja automáticamente batería. La última versión npm consultada llevaba dos años publicada y la restauración de contexto continúa como responsabilidad de integración. Es alternativa para un shader concreto, no sustituto de un visor 3D completo.

### 4. WebGL crudo

Peso de biblioteca: 0 B. El triángulo y shader iniciales caben en pocas decenas de líneas; la versión robusta no. Hay que crear contexto, compilar/enlazar shaders, uniformes, buffer, resize, DPR, loop, error, pérdida de contexto y limpieza. Reduce bytes a cambio del mayor coste de mantenimiento.

## ¿Se puede escribir a mano en unas pocas decenas de líneas?

- **Un fondo abstracto parecido:** sí, con CSS; 20–40 líneas.
- **Un único shader de pantalla:** el prototipo sí; la integración robusta normalmente supera las pocas decenas.
- **Un visor 3D con carga, cámara, materiales, controles y recursos:** no razonablemente. Ahí está el valor real de Three.

La distinción importante no es “3D bonito o no”, sino **si existe interacción 3D funcional**. Si el efecto solo se mira, puede hornearse. Si el usuario necesita manipularlo, Three empieza a resolver un problema que las alternativas de unas líneas no cubren.

## No encontrado

- Porcentaje universal de CPU, GPU o batería para un fondo Three: depende de escena y hardware; no existe una cifra transferible.
- FPS representativos en un portátil integrado de ocho años: hace falta definir y medir el equipo objetivo.
- Peso de una imagen horneada: falta el asset, dimensiones y calidad.
- Conversión exacta de los tokens CSS de SILLAR a uniforms: no se leyó el sistema de diseño ni el producto.
- Tamaño final en el chunk Vite de SILLAR: deliberadamente no se compiló el producto.

## Fuentes

- [Registro npm de Three 0.185.1](https://registry.npmjs.org/three/latest)
- [Licencia MIT oficial](https://github.com/mrdoob/three.js/blob/dev/LICENSE)
- [WebGLRenderer: WebGL 2, opciones y loop](https://threejs.org/docs/pages/WebGLRenderer.html)
- [Comprobación oficial de compatibilidad WebGL 2](https://threejs.org/manual/en/webgl-compatibility-check.html)
- [Manual de Three sobre resolución, DPR y consumo](https://threejs.org/manual/en/responsive.html)
- [Buenas prácticas WebGL: buffer, VRAM y rendimiento](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [`requestAnimationFrame` y pestañas en segundo plano](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance)
- [`getContext()`, bajo rendimiento y preferencia de energía](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)
- [Pérdida y restauración del contexto WebGL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextrestored_event)
- [Canvas accesible y rol presentacional](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage)
- [WCAG 2.2: contraste](https://www.w3.org/TR/WCAG22/)
- [WCAG 2.2: pausar, detener u ocultar movimiento continuo](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide)
- [OGL: repositorio, alcance, peso declarado y licencia](https://github.com/oframe/ogl)
