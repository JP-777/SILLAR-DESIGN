# Investigación y construcción — puerta de animaciones ocasionales

**VEREDICTO: sí se puede construir una única puerta sin abstraer las animaciones: devuelve `permitidas` y el motivo de bloqueo, publica el mismo estado para CSS y corta en caliente cualquier efecto JavaScript mediante su limpieza. `prefers-reduced-motion` gana siempre. No existe una señal fiable de “máquina lenta” ni un número universal de elementos; hasta medir el ordenador objetivo, el valor persistido más seguro es animaciones ocasionales desactivadas.**

Fecha de comprobación de fuentes: 19 de agosto de 2026.

## 1. Qué se comparte exactamente

La abstracción compartida es solo esta operación lógica:

```text
permitidas = instalación === sí
          Y prefers-reduced-motion !== reduce
```

La precedencia no se expresa como “el último ajuste gana”. Primero se comprueba el sistema y solo después la instalación. El resultado incluye el motivo:

```ts
type EstadoAnimacionesOcasionales = {
  permitidas: boolean;
  motivoBloqueo: 'sistema' | 'instalacion' | 'configuracion-pendiente' | null;
};
```

### Dónde se pregunta

- `PuertaAnimacionesOcasionales` se monta una vez en la raíz React, cuando ya se dispone del ajuste de la instalación.
- Mientras el ajuste no llegó se pasa `null`: la puerta falla cerrada y no aparece una animación antes de conocer la configuración.
- Una animación CSS consulta el atributo de `<html>` y marca cada elemento que mueve con `data-animacion-ocasional`.
- Una animación JavaScript llama `useAnimacionesOcasionales()` en el componente concreto que la ejecuta. No hay motor, cronología ni hook genérico de animación.

El atributo raíz no sustituye la media query. El CSS vuelve a imponer `prefers-reduced-motion` aunque React falle, todavía no haya montado o el atributo quede mal por una regresión.

## 2. Qué pasa cuando cambia

**Al pasar de permitido a bloqueado, se corta inmediatamente.** Esperar a que termine incumpliría una preferencia que la persona acaba de activar y podría prolongar varios segundos el movimiento que pidió detener.

El corte tiene un contrato obligatorio para cada efecto:

1. Su CSS base representa el estado final estático.
2. La animación solo se superpone a ese estado base.
3. Al desaparecer el permiso, CSS aplica `animation: none` y vuelve al estado base.
4. Un efecto por Web Animations o `requestAnimationFrame` cancela su trabajo en la limpieza del efecto React y aplica explícitamente el estado final.

Por eso “apagar” no significa congelar una pared a medias. En la pared, los sillares pasan a la pared estática completa; si ya estaba saliendo, la superposición queda oculta y deja el panel libre inmediatamente.

Al pasar de bloqueado a permitido, el valor cambia en caliente. Las pantallas que ya estén montadas pueden decidir no iniciar una ceremonia tardía; la recomendación de integración es consultar `permitidas` cuando comienza la ocasión. La puerta no intenta decidir cómo debe reanudarse cada efecto.

## 3. Precedencia ejecutable

La prueba principal monta la instalación con `true` y emula `reducedMotion: 'reduce'`. Afirma simultáneamente:

```text
salida React  = bloqueadas:sistema
atributo CSS  = data-animaciones-ocasionales="bloqueadas"
motivo CSS    = data-motivo-animaciones-bloqueadas="sistema"
```

Otras pruebas cubren instalación desactivada, ambas puertas permitiendo y configuración todavía pendiente. Una prueba en caliente inicia una animación CSS y otra mediante Web Animations, activa movimiento reducido y afirma que ambas quedan sin animaciones y en su estado final.

## 4. Movimiento diario frente a movimiento ocasional

**El ajuste de instalación apaga solo el movimiento ocasional.** Los controles, diálogos y cambios de estado diarios conservan la escala de 120/180/240 ms y no llevan `data-animacion-ocasional` ni consultan este hook.

Hay una excepción deliberada a esa separación: la preferencia del sistema sigue aplicándose globalmente. Si el sistema pide movimiento reducido, la hoja base puede reducir tanto lo diario como lo ocasional. El ajuste de SILLAR no puede devolver movimiento que el sistema retiró.

| Clase | Ajuste de instalación | Preferencia del sistema |
|---|---:|---:|
| Diaria, 120/180/240 ms | No la apaga | La reduce mediante la regla base |
| Ocasional y expresiva | Puede apagarla | Siempre la apaga |

## 5. ¿Puede detectarse una máquina lenta?

**No de forma fiable con una consulta del navegador.**

