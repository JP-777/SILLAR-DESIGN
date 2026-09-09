# Decisiones de diseño recuperadas

## Convención de estado

- **DECIDIDO:** orden explícito del usuario o formulación posterior “ya decidida”.
- **IMPLEMENTADO:** existe en material de diseño/investigación; no implica integración en `C:\SILLAR`.
- **PROPUESTO:** alternativa preparada para evaluación.
- **DESCARTADO:** el historial dice que no entra.
- **PENDIENTE:** falta decisión o ejecución.
- **INCIERTO:** no hay evidencia suficiente.

## Identidad visual

| Estado | Área | Decisión o propuesta | Motivo y alternativa | Ubicación |
|---|---|---|---|---|
| PROPUESTO | Identidad SILLAR | Paleta de piedra arequipeña con acento azul cielo de Arequipa. | Hace visible el origen del nombre sin convertir el panel en una pieza de campaña. | `propuestas\M01\_ds\...\tokens\tokens.css` |
| PROPUESTO | Geometría | Radios `3px`, `5px`, `8px`: “bloque tallado, esquinas apenas suavizadas”. | Consistencia con sillar; evita cápsulas blandas o exceso decorativo. | tokens |
| DECIDIDO | Superficies | Panel siempre con tema SILLAR; web pública puede usar tema del cliente. | Herramienta coherente frente a escaparate de cada negocio. | comentario en tokens |
| DECIDIDO | Carácter | El movimiento expresivo solo en ocasiones reales; el cotidiano debe ser corto e invisible a propósito. | Lo que encanta la primera vez cansa en una herramienta de ocho horas. | informes de pared/puerta |

## Paleta exacta de la propuesta M01

Estos valores existen en archivo y se preservan exactamente; su estado es **PROPUESTO**, no se ha verificado adopción en el producto.

```css
--stone-50: #FAF8F5;
--stone-100: #F2EEE7;
--stone-200: #E3DCD1;
--stone-300: #CBC2B2;
--stone-400: #A29886;
--stone-500: #7A7062;
--stone-600: #5C5447;
--stone-700: #443E34;
--stone-800: #2C2822;
--stone-900: #1A1713;
--accent-100: #D4E5F0;
--accent-300: #7FB0D0;
--accent-500: #1F6795;
--accent-600: #18536F;
--accent-700: #123D55;
--success: #2E7D5B;
--success-bg: #E6F2EC;
--warning: #9C6414;
--warning-bg: #FBF0DD;
--danger: #B23A2B;
--danger-bg: #FBEAE7;
```

Roles claros: `--bg: var(--stone-50)`, `--bg-raised: #FFF`, `--bg-sunken: var(--stone-100)`, texto stone-800, muted stone-600, subtle stone-500, borde stone-200, borde fuerte stone-500, primary accent-500, hover accent-600, texto sobre primario blanco.

Roles oscuros: fondo stone-900, raised stone-800, sunken `#12100D`, texto stone-100, muted stone-300, subtle stone-400, borde stone-700, borde fuerte stone-400, primary accent-600, hover accent-500; fondos semánticos `#17241E`, `#2A2115`, `#2A1A17`.

**Advertencia:** algunos valores de rol y sombras están escritos literalmente dentro del archivo de tokens; la regla “ningún color a mano” significa que los componentes consumen variables, no que el archivo fuente de tokens no pueda declarar sus valores.

Contrastes documentados en archivo: texto principal 13.8:1, botón primario 6.1:1, borde de control 4.6:1. **DECIDIDO:** todo color nuevo debe volver a validarse para contraste y daltonismo.

## Tipografía, espacio y jerarquía

- **PROPUESTO:** familia de sistema `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial`; mono del sistema.
- **PROPUESTO:** cuerpo `15px`, interlínea `1.55`; títulos peso `640`, tracking `-.015em`, interlínea `1.25`; H1 `26px`, H2 `20px`, H3 `16px`.
- **PROPUESTO:** escala de espacio `4, 8, 12, 16, 24, 32, 48, 64px` con tokens `--s1` a `--s8`.
- **PROPUESTO:** contenido M01 con ancho máximo `1120px`, relleno principal `--s6` y separación `--s5`. Tablero de revisión de escritorio a `1280px`; referencia compacta a `390px`.
- **DECIDIDO:** nombres de tokens por función, no por medida; por ejemplo `--duracion-control`, no `--duracion-120`.

