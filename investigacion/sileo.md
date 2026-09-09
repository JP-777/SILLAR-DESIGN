# Sileo — investigación para SILLAR

Fecha de verificación: 18 de agosto de 2026. Versión observada: `sileo@0.1.5`.

## Resumen factual

Sileo es un sistema global de *toasts* para React con seis estados, seis posiciones, cierre automático, seguimiento de promesas y acciones. Su rasgo visual es una cápsula SVG que se expande mediante un filtro “gooey”, cambios de tamaño animados con Motion y transiciones CSS tipo resorte.

Existe un hueco funcional aparente porque SILLAR ya tiene `useToasts/Toasts`. La comparación exacta de API y comportamiento interno queda limitada deliberadamente: este informe no accede a la carpeta del producto. Por eso se distingue lo comprobado en Sileo de lo que debe verificarse en el componente existente.

## Qué hace exactamente

- Se monta un `<Toaster>` una vez y se invoca un controlador global `sileo` fuera del árbol de componentes.
- Métodos: `show`, `success`, `error`, `warning`, `info`, `action`, `promise`, `dismiss` y `clear`.
- Cada aviso admite título, descripción/JSX, icono, duración, posición, color de relleno, redondeo, clases internas y un botón.
- `promise` sustituye el estado `loading` por éxito, error o acción y devuelve la promesa original.
- El contenido descriptivo se expande automáticamente o al pasar el puntero.
- El fondo no es una caja CSS: son dos rectángulos SVG con filtro de desenfoque y matriz de color, animados en ancho, alto, posición y opacidad.

Hay una limitación no destacada por la documentación: el tipo público `SileoOptions` no expone `id`, y el código asigna `"sileo-default"` cuando no existe. Las llamadas públicas normales sustituyen el aviso vivo con ese mismo id en lugar de crear varios. Aunque el render soporta colecciones y posiciones, el API tipado de `0.1.5` funciona, en la práctica, como un único aviso global actualizable.

## Comparación con `useToasts/Toasts`

| Aspecto | Sileo 0.1.5 | `useToasts/Toasts` existente |
| --- | --- | --- |
| Nueva dependencia | Sí: Sileo + Motion y transitivas | Ninguna nueva |
| Integración y llamadas existentes | Requiere migración o adaptador | Ya integrado |
| Promesa loading → resultado | Incluido | Debe comprobarse |
| Acciones | Incluidas, pero ocultas en el cuerpo expandible | Debe comprobarse; una acción visible siempre es preferible |
| Múltiples avisos | El motor los representa, pero el API tipado normal reutiliza un id | Debe comprobarse |
| Colores por tokens SILLAR | Requiere sobrescrituras y aun conserva valores internos escritos a mano | Debe comprobarse; es modificable en casa |
| Movimiento reducido completo | No se puede garantizar con el API documentado | Se puede corregir directamente si falta |
| Apariencia | Cápsula SVG expansible y muy reconocible | Apariencia actual de SILLAR |
| Coste de mantenimiento | Dependencia joven + adaptación de estilos | Código propio ya asumido por el producto |

Antes de comparar funciones faltantes deben auditarse en el componente actual: cola/límite, deduplicación, pausa, duración por severidad, foco, lectores de pantalla, promesas, acciones y pruebas. No se presupone que existan ni que falten.

## Restricciones no negociables

### Colores

Sileo incumple la regla en su distribución predeterminada:

- Inyecta CSS con seis colores de estado `oklch(...)` escritos a mano.
- El relleno predeterminado es `#FFFFFF`.
- El modo de tema introduce `#1a1a1a`, `#f2f2f2` y colores `rgba(...)` para la descripción.
- El CSS se inserta automáticamente desde el JavaScript al importar el paquete; no es solo una hoja opcional.

Se pueden sobrescribir `--sileo-state-*`, pasar `fill: "var(...)"` y aplicar clases propias. No se debe pasar `theme`, porque activa los rellenos internos. Esto puede hacer que el resultado visible use tokens, pero no elimina del bundle los valores escritos a mano. Si la restricción también se aplica literalmente al código de terceros enviado al navegador, la versión analizada no la cumple.

