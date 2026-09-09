# Descartes, experimentos y cambios de dirección

## Listón aprendido

Cuatro motivos se consolidaron como descarte suficiente:

1. ignorar `prefers-reduced-motion` por defecto o consultarlo solo al iniciar;
2. retrasar la acción para completar movimiento;
3. no llevar el texto completo de la licencia en el artefacto publicado;
4. envolver unas pocas líneas de CSS/JS en una dependencia.

## Dependencias y técnicas

### Morphicons — DESCARTADO

- Era un conjunto de iconos SVG animados para transformar entre estados.
- Medición conservada: aproximadamente 8 191 bytes gzip para la importación evaluada.
- Licencia MIT incluida en el artefacto.
- Problema: `reducedMotion` no quedaba seguro por defecto; el uso plausible eran transiciones semánticas puntuales, no movimiento continuo.
- Sustitución: superponer dos SVG y animar opacidad/escala con CSS bajo variables y media query; menos de 1 KB y pocas decenas de líneas.
- No repetir: no reabrirlo para decorar iconos del panel.

### Sileo — DESCARTADO

- Hueco real: se comparó con `useToasts/Toasts` existente.
- Motivos definitivos expresados por el usuario: artefacto publicado sin texto de licencia y animación que retrasa la acción.
- Ideas rescatadas sin paquete:
  - actualizar el mismo ID durante una promesa;
  - deduplicar por clave semántica y contar repeticiones;
  - pausar expiración tanto por puntero como por foco, conservando tiempo restante.
- Ideas que no valen la pena copiar: morph gooey, arrastre, seis posiciones, apilado propio de Sileo y acción escondida.

### Auragradients — DESCARTADO PARA PANEL

- No se encontró una biblioteca inequívoca con ese nombre; se investigó la técnica de varios gradientes radiales.
- Choca con una paleta validada: un gradiente también es color.
- Se puede escribir en menos de diez líneas y, si no reacciona, hornear como imagen.
- Único hueco plausible: superficie pública o pantalla de instalación; nunca herramienta de ocho horas.

### react-loading-skeleton, Motion y AutoAnimate — DESCARTADOS

- El historial los enumera entre seis descartes.
- Informes no recuperados. No atribuir peso/licencia/causa individual sin repetir investigación.
- Solo puede afirmarse que el conjunto fue filtrado por el listón de movimiento/licencia/tamaño manual.

### GSAP, Liquid Gooey y Three.js — DESCARTADOS

- El encargo exigía distinguir panel/tienda, ejecución/horneado, coste, licencia y reduced motion JS.
- Un mensaje posterior dice “nueve bibliotecas evaluadas y nueve descartadas”, incluyendo estas candidatas.
- Los informes no están en la carpeta actual. Los detalles concretos deben marcarse como perdidos.
- Principios que sí sobreviven del encargo: Three.js es un motor 3D con bucle, no una simple biblioteca de animación; un fondo no interactivo debe compararse contra imagen horneada; Liquid Gooey probablemente es filtro SVG/CSS; GSAP debía compararse contra View Transitions y transiciones nativas. No convertir estas preguntas en conclusiones técnicas.

### Décima candidata — INCIERTO

El encargo posterior afirma “van diez evaluadas y diez fuera”, pero el registro accesible solo identifica nueve con claridad. No inventar el nombre.

### NetVips — DESCARTADO BAJO CRITERIO DE DISTRIBUCIÓN

- Técnicamente resultó ligero y eficiente.
- El artefacto NuGet inspeccionado no contenía textos completos de todas sus licencias, solo referencias/enlaces.
- Se aplicó el mismo criterio usado con Sileo y GSAP: no hacer excepción por conveniencia técnica.

## Experimentos de movimiento

### Pared como bienvenida fija de tres segundos — DESCARTADA

- Si login termina en 400 ms y la pared dura tres segundos, la animación fabrica espera.
- Solución: umbral >1 s, sin duración mínima, y salida desde cualquier altura.

### Pared en activación de módulo — PROPUESTA PREFERENTE

- Aquí el reinicio existe y ya había un overlay/barra sin información.
- La metáfora “se reconstruye el sistema / se reconstruye la pared” es literal.
- No se ha adoptado: falta medición e integración por otro agente.

### Terminar animación antes de habilitar panel — DESCARTADO

