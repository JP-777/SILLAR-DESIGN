# Reglas y convenciones de SILLAR Diseño

## Autoridad y límites de escritura

1. No escribir dentro de `C:\SILLAR` bajo ningún concepto, ni temporales ni ejemplos.
2. Investigación y propuestas pertenecen a `C:\SILLAR-DISENO`; integración la realiza otro agente.
3. Si un encargo parece pedir tocar el producto, tratarlo como error del encargo y señalarlo.
4. No instalar dependencias sin preguntar.
5. Investigar no es decidir. Usar “propuesto” hasta confirmación explícita.
6. No hacer commits, push, merges ni cambios de ramas desde esta línea de trabajo.

## Evaluación de dependencias

Cada informe comparable debe responder:

```text
QUÉ RESUELVE       Algo que no pueda hacerse razonablemente sin ella
DÓNDE VIVIRÍA      Panel · tienda pública · ninguna
¿SE PUEDE HORNEAR? Sí/No y por qué
QUÉ PESA           Tamaño real tras empaquetar/importar
QUÉ CUESTA CORRER  CPU, batería y hardware modesto
QUÉ ARRASTRA       Dependencias transitivas
LICENCIA           Tipo y texto dentro del artefacto publicado
REDUCED-MOTION     Por defecto, opcional o inexistente
SIN ELLA           Coste de lograr lo mismo o el 80 %
```

Si “sin ella” cuesta pocas decenas de líneas, termina ahí: no es dependencia. Una licencia solo en el repositorio o enlazada no cumple el criterio comercial.

## Abstracciones y componentes

- No crear hooks, providers o frameworks para un único uso.
- Generalizar al aparecer un segundo caso real y solo la parte demostrablemente común.
- La puerta de animaciones es un ejemplo válido: comparte permiso, no la maquinaria.
- Mensajes, errores y labels son texto real en español.
- Mensajes de progreso deben corresponder a una fase real, nunca rotar por temporizador fingiendo avance.

## Colores y temas

- Los componentes solo consumen variables CSS del sistema de diseño.
- Prohibidos hex, rgb, rgba o nombres de color dentro del componente.
- Los valores literales se concentran en el archivo de tokens y se validan.
- Cualquier color nuevo exige contraste y revisión de daltonismo.
- No inferir que un mismo velo sirve en claro y oscuro; medir/separar si hace falta.
- Panel: identidad SILLAR. Público: puede usar identidad del cliente.

## Movimiento

- Una animación nunca retrasa la acción.
- La carga controla el final de la animación, no al revés.
- No mostrar indicador por debajo de un segundo.
- El contenido/estado debe sobrevivir sin movimiento.
- `prefers-reduced-motion` se impone en CSS base para cubrir por defecto todas las animaciones CSS.
- CSS no protege animaciones ejecutadas por JS. Esas escuchan `matchMedia` y el evento `change`, cancelan y aplican estado final.
- La preferencia del sistema siempre gana al ajuste de la instalación.
- El ajuste de instalación desactiva el movimiento ocasional, no las microtransiciones diarias; la preferencia del sistema sí puede reducir ambas.
- Al desactivar en caliente se corta el efecto; no se deja terminar.
- Todo efecto debe tener un estado final estático seguro.
- Propiedades preferidas: `transform` y `opacity`. Evitar animar geometría/layout y filtros grandes sin medición.
- `linear` solo en bucles. Movimiento prolongado debe poder detenerse.

Escala cotidiana decidida:

| Rol | Entrada | Salida |
|---|---:|---:|
| control | 120 ms | 120 ms |
| mensaje | 180 ms | 120/160 ms según rol final |
| superficie | 240 ms | 160 ms |

Curvas: entrada `cubic-bezier(.2,0,.4,1)`, salida `cubic-bezier(.4,0,1,1)`.

## Accesibilidad

- Foco visible: outline de 2 px en color primario y offset 2 px; no eliminar outline sin equivalente.
- Errores asociados con campo y explicación concreta; usar `aria-invalid` y `aria-describedby`.
- Diálogos con rol correcto, nombre accesible, modal, trampa/restauración de foco y Escape.
- Un spinner visual no basta. El estado de espera necesita texto/rol/región apropiada y no debe anunciarse repetidamente.
- Toasts/avisos usan región educada (`polite`) y deben considerar foco/tiempo.
- Contenido inactivo atenuado conserva legibilidad y semántica.
- La automatización de contraste no detecta que un spinner quieto parece colgado; escribir pruebas del significado, no solo píxeles.

## Responsive y superficies

- Separar siempre panel/mostrador y tienda pública al recomendar.
- Separar nube e instalación local al analizar coste.
- En móvil reducir columnas, no reducir información esencial.
- Reservar proporciones conocidas para imágenes: cuadrado en rejilla, 16:9 en ficha.
- No asumir ancho/DPR; derivar `srcset` del layout real.
- Tecnologías modernas pueden ser mejora progresiva: la ausencia de soporte quita efecto, no función.

## UX de estados

- Vacío: explicar qué falta y dar una acción concreta; no mostrar controles inútiles.
- Carga: no inventar nombre, conteo o avance; conservar estabilidad espacial.
- Error/conflicto: decir qué impide la acción, con qué elemento choca y qué puede hacer la persona.
- Desactivación: explicar consecuencias y conservar reversibilidad cuando exista.
- Acción destructiva: nombre específico, confirmación proporcionada y sin ambigüedad.
- Datos incómodos (sin barras, precio a consultar, múltiples variantes, dados de baja) se diseñan, no se esconden en demos perfectas.

## Imágenes

- Subida ya restringida a 5 MB, contenido real validado, SVG rechazado y nombre generado UUID v7.
- El límite codificado no sustituye límites de dimensiones, píxeles, memoria y frames antes de decodificar.
- Autoorientar antes de recortar; convertir a sRGB antes de retirar perfil.
- Retirar metadatos sensibles de derivados.
- No lazy para LCP/primer viewport; prioridad alta solo para candidata LCP.
- Derivados y réplica se diseñan juntos: cada archivo guardado puede viajar entre nodos.
- No requerir servicios externos para que funcione la instalación local.

## Criterios de aceptación de investigación

- Veredicto al principio, no escondido al final.
- Citar fuentes primarias/actuales cuando la materia cambia.
- Medir bundle publicado, no tamaño del escaparate.
- Declarar “no encontrado” ante un hueco; no rellenar con plausibilidad.
- Entregar código concreto, prueba y protocolo cuando el encargo lo pide.
- Una prueba valiosa afirma la propiedad del producto: “el panel no espera”, “el mensaje sigue”, “el sistema gana”; no solo que existe una clase CSS.