### `prefers-reduced-motion`

La hoja inyectada anula animaciones y transiciones CSS bajo `prefers-reduced-motion`. Sin embargo, los rectángulos SVG usan `motion.rect` con transiciones JavaScript de 600 ms. Sileo no usa `useReducedMotion`, no expone una política equivalente y Motion tiene `reducedMotion="never"` como valor predeterminado.

Envolverlo con `<MotionConfig reducedMotion="user">` tampoco prueba que todo desaparezca: Motion documenta que su política automática deshabilita transformaciones y layout, mientras otras propiedades siguen animándose; Sileo anima atributos SVG como `x`, `width`, `height` y `opacity`.

Por tanto, con el API público de `0.1.5` no se puede garantizar la regla de SILLAR. Haría falta una modificación/fork que cambie instantáneamente los atributos cuando la media query esté activa, o sustituir la capa visual.

### Ninguna animación retrasa una acción

El comportamiento predeterminado expande el contenido tras 150 ms, inicia su aparición con un retardo CSS adicional y vuelve a contraerlo a los 4 s. El botón de acción está dentro de ese contenido oculto. Por ello, la animación sí retrasa la disponibilidad visible de una acción.

`autopilot: false` no resuelve el problema: mantiene el cuerpo cerrado hasta hover. `autopilot: { expand: 0 }` reduce el primer retardo, pero conserva la transición de aparición y no corrige el movimiento SVG para usuarios con reducción de movimiento.

Además, el componente representa el aviso completo como `<button>` y la acción interior como `<a href="#">`, una estructura interactiva anidada problemática. El callback se ejecuta directamente al hacer clic, pero la acción primero tiene que estar visible y alcanzable.

## Licencia

- `package.json`, npm y el sitio declaran MIT.
- El repositorio analizado no contiene un archivo `LICENSE` en la raíz y el tarball `0.1.5` tampoco lo incluye.
- MIT exige conservar el aviso de copyright y el texto de permiso, pero el artefacto distribuido no entrega ese texto ni identifica allí un aviso de copyright completo.

No corresponde reinterpretar eso como otra licencia, pero sí registrar la carencia documental y pedir al mantenedor un archivo de licencia antes de una eventual adopción.

## Peso y árbol de dependencias

| Concepto | Coste observado |
| --- | ---: |
| Tarball de `sileo@0.1.5` | 28,218 B |
| Sileo descomprimido | 150,873 B / 11 archivos |
| Bundle usado por React, React externo | 147,113 B minificados; 48,573 B gzip |
| Árbol instalado deduplicado aproximado | 8,609,138 B descomprimidos |
| Dependencia directa | `motion ^12.34.0` |
| Transitivas relevantes | `framer-motion`, `motion-dom`, `motion-utils`, `tslib` |
| Peers | `react >=18`, `react-dom >=18` |

El árbol instalado aproximado suma Sileo 0.1.5, Motion 12.34.0, Framer Motion 12.34.0, Motion DOM 12.34.0, Motion Utils 12.29.2 y tslib 2.8.1 según sus metadatos npm. El gestor puede deduplicar con dependencias ya presentes.

La medición de bundle usa esbuild 0.25.10, ESM y ES2022, dejando React/ReactDOM fuera. Incluye el CSS porque la distribución lo transforma en una cadena que se inyecta al importar. Si Motion ya estuviera en un chunk compartido, el coste incremental de red podría bajar, pero Sileo sigue obligando al bundler a incluir las partes de `motion` que realmente usa.

## Build, rendimiento y operación