## Layout y navegación M01

- **PROPUESTO/IMPLEMENTADO EN PROTOTIPO:** listado con cabecera de módulo, resumen, acciones a la derecha, controles de búsqueda/filtro y tabla.
- **PROPUESTO/IMPLEMENTADO EN PROTOTIPO:** detalle con enlace “‹ Productos”, identidad de producto y estado, acciones Descartar/Guardar, y tarjetas de Datos, Variantes, Fotos y Estado.
- **PROPUESTO:** en compacto el detalle pasa a una columna (`1fr`); en escritorio usa `minmax(0, 1.35fr) minmax(0, 1fr)`.
- **PROPUESTO:** en móvil el listado no conserva todas las columnas; apila nombre/código/precio/estado y deja solo Editar.
- **INCIERTO / REQUIERE CONFIRMACIÓN:** sidebar, header global y dashboard no fueron diseñados en el contexto recuperable. No extrapolar M01 a esas áreas.

## Cards, tablas, formularios y modales

- **PROPUESTO:** cards con títulos y subtítulos solo cuando explican estructura; no cajas decorativas anidadas sin función.
- **PROPUESTO:** tabla de productos muestra explícitamente código interno y barras; tolera ausencia de barras, precio a consultar, variantes e inactividad.
- **DECIDIDO EN EL PROBLEMA:** los dados de baja se atenúan pero no se ocultan si el usuario activa “Mostrar los dados de baja”.
- **PROPUESTO:** tabla de variantes muestra solamente lo que cambia, no repite nombre/foto/precio compartidos.
- **PROPUESTO:** campos asocian label, ayuda y error mediante `aria-describedby`; campos inválidos usan `aria-invalid`.
- **PROPUESTO:** error por código repetido nombra el valor y el producto en conflicto, no usa “ha ocurrido un error”.
- **PROPUESTO:** confirmaciones destructivas son `alertdialog`, atrapan foco, permiten Escape y restauran foco; el botón destructivo dice la acción concreta.
- **PROPUESTO:** el conflicto de categoría explica la consecuencia (“23 productos se quedarán sin categoría, pero seguirán activos”) y ofrece reversibilidad.

## Estados vacíos, carga y error

- **DECIDIDO:** por debajo de un segundo no se enseña indicador de espera.
- **DECIDIDO:** no inventar progreso ni datos. “Cargando módulos” solo aparece cuando se cargan módulos reales.
- **PROPUESTO M01:** vacío de listado explica qué crear y ofrece una sola acción primaria; oculta filtros inútiles.
- **PROPUESTO M01:** producto nuevo no presenta estado, fotos o variantes inexistentes.
- **PROPUESTO M01:** durante carga, mantener el esqueleto espacial de cabecera/tabla, omitir recuentos desconocidos y bloquear controles que todavía no pueden operar.
- **PENDIENTE / ARTEFACTO NO RECUPERADO:** sustituir o exceptuar el Spinner congelado por la regla global de movimiento reducido, añadir semántica anunciable y una prueba Playwright. El requisito está decidido; el código final no está disponible.

## Movimiento

- **DECIDIDO:** nunca retrasar la acción para que termine una animación.
- **DECIDIDO:** CSS global cubre por defecto animaciones/transiciones CSS bajo `prefers-reduced-motion`; no cubre JS.
- **DECIDIDO:** JS animado escucha cambios en caliente y cancela inmediatamente al activarse reducción.
- **DECIDIDO:** escala cotidiana: entrada control `120ms`, mensaje `180ms`, superficie `240ms`; salida `120/160ms`, más rápida que la entrada; entrada `cubic-bezier(.2,0,.4,1)`, salida `cubic-bezier(.4,0,1,1)`, `linear` solo para bucles.
- **PROPUESTO EN ENCARGO ANTERIOR, ARTEFACTO NO RECUPERADO:** bajo movimiento reducido conservar solo opacidad a `80ms` y eliminar `translate`/`scale` de forma global.
- **DECIDIDO:** el interruptor de instalación apaga movimiento ocasional, no las microtransiciones cotidianas; el sistema operativo puede reducir ambos.
- **PROPUESTO:** movimiento ocasional apagado por defecto hasta validar equipo antiguo.
- **DECIDIDO:** si un movimiento dura más de cinco segundos, debe poder detenerse; la pared incluye control.