- El panel se habilita y la capa pierde `pointer-events` al llegar el estado real.
- La salida visual no es una promesa que deba esperar la aplicación.

### Cortar pared a media altura — DESCARTADO

- Se reemplazó por capturar el transform calculado y elevar/desvanecer el conjunto desde cualquier progreso.

### Bucle evidente durante espera larga — DESCARTADO

- Se usaron solo dos motas con periodos distintos y control de detener; los mensajes reales sostienen la comunicación.

### Autodetección de hardware lento — DESCARTADA COMO VERDAD

- `hardwareConcurrency` cuenta procesadores lógicos; `deviceMemory` es aproximado y poco disponible; renderer WebGL/WebGPU y batería/red no dan un índice comparable.
- Medir frames después de empezar permite telemetría futura, pero la mala primera experiencia ya ocurrió.
- Alternativa propuesta: ajuste explícito y valor predeterminado conservador.

### Abstraer una maquinaria de animación — DESCARTADO

- Con la pared como primer caso no se creó framework ni hook genérico.
- Al aparecer varias animaciones se compartió solo la puerta de permiso; cada técnica conserva implementación local.

## Experimentos de imagen

### “WebP siempre pesa menos” — REFUTADO EN LA MUESTRA

- Mochila 480 px: JPEG 42 136 B, WebP 42 096 B, AVIF 38 999 B.
- Zapato 480 px: JPEG 24 392 B, WebP 29 796 B (+22.2 %), AVIF 20 737 B.
- Zapato 320 px: JPEG 14 938 B, WebP 17 770 B (+19 %), AVIF 14 684 B.
- Lección: medir corpus real; el tamaño correcto puede importar más que el formato.

### Generar cuatro tamaños por costumbre — RECHAZADO COMO SUPUESTO

- Los anchos se derivan de ranura×DPR y se deduplican.
- En la rejilla estudiada probablemente bastan 2–3, pero no se cerró conjunto.

### Lazy en todas las imágenes — DESCARTADO

- Empeora LCP si alcanza el primer viewport.
- Patrón: LCP eager + alta prioridad; otras visibles eager/auto; lazy debajo.

### Solo `aspect-ratio` — INSUFICIENTE COMO ÚNICA BARRERA

- La proporción del contenedor reserva layout.
- `width`/`height` del recurso aportan proporción intrínseca y resiliencia adicional.

### Límite de 5 MB como defensa total — REFUTADO

- Un archivo pequeño puede declarar millones de píxeles o muchos frames y explotar memoria al decodificar.
- Surgieron límites de lado, píxeles, memoria y una imagen estática.

### Calidad JPEG fija para 600 KB — DESCARTADA

- El contenido determina entropía/peso.
- Se sustituyó por codificar, medir y ajustar, con objetivo por debajo del hard cap.

### AVIF obligatorio — NO ADOPTADO

- Ahorro de la muestra: 1.7–15 %.
- ImageSharp no lo soportaba en la versión estudiada; perder AVIF puede costar menos que complejidad/licencia, pero no se decidió.

## Experimentos de arquitectura pública

### “React + Vite implica tarjetas rotas” — NO ACEPTADO COMO HECHO

- Es una sospecha comprobable, no una conclusión.
- La prueba correcta compara el HTML inicial de dos slugs reales.

### “Añadir meta tags en React basta” — DESCARTADO SI EL BOT NO EJECUTA JS

- Los datos deben estar en la respuesta inicial para bots de mensajería.

### SSR completo como única salida — DESCARTADO COMO FALSA DICOTOMÍA

- Inyección de head por URL puede resolver tarjetas y metadatos sin hidratar todo.
- No resuelve por sí misma contenido del body, status o sitemap.

### Servicio externo/CDN obligatorio — DESCARTADO COMO BASE

- Rompe la instalación local si no hay servicio equivalente.
- Puede documentarse como opción separada, nunca como supuesto silencioso.

## Cambio de ruta de trabajo

- Los primeros informes se escribieron por error en `C:\SILLAR\SILLAR-DISENO\investigacion` porque la carpeta había sido movida sin avisar.
- Una protección Git evitó que entraran al producto.
- Desde entonces la regla es `C:\SILLAR-DISENO\investigacion` y prohibición absoluta de escribir en `C:\SILLAR`.
- La carpeta actual ya está fuera y no contiene Git.
