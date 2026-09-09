# Cronología conceptual de la conversación

## ETAPA 1 — Contexto y rol

- Se definió SILLAR como plataforma modular para retail/servicios en Perú, React/TypeScript/Vite.
- Se fijó que el trabajo era investigación de diseño, no adopción.
- Panel administrativo, no landing: consistencia y velocidad.
- Reglas: colores por variables, reduced motion, animación no bloqueante, español.

**Resultado:** marco de evaluación y separación entre evidencia/decisión.

## ETAPA 2 — Morphicons, Sileo y Auragradients

- Se investigaron función, peso, dependencias, licencia, build, alternativas y versión manual.
- Sileo tenía el hueco más real por existir `useToasts/Toasts`.
- Morphicons solo podía justificar transiciones semánticas; Auragradients chocaba con la paleta del panel.

**Resultado:** tres informes presentes; las tres candidatas descartadas.

## ETAPA 3 — De paquete a conducta

- El usuario descartó Sileo por licencia ausente del artefacto y animación que retrasa.
- Pidió qué hacía que el sistema propio no hacía.
- Se añadió “Qué vale la pena copiar”: upsert de promesa, deduplicación/contador, pausa por foco+puntero.

**Cambio de dirección:** toda biblioteca se examina por ideas copiables, no solo por adopción.

## ETAPA 4 — Movimiento nativo y carga

- Se encargó reduced motion por defecto, cambios en caliente, View Transitions, `@starting-style`, display transitions, skeleton CSS, dependencias y umbrales con evidencia.
- Más tarde el historial enumera react-loading-skeleton, Motion y AutoAnimate entre descartes.

**Resultado:** conocimiento parcial conservado en conversación; informes actuales ausentes.

## ETAPA 5 — GSAP, Three.js y Liquid Gooey

- Se exigió separar superficie y posibilidad de hornear.
- Three.js debía medirse como motor 3D/bucle; GSAP por licencia y valor sobre nativo; Liquid Gooey como posible técnica SVG.
- Más tarde se afirma nueve evaluadas/nueve fuera.

**Resultado:** descarte conocido, informes no recuperados.

## ETAPA 6 — Recuperación tras apagado

- La laptop se apagó de forma súbita.
- El usuario pidió verificar el punto y continuar.

**Resultado:** el estado posterior dejó archivos de varias entregas, pero probablemente explica algunos huecos actuales.

## ETAPA 7 — Indicador, escala de movimiento y velo

- Se detectó defecto de producción: reduced motion congela el único Spinner.
- Se pidió investigar movimiento esencial, status/live region y prueba Playwright semántica.
- Se propuso/validó escala 120/180/240, salidas más rápidas y opacidad breve bajo reducción.
- Se pidió tokenizar un velo `rgba(26,23,19,.45)`.

**Resultado:** la conversación alude después a una entrega, pero los archivos no están presentes. Requiere recuperación.

## ETAPA 8 — Corrección de ruta

- `SILLAR-DISENO` se movió fuera de `C:\SILLAR`.
- Se estableció prohibición absoluta de escribir en producto.

**Resultado:** ruta vigente `C:\SILLAR-DISENO\investigacion`.

## ETAPA 9 — Fotos del catálogo

- Se investigaron formatos, tamaños, lazy/LCP, CLS y tres estrategias de derivados.
- Se cuantificó mejor/peor caso de 50 productos.
- Se vinculó réplica con cantidad de derivados.

**Resultado:** informe presente; arquitectura no decidida.

## ETAPA 10 — Cómo se ve SILLAR desde fuera

- La estabilidad del slug por WhatsApp reveló posible conflicto con SPA.
- Se estudiaron bots, OG, render público, JSON-LD, canonical, sitemap y navegadores Perú.

**Resultado:** cuatro informes presentes. Estado productivo no confirmado por falta de URL.

## ETAPA 11 — Límites de subida y social

- Se añadió amenaza por dimensiones/frames al decodificar.
- Se evaluaron ImageSharp, Magick.NET y NetVips.
- Se resolvió orientación, metadatos y bucle JPEG <600 KB.
- El usuario resumió que NetVips cae por licencia y dejó ImageSharp/Magick a decisión de JP.

**Resultado:** tres informes presentes; límites y biblioteca aún propuestos.

## ETAPA 12 — Pared de sillares

- Se evaluó login frente a reinicio de módulo.
- Se construyó componente concreto sin abstracción/dependencia.
- Se resolvió salida desde cualquier altura, espera larga, reducción, mensajes reales y pruebas.

**Resultado:** entrega completa como referencia. Benchmark real en PC antiguo no obtenido.

## ETAPA 13 — Puerta para varias animaciones

- Después de terminar la pared se añadió un permiso compartido.
- Se fijó precedencia sistema > instalación y corte en caliente.
- Se rechazó la detección automática fiable de hardware lento.
- Se separó movimiento cotidiano de ocasional.

**Resultado:** provider/hook justificado por segundo caso, CSS, ejemplos, pruebas y benchmark. Parche no aplicado.

## ETAPA 14 — Propuesta visual M01

- El estado actual de archivos muestra creación de listado/detalle de catálogo, cuatro estados, temas y compacto.
- Se consolidaron tokens piedra/azul y componentes de revisión.

**Resultado:** propuesta visual reproducible, sin confirmación de adopción en producto.

## ETAPA 15 — Backup de conocimiento

- Se pidió preservar conversación, archivos, decisiones, descartes, huecos y continuidad fuera de ambos árboles.
- Se inspeccionó `C:\SILLAR-DISENO` solo lectura; no se tocó `C:\SILLAR`.

**Resultado:** este conjunto de documentos.