## Pared de sillares

- **PROPUESTO:** momento principal: reinicio real al activar módulo. Inicio de sesión solo si la medición real supera 1 s.
- **IMPLEMENTADO EN REFERENCIA:** 23 sillares, cinco filas, máximo cinco caídas simultáneas; formación aproximada 1.5 s.
- **IMPLEMENTADO:** `transform` y `opacity`, salida 160 ms, sin dependencia ni bucle de render JS.
- **IMPLEMENTADO:** el panel no espera; overlay pierde eventos en el mismo commit que habilita el panel.
- **IMPLEMENTADO:** si la carga acaba a mitad, captura posición y sale el grupo; si se alarga, dos motas discretas evitan congelación evidente y se pueden detener.
- **IMPLEMENTADO:** reducción de movimiento muestra pared completa estática y mensajes reales.
- **IMPLEMENTADO:** mensajes de reinicio: “Guardando la activación del módulo”, “Reiniciando los servicios”, “Esperando que el sistema vuelva a estar disponible”, “Actualizando los módulos habilitados”, “Sistema disponible”.

## Velo de modal

- **DECIDIDO:** no puede seguir `rgba(26,23,19,.45)` escrito en el componente; debe existir token.
- **PENDIENTE / INCIERTO:** el resultado del estudio de uno o dos valores por tema no está en los archivos actuales. No inventar token ni valor.

## Iconografía y efectos

- **DESCARTADO:** Morphicons no tiene hueco actual. Solo reconsiderar una transición semántica cerrada de 2–3 iconos si aparece un caso real; no iconos autónomos.
- **DESCARTADO:** Auragradients para el panel. Un gradiente dinámico choca con la paleta validada. Si reaparece, solo como propuesta para tienda pública o instalación y preferiblemente horneado como imagen.
- **DESCARTADO:** Three.js para el conjunto evaluado; no reconstruir el razonamiento exacto sin el informe perdido. Principio conservado: si un fondo no reacciona, hornearlo evita coste en navegador.
- **DESCARTADO:** Liquid Gooey como dependencia; se sospechaba técnica SVG/CSS de pocas líneas. Informe ausente.

## Responsive y navegador

- **DECIDIDO COMO MÉTODO:** panel y tienda pueden tener suelos distintos; no usar una única cifra implícita.
- **PROPUESTO:** probar al menos Chromium, Safari móvil y Firefox/Edge de escritorio por cuota peruana observada.
- **PENDIENTE:** elegir entre escenario moderno, Vite por defecto o ESM amplio; falta analítica propia para cuantificar exclusión.
- **PROPUESTO:** View Transitions y otras capacidades modernas deben ser mejora progresiva: sin soporte no animan, no rompen.

## Fotografías y catálogo público

- **DECIDIDO PREVIO:** nombre generado UUID v7, validación de contenido real, SVG no admitido, subida <=5 MB; el mismo identificador vive en DB y disco.
- **DECIDIDO PREVIO:** rejilla cuadrada y ficha 16:9.
- **DECIDIDO COMO CRITERIO:** no depender de CDN externo porque la instalación local debe funcionar.
- **PROPUESTO:** 2–3 tamaños derivados según ranura×DPR, no cuatro por costumbre.
- **DECIDIDO COMO PATRÓN:** LCP no lazy; lazy solo debajo del pliegue; proporción reservada y dimensiones intrínsecas.
- **PENDIENTE:** ubicación de generación de derivados.
- **PROPUESTO:** social 1200×630 JPEG baseline sRGB, objetivo 550 000 bytes y hard cap <600 000 con bucle medir/ajustar.
- **PROPUESTO:** límites de decodificación 12 000 px/lado, 50 MP, 256 MiB, una imagen estática.

## Componentes reutilizables

- **DECIDIDO:** no crear hook/abstracción para un solo caso.
- **IMPLEMENTADO EN REFERENCIA:** la puerta de movimiento ocasional sí se comparte porque ya existen varias animaciones; abstrae permiso, no cómo animan.
- **PROPUESTO EN BUNDLE DE DISEÑO:** Alert, Badge, Button, Card, ConfirmDialog, Drawer, EmptyState, FailureAlert, Field, Gallery, Input, Pagination, Spinner, Switch, Table, Toasts.
- **INCIERTO:** equivalencia exacta con componentes de SILLAR no comprobada.