- No necesita build propio: publica CJS, ESM y tipos. Vite puede consumirlo directamente.
- La importación tiene efecto lateral: crea una etiqueta `<style>`. Esto dificulta políticas CSP con `style-src` estricto y no ofrece un `nonce` documentado.
- Cada aviso usa filtros SVG (`feGaussianBlur`, `feColorMatrix`, `feComposite`), dos `ResizeObserver`, mediciones de `scrollWidth`/`scrollHeight`, varios estados React, timers y Motion.
- La documentación reconoce que aumentar el redondeo aumenta el radio de desenfoque y el coste de render.
- Para un aviso ocasional el coste de CPU es breve. Una ráfaga de estados o actualizaciones de promesa provoca mediciones, animación del SVG y trabajo del hilo principal que una caja CSS no necesita.
- `dismiss` marca salida y conserva el nodo 600 ms antes de retirarlo. `clear` retira de inmediato.
- La duración predeterminada del aviso es 6 s. Pausar por hover reinicia el temporizador completo al salir, no conserva el tiempo restante.

## ¿Se puede escribir a mano en unas pocas decenas de líneas?

Sí para los dos o tres detalles útiles en SILLAR: una entrada breve, severidad visible y una acción inmediata. No para copiar el filtro gooey, el morph SVG, el manejo completo de promesas y todos los gestos en pocas líneas.

Como `useToasts/Toasts` ya existe, no hace falta reescribir el almacén. Basta una capa visual pequeña. El siguiente esquema debe adaptarse a los nombres reales del hook:

```tsx
export function Toasts() {
  const { avisos, cerrar } = useToasts();

  return (
    <section className="avisos" aria-live="polite" aria-label="Notificaciones">
      {avisos.map((aviso) => (
        <article className="aviso" data-tipo={aviso.tipo} key={aviso.id}>
          <div>
            <strong>{aviso.titulo}</strong>
            {aviso.detalle && <p>{aviso.detalle}</p>}
          </div>
          {aviso.accion && (
            <button onClick={aviso.accion.ejecutar}>
              {aviso.accion.etiqueta}
            </button>
          )}
          <button onClick={() => cerrar(aviso.id)} aria-label="Cerrar notificación">
            ×
          </button>
        </article>
      ))}
    </section>
  );
}
```

```css
.avisos {
  position: fixed;
  inset-block-start: var(--espacio-aviso-borde);
  inset-inline-end: var(--espacio-aviso-borde);
  display: grid;
  gap: var(--espacio-aviso);
}

.aviso {
  display: flex;
  align-items: center;
  gap: var(--espacio-aviso);
  color: var(--color-aviso-texto);
  background: var(--color-aviso-fondo);
  border: 1px solid var(--color-aviso-borde);
  animation: aviso-entrada 140ms ease-out both;
}

.aviso[data-tipo="error"] {
  border-inline-start-color: var(--color-estado-error);
}

@keyframes aviso-entrada {
  from { opacity: 0; transform: translateY(-0.25rem); }
}

@media (prefers-reduced-motion: reduce) {
  .aviso { animation: none; }
}
```

La acción se renderiza desde el primer frame y su callback no espera la animación. Todos los colores proceden de variables; los nombres del ejemplo deben mapearse a los tokens ya validados de SILLAR.

## Alternativas y coste

| Alternativa | Bundle medido | Dependencias/licencia | Coste de mantenimiento y restricciones |
| --- | ---: | --- | --- |
| Mantener `useToasts/Toasts` y ajustar su vista | 0 B nuevos; peso actual pendiente de auditoría | Código del producto | Menor migración; SILLAR controla tokens, ARIA y movimiento. Hay que probar cola, promesas y temporizadores |
| Vista manual sobre el hook existente | Normalmente menos de 1 KB adicional | Sin paquete | Se mantienen solo los detalles que aportan valor; no incluye morph gooey |
| Sileo 0.1.5 | 48,573 B gzip | Motion + 4 transitivas; MIT declarada, texto ausente | Mucho acabado visual, pero falla las restricciones estrictas en la versión analizada |
| Sonner 2.0.8 | 9,695 B gzip; 174,012 B instalado | Sin dependencia runtime; MIT con licencia incluida | Tiene regla de movimiento reducido. Sus estilos inyectados incluyen colores escritos a mano: habría que usar modo sin estilo/overrides y auditar tokens |
| React Hot Toast 2.6.0 | 4,826 B gzip; 202,683 B propio | `goober`, `csstype`; MIT | Consulta `prefers-reduced-motion`, pero sus iconos/estilos predeterminados incluyen colores literales. CSS-in-JS añade una capa de mantenimiento |