| Señal | Qué dice | Por qué no decide |
|---|---|---|
| `navigator.hardwareConcurrency` | Procesadores lógicos disponibles para ejecutar hilos. | El navegador puede devolver una cifra menor; no dice frecuencia, generación, carga actual, GPU, memoria gráfica ni coste de composición. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency). |
| `navigator.deviceMemory` | RAM aproximada. | Es de disponibilidad limitada, solo en contexto seguro, está redondeada y acotada por privacidad. RAM no equivale a capacidad gráfica. [W3C Device Memory](https://www.w3.org/TR/device-memory/), [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Device_Memory_API). |
| Información WebGL/WebGPU | Disponibilidad, límites o características del adaptador. | No es una puntuación comparable de rendimiento y puede estar restringida por privacidad, controladores o políticas. |
| Agente de usuario | Navegador y plataforma declarados. | Dos equipos con el mismo valor pueden tener una diferencia enorme de GPU, temperatura, energía y procesos en segundo plano. |
| Red o batería | Estado de red o energía. | No mide la capacidad de presentar las capas de una animación. |

Usar `hardwareConcurrency <= 4` o `deviceMemory <= 4` apagaría animaciones en equipos que pueden ejecutarlas y las dejaría activas en otros con GPU o controladores deficientes. Son datos útiles para segmentar mediciones, no una puerta de producto.

### Medir después de empezar

`requestAnimationFrame`, trazas del navegador y `PerformanceObserver` permiten observar el trabajo real. Long Tasks informa tareas del hilo principal a partir de 50 ms, no una capacidad abstracta del equipo. [W3C Long Tasks API](https://www.w3.org/TR/longtasks-1/).

Apagar después de varios fotogramas malos tiene tres problemas:

1. La persona ya vio fallar la primera animación.
2. Una tarea larga puede proceder del montaje de React, la red procesada o una extensión, no del efecto.
3. Una animación del compositor puede perder presentaciones sin producir una Long Task JavaScript atribuible.

Puede servir como telemetría agregada o para no repetir el efecto en la siguiente ocasión del mismo dispositivo. **No debe ser la fuente inicial de verdad ni cambiar el ajuste de toda la instalación automáticamente.** En nube, además, una instalación puede recibir equipos muy distintos.

### Qué hacen productos maduros

El patrón documentado es preferencia del sistema más ajuste explícito, no clasificación de hardware. Visual Studio Code introdujo `workbench.reduceMotion` con valor predeterminado `auto`, que sigue al sistema, y valores explícitos; Microsoft Office documenta que desactivar animaciones en Windows las desactiva automáticamente en Office y además ofrece control propio en algunas aplicaciones. [VS Code 1.66](https://code.visualstudio.com/updates/v1_66), [Microsoft — Turn off Office animations](https://support.microsoft.com/en-us/office/graphics-visuals/turn-off-office-animations).

Esto no prueba que ningún producto use nunca telemetría adaptativa; sí muestra que el mecanismo público y predecible es una preferencia, no una heurística de CPU.

## 6. Valor por defecto propuesto

**Propuesta para el estado actual: `false` para instalaciones nuevas; `null` mientras se carga la configuración también se interpreta como bloqueado.**

Motivo: todavía no existe una medición válida en el ordenador de tienda objetivo y una detección automática no puede sustituirla. El primer arranque malo no puede desverse. Cuando la familia CSS pase el protocolo en ese hardware, cambiar el valor predeterminado de nuevas instalaciones a `true` será barato; la precedencia del sistema seguirá intacta.

Es una propuesta conservadora, no una conclusión universal. El precedente de VS Code justificaría `auto/sistema` como valor general, pero aquí hay una restricción adicional explícita: equipos comerciales de hasta ocho años aún no medidos.

## 7. Catálogo de técnicas y coste

| Familia | Ejemplos | Tubería dominante | Coste de apagado y mantenimiento |
|---|---|---|---|
| CSS: `transform` y `opacity` | Entradas, salidas, sillares, pequeños desplazamientos. | Normalmente composición; no exige JS por fotograma. | Bajo. Estado final base + atributo ocasional + media query. Primera opción. |
| Web Animations API | Secuencias calculadas con datos, pausa/cancelación coordinada, tiempos creados en ejecución. | Puede usar compositor si solo cambia `transform`/`opacity`; la creación y coordinación viven en JS. | Medio. Debe escuchar la puerta, cancelar `Animation` y finalizar el estado. Sin dependencia. |
| CSS que pinta | `background`, sombras, bordes, gradientes animados, muchas variantes de `clip-path` o filtros. | Repintado y quizá subida de nuevas texturas. | Medio/alto; depende del área en píxeles, no solo del número de nodos. |
| CSS que maqueta | `width`, `height`, `top`, `left`, márgenes, `gap`, tamaño de fuente, pistas de grid. | Recalcular estilo, maquetar, pintar y componer; puede afectar hermanos. | Alto. Sustituir por transformaciones cuando la semántica lo permita. |
| SVG | Trazos o formas complejas. `transform` puede ser barato; filtros y trazos extensos pueden pintar. | Composición o pintura según propiedad y área. | Medio; la puerta CSS funciona, pero la forma estática accesible debe sobrevivir. |
| `requestAnimationFrame` | Canvas, simulación o interacción que cambia cada fotograma. | JavaScript continuo más rasterización/composición. | Alto. Cancelar el identificador, observar cambios y fijar estado final manualmente. |
| Canvas/WebGL | Muchas partículas, 2D/3D o shaders. | Bucle continuo, GPU/CPU, memoria y batería. | Muy alto. Sin semántica propia y fuera de la protección CSS; requiere alternativa DOM. |

Los navegadores pueden manejar `transform` y `opacity` en composición, mientras propiedades que obligan a pintar o maquetar vuelven al hilo principal. Las capas tampoco son gratis: consumen memoria y ancho de banda CPU–GPU, especialmente si son grandes. [web.dev — Why are some animations slow?](https://web.dev/articles/animations-overview), [web.dev — High-performance CSS animations](https://web.dev/articles/animations-guide).

No se propone una biblioteca. CSS, Web Animations y `requestAnimationFrame` cubren estas familias; lo difícil es el contenido y el estado final de cada efecto, que una dependencia no puede decidir.

## 8. ¿Cuántos elementos simultáneos aguanta un equipo modesto?

**Número general encontrado: ninguno defendible.** Un bloque de 60 × 30 px que solo se transforma no cuesta lo mismo que una superficie de pantalla con desenfoque. También importan área total, solapamiento, resolución/DPR, memoria de capas, propiedad animada, navegador, controlador y carga concurrente.

La pared actual ofrece el único número exacto disponible: contiene 23 sillares, pero el escalonado limita la caída a **cinco bloques simultáneos como máximo**; después quedan dos partículas pequeñas. Ese número describe la construcción, no certifica todavía el equipo antiguo.

Se entrega un benchmark paramétrico para obtener el límite real con 1, 2, 4, 8, 16, 32 y 64 elementos, tamaños pequeños y de superficie, y tres familias: composición, pintura y maquetación. El número aceptado debe ser el último escalón que, integrado con el montaje real:

- no produzca tareas largas atribuibles al efecto;
- mantenga el p95 de intervalo de fotograma por debajo de 1,5 veces la mediana de referencia;
- deje menos del 1 % de intervalos por encima de 1,5 veces esa mediana;
- no muestre pérdida visible en la traza de fotogramas;
- conserve margen: se adopta un escalón por debajo del primero que falla.

Hasta ejecutar ese protocolo en el ordenador objetivo, escribir “aguanta 30” sería relleno plausible, no investigación.

## 9. Código entregado

```text
PuertaAnimacionesOcasionales.tsx          Contexto, precedencia y cambio en caliente.
animaciones-ocasionales.css               Salvaguarda CSS duplicada.
EjemploAnimacionOcasionalJS.tsx           Cancelación y estado final con Web Animations.
ejemplo-animacion-css.css                  Patrón CSS de estado final como base.
PuertaAnimacionesOcasionales.harness.tsx  Banco de pruebas sin entrar al producto.
puerta-animaciones-ocasionales.spec.ts     Precedencia, fallo cerrado y corte en caliente.
integrar-pared-con-puerta.diff             Cambio mínimo para pasar la pared por la puerta.
benchmark-concurrencia.html                Matriz configurable de elementos y propiedades.
ejecutar-benchmark-concurrencia.mjs        Medición CDP sin paquete npm nuevo.
```

El `harness` se monta solo en desarrollo en `/__pruebas/puerta-animaciones-ocasionales`. La prueba usa el Playwright ya disponible en el producto; no se añade ninguna dependencia.

Coste de la puerta, sin ejemplos ni pruebas: 2 677 bytes de TSX y 674 bytes de CSS sin minificar; 935 + 364 = **1 299 bytes con gzip** antes de que Vite elimine tipos y minifique. Dependencias nuevas: cero.

## 10. Límites declarados

- No se midió el equipo antiguo: se entrega el protocolo y se mantiene el valor predeterminado conservador.
- No se obtuvo un máximo universal de elementos porque esa cifra no existe desligada de tamaño y propiedad.
- La puerta no decide cómo anima cada efecto; solo informa permiso y motivo.
- La animación JavaScript sigue teniendo una obligación local: cancelar su trabajo y aplicar su estado final. El ejemplo deja ese contrato ejecutable.
- No se escribió ni se leyó código del producto dentro de `C:\SILLAR`.
