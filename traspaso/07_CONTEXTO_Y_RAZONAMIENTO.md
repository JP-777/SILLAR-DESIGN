# Contexto y razonamiento expresado

> Este archivo registra motivos y feedback visibles en la conversación. No contiene razonamiento privado interno.

## Por qué existe este trabajo separado

SILLAR-DISENO se convirtió en un espacio externo porque diseño e investigación no deben entrar al producto por accidente. Ya ocurrió una escritura en la ruta antigua dentro del repositorio tras un movimiento no comunicado; una regla de Git evitó consecuencias. El aprendizaje fue establecer separación física como primera barrera y Git como segunda.

El agente no conocía todas las restricciones del producto. Por eso el usuario repitió que una recomendación general razonable puede estar prohibida aquí: el rol correcto es aportar evidencia comparable, no adoptar.

## Qué clase de producto se está diseñando

El panel no es una landing. Una persona lo usa muchas horas en el ordenador disponible en una tienda, no necesariamente moderno. Eso desplaza la estética desde “sorpresa” hacia continuidad, jerarquía estable y fatiga baja.

La tienda pública sí es un escaparate, pero su restricción dominante son móviles y datos. El atractivo visual no puede ocultar que las fotos deciden tanto la percepción como el peso.

Este contraste explica varias decisiones:

- iconos animados autónomos y fondos 3D pueden tener sentido promocional, pero cansar o consumir recursos en el panel;
- un efecto público no interactivo suele poder hornearse;
- una recomendación sin superficie no sirve;
- un servicio externo no puede ser supuesto base porque la instalación local comparte código.

## El significado de SILLAR

Un sillar es piedra labrada y Arequipa está construida con ella. La pared de bloques no nació como adorno genérico: explica el nombre del producto mientras el sistema se reconstruye. Esa justificación permitió explorar carácter propio sin relajar la regla de no inventar esperas.

El mejor momento resultó la activación de módulos: el reinicio ya ocurre y hoy había una barra muda. En login, la misma idea solo es legítima si la medición real supera el umbral. “Bonito” no concede permiso para hacer esperar.

## Preferencias repetidas por JP/usuario

- Quiere rescatar la idea de una biblioteca, no necesariamente su paquete.
- Prefiere un “no encontrado” honesto a una conclusión plausible.
- Quiere el veredicto al principio para decidir, no una introducción pedagógica larga.
- Le importa que la licencia sea físicamente señalable en lo que se vende.
- No quiere abstracciones anticipadas ni dependencias por comodidad superficial.
- Valora el carácter propio, pero exige poder apagarlo en equipos modestos.
- Exige mensajes concretos y verdaderos, no “ha ocurrido un error” ni progreso teatral.

## Evolución del criterio de bibliotecas

La primera ronda parecía una comparación de efectos. Sileo cambió el objetivo: al descartarse el paquete, el usuario preguntó qué hacía mejor que `useToasts/Toasts`. Desde entonces cada investigación debía extraer dos o tres conductas valiosas y mostrar cómo hacerlas a mano.

La licencia también dejó de ser una nota legal al final. El caso Sileo mostró que “MIT en el repositorio” no basta si el artefacto carece del texto. El mismo criterio tumbó a GSAP según el historial y después a NetVips, aunque técnicamente era atractivo. La consistencia del criterio fue deliberada.

## Movimiento como información, no ceremonia

El defecto del Spinner enseñó que apagar todo movimiento indiscriminadamente también puede borrar comunicación. La formulación del requisito fue clave: con movimiento reducido la interfaz debe seguir diciendo que espera; girar es solo una de las formas.

La pared generalizó la misma doctrina: los mensajes comunican y los bloques refuerzan. Con reducción quedan mensajes y composición estática. La prueba importante no debe mirar si existe una animación, sino si la persona todavía recibe el estado.

El añadido de varias animaciones separó dos clases:

- cotidiana: feedback breve de 120/180/240 ms, parte de la continuidad del panel;
- ocasional: expresiva, larga, contextual y desactivable por instalación.

El usuario advirtió que quitar las microtransiciones de diálogo no hace el producto más rápido sino más brusco. La puerta por instalación se diseñó para el carácter ocasional, mientras `prefers-reduced-motion` conserva autoridad global.

## Razón de la escala visual

Los tiempos sueltos hacen que cada una de seis pantallas invente su propio lenguaje. Se prefirieron tres roles nombrados por uso, no números. Salir más rápido que entrar reduce sensación de bloqueo: retirar algo suele ser una confirmación, introducirlo requiere orientación.

La propuesta de opacidad corta bajo reduced motion buscaba evitar que cambios instantáneos obligaran a buscar qué cambió, pero el artefacto final no se recuperó. Debe revalidarse, no asumirse.

## Catálogo: diseñar los casos incómodos

El tablero M01 usa datos inventados de una librería/bazar y deliberadamente incluye lo que las demos suelen omitir: un producto sin barras, uno con precio a consultar, tres variantes distinguidas solo por código y un dado de baja.

La jerarquía nace de esa realidad:

- el listado permite reconocimiento y edición rápida;
- el compacto apila la información esencial en vez de comprimir columnas ilegibles;
- el detalle no menciona variantes antes de existir;
- carga no inventa nombre/estado;
- conflictos dicen exactamente qué consecuencia o choque existe.

## Fotografías: bytes antes que moda

El usuario formuló “un catálogo es fotos”. La investigación evitó recomendar AVIF/WebP por reputación y midió imágenes reales. Ver WebP peor que JPEG en una muestra confirmó que formato sin tamaño correcto no resuelve el problema.

La réplica hizo que una recomendación habitual —generar cuatro derivados— tuviera un coste arquitectónico oculto: cuatro archivos viajan. Por eso el informe presenta tres estrategias sin elegir y une la decisión al rol de la instalación local.

El hard cap social de 600 KB también cambió la forma de pensar: no es una calidad, sino un bucle de codificar y medir. Esto puede justificar generar ese derivado al subir incluso si otros se generan de otra manera, pero sigue siendo una inferencia para decidir, no decisión.

## Compartir por WhatsApp como flujo de primer nivel

La especificación protege slugs estables porque los enlaces se comparten por WhatsApp. Eso reveló una posible contradicción: proteger la URL no sirve si todas las tarjetas se ven iguales. La respuesta correcta fue no diagnosticar desde “React + Vite”, sino establecer una prueba del HTML inicial.

La investigación también separó la tarjeta de compartir del SEO completo. Inyectar un head específico puede resolver el primero sin SSR total; body renderizado, status, sitemap y datos visibles son trabajo adicional.

## Preferencias visuales no recuperadas

No hay feedback explícito conservado sobre gustos de sidebar, dashboard, navegación global, tipografías alternativas, logos o composiciones fotográficas. La propuesta M01 permite inferir sobriedad, pero no debe usarse para fabricar decisiones que no se expresaron.
