# GSAP 3.15.0

**Veredicto de investigación: GSAP aporta timelines, control reversible y plugins que sí ahorran trabajo en animación compleja, pero no protege `prefers-reduced-motion` por defecto y el tarball 3.15.0 no contiene el texto completo de su licencia —solo una URL—. Para transiciones de interfaz ya cubiertas por CSS, View Transitions y Web Animations, hace lo mismo de forma más cómoda por unos 27.7 kB gzip.**

Fecha de corte: 18 de agosto de 2026. Se leyó la licencia oficial vigente y se inspeccionó el tarball npm `gsap-3.15.0.tgz`. Los bundles se aislaron con esbuild 0.25.9; no se instaló GSAP en SILLAR.

**QUÉ RESUELVE**  Interpolación de propiedades, easings, timelines anidados, solapes relativos, etiquetas, pausa, seek, inversión y cambio de velocidad como una sola unidad. Los plugins añaden scroll sincronizado, FLIP, arrastre, trayectorias, morph SVG y división de texto. La orquestación compleja y reversible sí es difícil de mantener a mano; una aparición, un diálogo o una transición de estado no lo son.

**DÓNDE VIVIRÍA**  **Tienda pública**, solo si aparece una secuencia de marca o interacción compleja que las capacidades nativas vuelvan frágil. Para el panel y el mostrador no se ha aportado un caso que requiera timeline, scrubbing o morphing; allí su superficie plausible actual es **ninguna**.

**¿SE PUEDE HORNEAR?**  **Sí** si solo importa un aspecto estático final. Una secuencia no interactiva también puede prerenderizarse como vídeo, pero eso sustituye JavaScript por descarga, decodificación y la obligación de ofrecer un poster estático bajo reduced motion. **No** cuando el tiempo responde al scroll, arrastre, datos o controles de reproducción; esa interactividad es parte del valor de GSAP.

**QUÉ PESA**  Import típico `gsap` con CSSPlugin y una transición DOM: **70,660 B minificados / 27,689 B gzip**. Core sin CSSPlugin, útil para interpolar objetos: 51,554 B / 20,148 B gzip. `gsap` + ScrollTrigger: 115,095 B / 45,191 B gzip. El `dist/gsap.min.js` publicado mide 72,927 B / 28,344 B gzip. Los plugins adicionales suman código según importación; no se midieron todos porque no hay un caso solicitado que los use.

**QUÉ CUESTA CORRER**  GSAP actualiza su timeline mediante `requestAnimationFrame`. Cuando anima `transform` u `opacity`, el navegador puede componer eficientemente; animar layout, filtros, SVG grande o muchas propiedades sigue provocando cálculo, pintura o GPU costosos que GSAP no elimina. Un timeline finito deja de necesitar frames al terminar; un fondo o loop infinito mantiene trabajo continuo. El navegador reduce `requestAnimationFrame` en pestañas ocultas. No hay degradación automática por hardware modesto.

**QUÉ ARRASTRA**  Cero dependencias runtime declaradas. GSAP es independiente de React; `@gsap/react` es opcional y no hace falta para usar refs y limpiar con `gsap.context()`. Los plugins se importan y registran por separado. No requiere build propio: entrega ESM, UMD, tipos y archivos minificados. Vite lo empaqueta normalmente.

**LICENCIA**  Licencia propia **Standard “No Charge” GSAP License**, vigente desde el 30 de abril de 2025 y modificada el 30 de mayo de 2025; no es MIT. Permite uso comercial sin pago en sitios, aplicaciones e interfaces, pero prohíbe usar GSAP para construir herramientas visuales sin código que compitan materialmente con las capacidades de animación visual de Webflow, además de conservar avisos. Por la descripción recibida, SILLAR no parece ser un constructor visual de animaciones; eso es una inferencia técnica, no una opinión legal.

El punto material para este proyecto: **el tarball npm 3.15.0 no contiene `LICENSE`, `COPYING` ni el texto completo**. `package.json` declara una URL y los fuentes repiten una cabecera con esa URL. Por tanto, el texto no viaja dentro del artefacto publicado. Copiarlo manualmente a avisos de terceros podría hacer que el artefacto final de SILLAR lo contenga, pero añade una obligación de captura y seguimiento de cambios; el paquete por sí solo no cumple el criterio indicado.

**REDUCED-MOTION**  **Opcional, no predeterminado.** `gsap.matchMedia()` acepta la consulta, revierte las animaciones del contexto y vuelve a ejecutar el handler cuando la preferencia cambia en caliente. Es un mecanismo bueno, pero hay que usarlo en cada integración. La hoja CSS global no controla los valores que GSAP escribe por JavaScript. Pausar la timeline global tampoco es una salida segura: puede dejar componentes a mitad de transición y bloquear callbacks.

