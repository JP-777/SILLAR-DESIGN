# Investigación y construcción — pared de sillares

**VEREDICTO: la entrada no justifica la pared hasta que una medición real demuestre esperas superiores a 1 s; la activación de un módulo sí sostiene la metáfora porque la espera y el reinicio ya existen. En ambos casos el panel debe quedar disponible cuando termina el trabajo, nunca cuando termina la animación.**

Fecha de comprobación de fuentes: 19 de agosto de 2026.

## 1. La respuesta que va antes que el dibujo

### ¿Cuánto tarda de verdad la entrada?

**No encontrado y no inferible sin medir SILLAR.** No se debe sustituir ese hueco por una cifra de otro producto: autenticación, consulta de capacidades, importaciones dinámicas, red local o nube, caché y hardware cambian el resultado. El dato que decide es el tiempo desde la acción de entrada hasta que el panel está montado y su primera acción está habilitada, no solo hasta que responde `/login`.

El límite utilizable sí está documentado. Nielsen distingue 0,1 s como respuesta percibida como inmediata, 1 s como límite aproximado para conservar el flujo sin realimentación especial y 10 s como límite de atención; para más de 1 s pide indicar que el sistema trabaja. Para 2–10 s recomienda una señal menos aparatosa que un porcentaje si el progreso no es determinable. [NN/g — Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/).

**Umbral operativo de esta entrega: 1 000 ms.** Antes de ese momento no se monta la pared ni el mensaje. No existe una duración mínima visible: si el trabajo termina, el panel se habilita en ese mismo commit. Esto conserva la regla ya adoptada por el proyecto y evita convertir una entrada de 400 ms en una ceremonia de tres segundos.

Hay una discontinuidad inevitable alrededor de cualquier umbral: una operación que termine apenas después puede producir una aparición breve. No se corrige imponiendo un mínimo —eso retrasaría la acción—, sino midiendo la distribución real y ajustando el umbral si ese borde resulta frecuente.

### Método de medición en el producto

Medir por separado entrada y reinicio, en nube y local:

