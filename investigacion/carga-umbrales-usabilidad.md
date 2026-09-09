# Umbrales de respuesta e indicadores de carga

**Veredicto de investigación: una lista que responde en 200 ms no necesita esqueleto ni spinner; necesita acusar el clic de inmediato y mostrar el resultado. El umbral respaldado para introducir un indicador de espera es aproximadamente 1 segundo, y a partir de 10 segundos se necesita progreso o estimación, además de una salida.**

Fecha de corte: 18 de agosto de 2026.

## Los números utilizables

| Tiempo desde la acción | Lo que cambia para la persona | Feedback respaldado |
|---:|---|---|
| 0–100 ms | Se percibe como respuesta instantánea y manipulación directa. | Reflejar inmediatamente pulsado, selección o estado local; si el resultado llega, no hace falta indicador adicional. |
| 100–1,000 ms | Se nota trabajo, pero normalmente se mantiene el hilo mental. | No mostrar un indicador de carga que vaya a parpadear. Mantener la interfaz estable y entregar el resultado. |
| Más de 1,000 ms | Empieza a sentirse la espera; NN/g recomienda indicar que el sistema trabaja. | Indicador discreto e indeterminado, texto de estado o esqueleto si realmente preserva la estructura. Debe aparecer solo si la operación sigue pendiente. |
| 2–10 s | La atención empieza a desviarse; un spinner en bucle sigue siendo aceptable para esperas relativamente cortas. | Explicar qué se está cargando. No bloquear otras acciones que puedan seguir siendo seguras. |
| 10 s o más | Límite aproximado para mantener la atención en el diálogo. | Progreso determinado o estimación honesta, actividad realizada y forma clara de cancelar o salir. Un bucle sin avance deja de ser suficiente. |

La escala 0.1/1/10 segundos procede de Nielsen, basada en Miller y Card et al. No es una ley física ni distingue por sí sola entre consulta de inventario, cobro o exportación. Miller subrayó que el tiempo tolerable depende de la tarea y situó alrededor de dos segundos la aparición consciente de espera durante una cadena de pensamiento. Una pausa tras cerrar una subtarea se tolera mejor que una pausa en mitad de ella.

El estudio experimental de Nah sobre recuperación de información web encontró una tolerancia aproximada de dos segundos en su contexto y que el feedback prolongaba la espera tolerada. Es evidencia anterior al hardware actual y no establece que toda interfaz deba mostrar un spinner a los dos segundos; refuerza que el silencio y la variabilidad importan.

## Aplicación al caso de 200 ms

Para una lista que suele tardar 200 ms:

- el control debe reaccionar visualmente dentro de 100 ms para confirmar que recibió la acción;
- no se muestra esqueleto ni spinner si el resultado llega en ese intervalo;
- no se impone una duración mínima para que “se vea” el indicador: eso convertiría movimiento en retraso;
- si la latencia tiene cola larga, se arma un timer al iniciar y solo se monta el estado de carga si la petición continúa alrededor de 1,000 ms;
- al terminar antes del umbral, se cancela el timer y el indicador nunca entra al DOM.

```ts
setPending(true)

const showIndicator = window.setTimeout(() => {
  setShowIndicator(true)
}, 1000)

try {
  await loadProducts()
} finally {
  clearTimeout(showIndicator)
  setShowIndicator(false)
  setPending(false)
}
```

Es código del caso, no un `hook`. Solo se generaliza al existir una segunda espera real con la misma política. El valor de 1,000 ms puede acabar siendo un token de política si aparece ese segundo caso.

El fragmento mostrado ocupa **219 B sin minificar / 154 B gzip**. No agrega una dependencia y el timer no retrasa el resultado: solo decide si el indicador llega a montarse.

El ejemplo no serializa peticiones ni resuelve carreras. El consumidor real debe ignorar o cancelar respuestas obsoletas cuando filtros sucesivos se solapan; esa es lógica de datos, no de animación.

## Feedback inmediato no es lo mismo que indicador de espera