**SIN ELLA**  Una transición o secuencia corta cuesta 10–30 líneas con CSS o Web Animations API. Una timeline con solapes, etiquetas, reversión, scrubbing y plugins puede crecer a cientos de líneas y pruebas; ahí GSAP aporta algo difícil de replicar. Para los casos nativos ya investigados —View Transitions, `@starting-style` y `display` discreto—, **sin ella cuesta poco**.

## Licencia: lectura del texto vigente

La licencia oficial define tres categorías relevantes:

- usos permitidos: implementar GSAP en cualquier sitio, aplicación web o interfaz digital;
- producto competitivo: herramienta que permite crear, editar o gestionar animaciones mediante una interfaz visual similar a Webflow;
- uso prohibido: emplear GSAP en una herramienta visual sin código que ayude materialmente a competir con esa capacidad de Webflow.

Incluye uso comercial sin pago y todos los plugins, incluso los que antes eran exclusivos de Club GSAP. También permite que Webflow modifique la licencia para versiones futuras; quien no acepte un cambio puede continuar con una versión anterior bajo sus términos anteriores, sin sus actualizaciones posteriores.

Para un producto comercial conviene fijar versión y guardar junto al expediente la licencia aplicable a esa versión. Aun haciéndolo, el hallazgo del tarball no cambia: **3.15.0 publica un enlace, no el texto**.

## Medición reproducible

| Import medido | Crudo minificado | Gzip | Qué contiene |
|---|---:|---:|---|
| `gsap/gsap-core` | 51,554 B | 20,148 B | Timeline/tween sobre objetos; sin CSSPlugin |
| `gsap` | 70,660 B | 27,689 B | Import habitual para DOM y CSS |
| `gsap` + ScrollTrigger | 115,095 B | 45,191 B | Core DOM más scroll sincronizado |
| `dist/gsap.min.js` publicado | 72,927 B | 28,344 B | Referencia precompilada del paquete |

El tamaño exacto del chunk Vite de SILLAR queda **no medido** porque no se accedió al producto. Tree-shaking no reduce mucho el import DOM normal: `index.js` registra CSSPlugin. El core puro ahorra unos 7.5 kB gzip, pero no anima estilos por sí solo.

## Qué aporta frente a lo nativo

| Necesidad | Plataforma ya disponible | Valor adicional de GSAP |
|---|---|---|
| Entrar/salir de diálogo o popover | `@starting-style`, `transition-behavior`, CSS | Lo mismo, con API imperativa y más bytes |
| Cambiar entre estados/vistas | View Transitions, con fallback instantáneo | Control temporal más fino fuera del modelo de snapshots |
| Animar un elemento | CSS o `element.animate()` | Sintaxis coherente, easings y utilidades |
| Secuenciar varios pasos | Promesas/eventos de WAAPI | Timeline relativa; mover un paso reajusta los siguientes |
| Pausar, seek, invertir y anidar todo | Objetos `Animation`, código de coordinación | API unificada y madura |
| Scroll scrub, morph, FLIP, paths | APIs nativas + bastante integración | Plugins especializados |

Si la respuesta es “lo mismo pero más cómodo”, el coste real es 27.7 kB gzip, la política de movimiento por uso y la licencia propia. El diferencial aparece cuando hay **varios tiempos interdependientes y controlables**, no por usar `gsap.to()` en vez de una transición CSS.

## Reduced motion y cambio en caliente

GSAP documenta este patrón:

```ts
const mm = gsap.matchMedia()

mm.add(
  {
    animate: "(prefers-reduced-motion: no-preference)",
    reduce: "(prefers-reduced-motion: reduce)",
  },
  ({ conditions }) => {
    if (conditions?.reduce) {
      gsap.set(target, { clearProps: "transform,opacity" })
      return
    }

    return gsap.from(target, {
      opacity: 0,
      yPercent: 8,
      duration: 0.2,
    })
  },
)
```

Al cambiar la media query, el contexto revierte lo creado y vuelve a ejecutar el handler. Eso cubre el cambio en caliente mejor que una consulta única. Sigue teniendo dos límites para SILLAR:

1. alguien puede crear una animación fuera de `matchMedia()`;
2. `duration: 0` en cada uso es una corrección manual, no un default seguro.