1. Marcar `entrada:envio` en el `submit`.
2. Marcar respuesta de autenticación, fin de capacidades y fin de importación/montaje de rutas.
3. Marcar el commit de React del panel y la siguiente oportunidad de presentación con `requestAnimationFrame`.
4. Exponer tiempos internos del servidor con `Server-Timing`; así una espera de base de datos no se confunde con red o render. La cabecera y su exposición en `PerformanceResourceTiming.serverTiming` están definidas por [W3C Server Timing](https://www.w3.org/TR/server-timing/).
5. Registrar al menos 30 muestras por combinación: nube/local, caché fría/caliente y primera entrada/reentrada. Informar p50, p75 y p95, no solo promedio.
6. Repetir en el ordenador antiguo objetivo y con un perfil de red representativo. La limitación de CPU del navegador sirve para estrés, no reemplaza ese equipo.

Instrumentación mínima en el flujo existente:

```ts
performance.mark('entrada:envio');

await autenticar();
performance.mark('entrada:autenticada');

await cargarCapacidades();
performance.mark('entrada:capacidades');

await montarRutasHabilitadas();
performance.mark('entrada:rutas');

// Este punto debe ejecutarse cuando el panel ya está montado y habilitado.
requestAnimationFrame(() => {
  performance.mark('entrada:panel-presentable');
  performance.measure('entrada:total', 'entrada:envio', 'entrada:panel-presentable');
  performance.measure('entrada:capacidades', 'entrada:autenticada', 'entrada:capacidades');
  performance.measure('entrada:rutas', 'entrada:capacidades', 'entrada:rutas');
});
```

`performance.mark()` y `performance.measure()` forman parte de User Timing: [MDN `mark()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) y [MDN `measure()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure).

Para el reinicio, el intervalo equivalente es `clic de activación → panel de nuevo operativo`, con hitos `activación persistida`, `servicio no saludable`, `servicio saludable`, `capacidades actualizadas` y `rutas montadas`. Los mensajes solo cambian al ocurrir esos hitos reales.

## 2. Los dos momentos

| Momento | Encaje de la idea | Condición |
|---|---|---|
| Entrada ordinaria | Condicional. Puede explicar la marca, pero puede fabricar una espera si el p75 queda bajo 1 s. | Mostrarla solo si sigue pendiente a los 1 000 ms; nunca alargar la entrada. |
| Activación y reinicio de módulo | Fuerte. La pared que se reconstruye representa literalmente un sistema que se recompone y sustituye una barra indeterminada que ya existe. | Mismo retraso de 1 000 ms si el reinicio a veces es instantáneo; mensajes enlazados a eventos reales. |

La activación de módulo sostiene mejor la idea. Esto es un resultado de adecuación, no una decisión de adopción.

Mensajes válidos para el flujo construido:

| Mensaje | Solo mientras sea cierto |
|---|---|
| `Guardando la activación del módulo` | La petición de activación sigue pendiente. |
| `Reiniciando los servicios` | La instalación está entrando en reinicio. |
| `Esperando que el sistema vuelva a estar disponible` | El sondeo de salud aún no confirma disponibilidad. |
| `Actualizando los módulos habilitados` | Se vuelven a pedir capacidades y se montan sus rutas. |
| `Sistema disponible` | El panel ya está montado y operativo. |

No hay rotación por temporizador. Si una fase se atasca, su texto permanece: inventar variedad parecería progreso sin serlo.

## 3. Construcción y comportamiento

La implementación usa 23 elementos rectangulares en cinco filas. Cada sillar tiene una animación CSS de una sola ejecución. El conjunto tarda aproximadamente 1,5 s en formarse, pero ese tiempo no gobierna nada del producto.

- Si la carga termina a media pared, se pausan los sillares en su posición calculada y el conjunto sube y se desvanece desde ahí.
- El panel se monta y la capa pasa a `pointer-events: none` en el mismo commit. No hay `animationend`, promesa ni temporizador de salida en el camino crítico.
- Si la carga sigue, dos partículas pequeñas usan periodos distintos de 3,7 y 5,1 s. No se vuelve a construir la pared en un bucle evidente.
- Como ese movimiento puede superar cinco segundos, se incluye `Detener movimiento`. WCAG 2.2.2 exige un mecanismo de pausa, parada u ocultación para movimiento automático de más de cinco segundos cuando convive con otro contenido; también describe la excepción limitada de ciertos precargadores. No hace falta apoyarse en la excepción. [W3C — Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

La salida visual usa el token de salida de superficie, con respaldo de 160 ms. Es una transición del velo, no una espera funcional: durante ella el botón del panel ya recibe el clic. Con movimiento reducido la salida es inmediata.

## 4. Movimiento reducido y estado accesible

**La caída desaparece completamente.** Quedan una pared estática terminada y el mensaje verdadero. Las partículas y el control para detenerlas desaparecen. La media query CSS se reevalúa cuando cambia la preferencia, por lo que no hay lectura única al inicializar ni listener JavaScript que pueda olvidarse.

WCAG 2.3.3 permite movimiento esencial, pero define esencial de forma estricta: quitarlo tendría que cambiar fundamentalmente la información o la función y no existir otra forma conforme. Aquí el mensaje comunica el estado; la piedra lo refuerza. Por tanto, la caída no es esencial y debe retirarse. [W3C — Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).

El estado accesible es una región `role="status"`, `aria-live="polite"` y `aria-atomic="true"`. Solo cambia con hitos reales, no cada dos segundos, por lo que no martillea al lector de pantalla. Al terminar anuncia `Sistema disponible`. WCAG 4.1.3 incluye expresamente el estado de espera y el progreso dentro de los mensajes que deben poder determinarse programáticamente sin mover el foco. [W3C — Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html).

## 5. Técnica y coste

| Técnica | Coste y encaje |
|---|---|
| CSS + DOM | Elegida para la construcción de referencia: 23 bloques, cero JavaScript por fotograma, colores resueltos por variables y `prefers-reduced-motion` automático. |
| SVG | Puede representar los mismos 23 rectángulos y escalar con `viewBox`, pero no reduce de forma material los nodos ni las animaciones. Añade transformaciones y estilos SVG sin aportar una forma que CSS no pueda dibujar. |
| `canvas` | Reduce nodos, pero exige un bucle `requestAnimationFrame`, escala por DPR, redimensionado, lectura de colores CSS, región accesible DOM y escucha en caliente de movimiento reducido. Para 23 rectángulos intercambia poco DOM por bastante código y trabajo continuo. |
| Biblioteca | No justificada. No hay secuencias reversibles complejas, física, cronología editable ni interoperación que CSS no cubra razonablemente. |

La guía de rendimiento del navegador recomienda limitar animaciones a `transform` y `opacity` para evitar trabajo de maquetación y pintura por fotograma. Esta construcción hace exactamente eso; no anima `top`, dimensiones, sombras ni filtros, y no deja `will-change` permanente. [web.dev — High-performance CSS animations](https://web.dev/articles/animations-guide).

### Bytes y nodos

- Componente TSX sin minificar: 2 431 bytes; 813 bytes con gzip.
- CSS sin minificar: 4 874 bytes; 1 287 bytes con gzip.
- Total de fuente comprimida: 2 100 bytes antes de que Vite/TypeScript eliminen tipos y minifiquen.
- Dependencias nuevas: cero; React ya pertenece al producto.
- Elementos durante la espera: 36, incluidos filas, mensaje, control de parada y región de estado.

El tamaño incremental final del bundle **no se pudo obtener** sin empaquetar contra la configuración real del producto, a la que este encargo no da acceso. Las cifras anteriores son reproducibles, pero no deben rotularse como bundle final.

### Hardware modesto

**Resultado medido válido: no encontrado.** Se intentó ejecutar el caso en Chromium headless, pero el proceso GPU del entorno de investigación terminó repetidamente; usar `--disable-gpu` habría medido rasterización por software y habría producido una cifra engañosa para esta pregunta. No se rellena el hueco.

Se entregan `benchmark-pared.html` y `ejecutar-benchmark-cdp.mjs`. El segundo aplica limitación de CPU por CDP y devuelve intervalo mediano/p95 de fotograma, intervalos mayores de 20 y 33 ms, tareas largas, recálculos de estilo, maquetaciones y memoria JS. El protocolo de aceptación es:

1. Ejecutar en el ordenador de tienda objetivo con factor CPU 1, modo normal y reducido.
2. Repetir 20 veces tras arranque frío y 20 caliente.
3. Ejecutar en una máquina de desarrollo con factor 4 solo como prueba de estrés.
4. Guardar p50 y p95; inspeccionar cualquier tarea larga y cualquier intervalo mayor de 33 ms durante la caída.
5. Repetir integrado: la página aislada detecta el coste propio, pero no la contención con montaje de rutas y render inicial.

Por estructura, el riesgo está acotado —pocos nodos, `transform`/`opacity`, sin JS por fotograma—, pero eso no reemplaza el dato del equipo real.

## 6. Colores y tokens

No hace falta crear un color nuevo. El código usa exclusivamente roles encontrados en el sistema de diseño externo:

`--bg`, `--bg-raised`, `--text`, `--text-muted`, `--text-subtle`, `--border`, `--border-strong` y `--primary`.

No hay `rgb`, hexadecimal, nombre de color ni opacidad convertida en color dentro del componente. La opacidad numérica anima partículas, no define una paleta.

Hallazgo de integración: en la copia del sistema de diseño revisada no aparecen todavía los tokens semánticos de movimiento. El CSS consume `--duracion-superficie`, `--duracion-salida-superficie`, `--curva-entrada` y `--curva-salida`, y lleva respaldos de 240 ms, 160 ms y las curvas de la escala investigada para que el ejemplo sea ejecutable. Si la escala ya se aplicó en otra rama, los respaldos no intervienen.

## 7. Entrega de código lista para aplicar

```text
ParedDeSillaresEspera.tsx          Componente concreto; no crea un hook ni un marco genérico.
pared-de-sillares-espera.css       Pared, salida desde cualquier altura y reducción de movimiento.
IntegracionReinicioModulo.tsx      Integración de referencia con umbral y fases reales.
ParedDeSillaresEspera.harness.tsx  Banco de prueba aislado; montar solo en desarrollo.
pared-de-sillares-espera.spec.ts   Contratos Playwright.
benchmark-pared.html               Caso aislado para medir fotogramas y tareas largas.
ejecutar-benchmark-cdp.mjs         Ejecutor sin paquetes npm adicionales.
```

El integrador debe conectar el `harness` a `/__pruebas/pared-sillares` solo en desarrollo. No se instala ninguna dependencia nueva: la prueba usa el Playwright que ya utilice el producto.

## 8. Qué afirman las pruebas

1. **El panel no espera:** la prueba fuerza una salida de cuatro segundos; mientras el velo todavía es visible, verifica que el panel está montado y pulsa `Nueva venta`. El contador debe cambiar. Esto demuestra que no se espera `animationend` y que la capa ya no intercepta eventos.
2. **Movimiento reducido conserva la comunicación:** emula `reducedMotion: 'reduce'`, comprueba el mensaje de estado, la pared visible y estática, `animation-name: none`, `transform: none` y ausencia de partículas.
3. **Cambio en caliente:** empieza sin preferencia, activa reducción mientras caen los bloques y comprueba que la animación pasa a `none` sin perder el mensaje.
4. **Umbral:** una carga de 400 ms llega al panel sin montar indicador ni región de estado.
5. **Movimiento prolongado controlable:** el botón detiene todas las animaciones sin eliminar el mensaje de espera.

Playwright documenta la emulación de preferencias de medios, incluido movimiento reducido: [Playwright — Emulation](https://playwright.dev/docs/emulation).

## Límites de esta investigación

- No se midió SILLAR ni se escribió dentro de su repositorio.
- No se obtuvo tiempo real de entrada o reinicio: queda deliberadamente marcado y acompañado del protocolo para obtenerlo.
- No se obtuvo una medida GPU válida del equipo antiguo: se entrega el banco reproducible.
- La integración usa nombres de operaciones explícitos; el agente que aplique debe enlazarlos con los eventos reales de salud y capacidades, no sustituirlos por temporizadores decorativos.