NN/g recomienda feedback inmediato desde el momento de la acción, pero también dice que una animación en bucle para menos de un segundo distrae. Las dos afirmaciones son compatibles:

- **Inmediato:** el botón adopta su estado presionado, la fila queda seleccionada o aparece el valor optimista.
- **Tras el umbral:** aparece “Cargando productos” o un esqueleto si todavía no hay respuesta.

No hace falta hacer girar nada para confirmar un clic. En un panel de ocho horas, evitar el flash repetido también reduce fatiga visual.

## Qué indicador corresponde

### Refresco de datos ya visibles

Mantener los datos anteriores, marcar la región con `aria-busy="true"` y dar un estado discreto conserva contexto. Reemplazar toda la tabla por esqueletos puede borrar información que aún era útil. Esta es una inferencia de diseño a partir de visibilidad del estado y estabilidad visual, no un umbral medido específicamente para SILLAR.

### Primera carga sin estructura visible

Un esqueleto puede reservar espacio si representa razonablemente la geometría final. El shimmer es opcional y solo existe bajo `prefers-reduced-motion: no-preference`; la etiqueta “Cargando…” no depende del movimiento.

### Proceso con unidades conocidas

Usar `<progress>` o un progreso determinado, por ejemplo “37 de 100 comprobantes”. Para esperas superiores a 10 segundos, la literatura favorece porcentaje, cantidad realizada o una estimación frente a un spinner infinito.

### Proceso sin total conocido

Un estado indeterminado puede decir qué está ocurriendo. Si rebasa 10 segundos, debe ofrecer información adicional y una vía de cancelación aunque no exista porcentaje fiable. Inventar un porcentaje destruye la utilidad del indicador.

## Accesibilidad y movimiento

- La región que cambia usa `aria-busy`; al finalizar vuelve a `false` para que la tecnología asistiva conozca el estado estable.
- Un indicador determinado prefiere el elemento nativo `<progress>` antes que reconstruir su semántica con ARIA.
- Un esqueleto decorativo queda `aria-hidden="true"`; el estado legible se expresa en español.
- Reducir movimiento no puede ocultar el hecho de que hay trabajo en curso: el texto o el progreso permanecen aunque desaparezca el giro o shimmer.
- Mostrar y ocultar el indicador no bloquea el resultado ni espera a que termine una animación.

## Calidad de la evidencia y huecos

- Los umbrales 0.1/1/10 s son guías consolidadas de percepción y atención, no resultados de una prueba con usuarios de retail peruano ni con SILLAR.
- El estudio de Miller es de 1968 y el de Nah de 2004. Su valor está en los límites cognitivos y en el efecto del feedback, no en representar redes o hardware de 2026.
- **No encontrado:** un estudio de usabilidad primario que fije un umbral universal específico para esqueletos, o que demuestre que 200, 300 o 500 ms sea el punto correcto para mostrarlos en paneles administrativos.
- Por eso, 1,000 ms es el umbral defendible para iniciar un indicador; la distribución real p50/p95 de cada operación y una prueba con usuarios pueden ajustarlo sin convertir 200 ms en una espera artificial.

## Fuentes

- [Nielsen Norman Group: los límites de 0.1, 1 y 10 segundos](https://www.nngroup.com/articles/response-times-3-important-limits/)
- [Nielsen Norman Group: indicadores después de 1 s, bucle 2–10 s y progreso desde 10 s](https://www.nngroup.com/articles/progress-indicators/)
- [Robert B. Miller (1968): *Response Time in Man-Computer Conversational Transactions*](https://yusufarslan.net/sites/yusufarslan.net/files/upload/content/Miller1968.pdf)
- [Fiona Fui-Hoon Nah (2004): *A Study on Tolerable Waiting Time*](https://doi.org/10.1080/01449290410001669914)
- [MDN: `aria-busy`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)
- [MDN: rol `progressbar` y preferencia por `<progress>`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/progressbar_role)