Las cuatro mediciones usan la misma configuración y excluyen React/ReactDOM. No son un benchmark del producto; comparan el coste incremental de entradas equivalentes.

## Pruebas necesarias para una comparación real

- Inventario de llamadas y contrato de `useToasts` actual.
- Acciones visibles y enfocables desde el primer frame, sin depender de hover.
- Lectura correcta con NVDA/VoiceOver y ausencia de anuncios duplicados al actualizar una promesa.
- Temporizador pausado con hover y foco, conservando el tiempo restante.
- Cero animación CSS y JavaScript con movimiento reducido.
- Tres avisos simultáneos, aviso repetido y ráfaga de diez eventos.
- CSP del despliegue y comportamiento de hojas inyectadas.
- Sustitución de todos los colores por tokens ya validados.

## Fuentes primarias

- [Documentación de Sileo](https://sileo.aaryan.design/docs)
- [API de Sileo](https://sileo.aaryan.design/docs/api)
- [Estilos y Autopilot](https://sileo.aaryan.design/docs/styling)
- [Repositorio de Sileo](https://github.com/hiaaryan/sileo)
- [Manifiesto publicado en el repositorio](https://github.com/hiaaryan/sileo/blob/main/package.json)
- [Código del controlador y Toaster](https://github.com/hiaaryan/sileo/blob/main/src/toast.tsx)
- [Código del componente SVG](https://github.com/hiaaryan/sileo/blob/main/src/sileo.tsx)
- [CSS fuente](https://github.com/hiaaryan/sileo/blob/main/src/styles.css)
- [MotionConfig y su valor predeterminado](https://www.motion.dev/docs/react-motion-config)
- [Repositorio de Sonner](https://github.com/emilkowalski/sonner)
- [Repositorio de React Hot Toast](https://github.com/timolins/react-hot-toast)

## Qué vale la pena copiar

### El delta que se puede afirmar

Sin leer el código del producto no es posible afirmar honestamente que `useToasts/Toasts` carezca de una función concreta. El nombre del hook no revela si actualiza avisos, deduplica o pausa temporizadores. La comparación anterior deja esas capacidades como pendientes, no como ausentes.

Sí se puede reducir Sileo a tres comportamientos comprobados que merece la pena buscar en el componente propio. Si ya existen, no hay delta. Si no existen, caben a mano y no justifican una dependencia.

### 1. Actualizar un aviso durante una operación asíncrona

Sileo conserva un aviso mientras una promesa pasa de carga a éxito o error. La idea útil no es la animación: es mantener un solo id y actualizar su contenido, evitando tres avisos separados.

Solo requiere que el almacén propio tenga `crear` y `actualizar`:

```ts
type Avisos = {
  crear: (aviso: Aviso) => string;
  actualizar: (id: string, cambio: Partial<Aviso>) => void;
};

export async function conAviso<T>(
  trabajo: Promise<T>,
  avisos: Avisos,
  mensajes: {
    carga: string;
    exito: (resultado: T) => string;
    error: (causa: unknown) => string;
  },
) {
  const id = avisos.crear({ tipo: "carga", titulo: mensajes.carga });

  try {
    const resultado = await trabajo;
    avisos.actualizar(id, { tipo: "exito", titulo: mensajes.exito(resultado) });
    return resultado;
  } catch (causa) {
    avisos.actualizar(id, { tipo: "error", titulo: mensajes.error(causa) });
    throw causa;
  }
}
```

La promesa empieza inmediatamente y la función devuelve o relanza el mismo resultado. Ninguna animación controla el tiempo de la operación.

### 2. Reemplazar o agrupar avisos repetidos por una clave semántica

Sileo reemplaza el aviso que comparte id; en su API pública usa de hecho un único id predeterminado. No cuenta repeticiones ni hace agrupación real. Lo rescatable es la identidad estable; SILLAR puede implementarla mejor con una clave como `inventario-bajo:producto-42`.

```ts
const avisosActivos = new Map<string, { id: string; repeticiones: number }>();

export function avisarAgrupado(
  clave: string,
  titulo: string,
  avisos: Avisos,
) {
  const activo = avisosActivos.get(clave);

  if (activo) {
    activo.repeticiones += 1;
    avisos.actualizar(activo.id, {
      titulo,
      detalle: `Ocurrió ${activo.repeticiones} veces`,
    });
    return activo.id;
  }

  const id = avisos.crear({ tipo: "informacion", titulo });
  avisosActivos.set(clave, { id, repeticiones: 1 });
  return id;
}
```

El método que cierre un aviso debe borrar también su clave del mapa. En una implementación React conviene guardar este índice dentro del store, no como estado global suelto. Esto evita ráfagas de diez mensajes idénticos sin ocultar que el evento se repitió.

### 3. No vencer mientras el usuario lee o interactúa

Sileo pausa todos los cierres automáticos durante hover, pero al salir programa otra vez la duración completa. La idea vale la pena; el detalle conviene mejorarlo: pausar tanto con puntero como con foco y reanudar solo el tiempo restante.

```ts
function crearVencimiento(ms: number, cerrar: () => void) {
  let restante = ms;
  let inicio = 0;
  let temporizador = 0;
  let corriendo = false;
  const bloqueos = new Set<"puntero" | "foco">();

  const iniciar = () => {
    if (corriendo || bloqueos.size || restante <= 0) return;
    corriendo = true;
    inicio = performance.now();
    temporizador = window.setTimeout(() => {
      corriendo = false;
      cerrar();
    }, restante);
  };

  const detener = () => {
    if (!corriendo) return;
    window.clearTimeout(temporizador);
    restante = Math.max(0, restante - (performance.now() - inicio));
    corriendo = false;
  };

  const pausar = (motivo: "puntero" | "foco") => {
    bloqueos.add(motivo);
    detener();
  };

  const reanudar = (motivo: "puntero" | "foco") => {
    bloqueos.delete(motivo);
    iniciar();
  };

  const cancelar = () => {
    detener();
    restante = 0;
  };

  iniciar();
  return { pausar, reanudar, cancelar };
}
```

`Toasts` puede usar el motivo `"puntero"` en `onPointerEnter`/`onPointerLeave` y `"foco"` en `onFocusCapture`/`onBlurCapture`. El conjunto evita reanudar mientras todavía queda una de las dos interacciones. Una acción debe estar renderizada desde el primer frame; este temporizador protege el tiempo de lectura, no controla su aparición.

### Lo que no merece copiarse

- El *morph* gooey y la expansión automática: son el coste principal y retrasan el contenido accionable.
- El gesto de arrastre para cerrar: aporta poco en un panel principalmente de escritorio y complica puntero, selección y accesibilidad.
- Seis posiciones configurables: permiten inconsistencia entre módulos. Una posición estable reduce búsqueda visual.
- El apilado de Sileo 0.1.5: el render interno lo contempla, pero el API tipado normal reutiliza el id predeterminado; no ofrece una cola pública sólida que copiar.
- El botón dentro de contenido colapsable: una acción de deshacer o revisar debe estar visible y enfocada sin hover.

### Resultado práctico

Las tres preguntas concretas para `useToasts/Toasts` son:

1. ¿Puede actualizar el mismo aviso por id durante una promesa?
2. ¿Puede hacer *upsert* por una clave semántica y contabilizar repeticiones?
3. ¿Pausa el vencimiento con puntero **y foco**, conservando el tiempo restante?

Esas son las únicas ideas de Sileo que justifican trabajo adicional en un panel administrativo. Cada una es independiente, se puede probar sin animación y no requiere traer el paquete.