El ejemplo usa movimiento solo para acompañar un estado ya aplicado. Una acción funcional no debe vivir en `onComplete`; si reduced motion salta la interpolación, el resultado tiene que existir igualmente.

No conviene construir ahora un wrapper global de GSAP: sería una abstracción con un solo uso hipotético. Si aparecieran dos casos reales, entonces sí podría evaluarse una frontera común y una prueba/lint que impida instancias fuera de la política.

## Coste de ejecución y hardware modesto

El ticker de GSAP se sincroniza con `requestAnimationFrame`; la documentación permite limitarlo a 30 fps y explica que el navegador lo reduce en pestañas ocultas. Limitar fps no arregla propiedades caras ni demasiados elementos. En un equipo modesto importan más los objetivos y propiedades que el coste del scheduler:

- `transform` y `opacity` sobre pocas capas: normalmente el camino menos costoso;
- `width`, `height`, posiciones de layout: pueden recalcular layout;
- `filter: blur()`, sombras grandes y SVG filtrado: trabajo de raster/GPU por frame;
- ScrollTrigger sobre contenido complejo: añade medición y listeners además de la animación;
- loops infinitos: impiden que el trabajo termine mientras la vista está visible.

No se encontró una cifra universal de CPU o batería para GSAP. Una biblioteca que interpola rápido no puede hacer barata una propiedad que el navegador debe repintar.

## ¿Se puede escribir a mano en unas pocas decenas de líneas?

Sí para la mayoría de transiciones de interfaz. Una entrada secuencial sencilla con WAAPI cabe en unas veinte líneas y reacciona en caliente sin dependencia:

```ts
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)")

async function enter(items: HTMLElement[]) {
  if (reducedMotion.matches) return

  for (const item of items) {
    const animation = item.animate(
      [
        { opacity: 0, transform: "translateY(0.5rem)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 160, easing: "ease-out" },
    )
    await animation.finished
  }
}
```

Este ejemplo no retrasa la acción: los elementos ya existen y son utilizables; solo acompaña su entrada. Si una secuencia necesita solapes, etiquetas, reverse, seek, cancelación coordinada y plugins, el código manual deja rápidamente de ser “unas pocas decenas”. Ese es el umbral que GSAP tendría que cruzar para aportar algo propio.

## Alternativas y coste

| Alternativa | Peso | Rendimiento | Mantenimiento |
|---|---:|---|---|
| CSS + `@starting-style`/transición discreta | 0 B runtime; decenas de líneas | El navegador gestiona la interpolación; fallback instantáneo | Bajo y cerca del componente |
| View Transitions | 0 B de dependencia | Snapshot y composición nativa; sin soporte, cambia sin animar | Bajo para cambios de estado conocidos |
| Web Animations API | 0 B de dependencia | Mismo motor de animación del navegador; JS para orquestación | Bajo para uno o dos pasos, sube con timelines complejas |
| GSAP core DOM | 27.7 kB gzip medidos | Scheduler maduro; el coste de pintar sigue siendo del navegador | API y licencia propias; política reduced motion por integración |
| GSAP + ScrollTrigger | 45.2 kB gzip medidos | Añade sincronización con scroll y mediciones | Más casos límite en móvil, resize y contenido dinámico |

## No encontrado

- Texto completo de licencia dentro del tarball npm 3.15.0: no existe; solo URL y cabeceras.
- Reduced motion activado globalmente por defecto: no existe.
- Consumo universal de CPU/batería: depende de objetivos y propiedades.
- Tamaño final dentro del Vite de SILLAR: no se compiló el producto.
- Un caso actual del panel que necesite timelines, scrubbing, morphing o FLIP: no fue aportado.

## Fuentes

- [GSAP 3.15.0 en npm](https://www.npmjs.com/package/gsap?activeTab=versions)
- [Repositorio oficial y alcance de GSAP](https://github.com/greensock/GSAP)
- [Texto oficial de la Standard “No Charge” License](https://gsap.com/community/standard-license/)
- [`gsap.matchMedia()` y cambio en caliente](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/)
- [Timeline: secuenciación, etiquetas y control](https://gsap.com/docs/v3/GSAP/Timeline/)
- [Ticker, `requestAnimationFrame`, pestañas ocultas y fps](https://gsap.com/docs/v3/GSAP/gsap.ticker/)
- [Web Animations API: pausa, reverse y finalización](https://developer.mozilla.org/en-US/docs/Web/API/Animation)
- [`@starting-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40starting-style)
- [Transiciones de propiedades discretas](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition-behavior)
- [Rendimiento de animaciones CSS y JavaScript](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance)
