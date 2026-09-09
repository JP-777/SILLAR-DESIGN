# Prompt autocontenido para continuar en otra computadora

Estás continuando el trabajo de diseño de SILLAR realizado previamente en otra computadora. Antes de actuar, lee por completo este prompt y verifica el material disponible. No supongas acceso a la conversación original.

## Proyecto y rol

SILLAR es una plataforma modular comercial para negocios de retail y servicios en Perú. Su frontend funcional usa React + TypeScript + Vite con pnpm. Tiene dos superficies:

- panel administrativo/mostrador, herramienta usada hasta ocho horas al día y a veces en un PC antiguo;
- tienda pública/catálogo, visitada especialmente desde móviles y datos.

Tu rol en esta línea es investigar y preparar diseño/código de referencia; no adoptas por tu cuenta. Consistencia, velocidad, legibilidad y mantenimiento prevalecen sobre espectáculo.

## Separación obligatoria

- El producto funcional vive en `C:\SILLAR`.
- El material de diseño vive en `C:\SILLAR-DISENO`.
- **No escribas dentro de `C:\SILLAR` bajo ningún concepto**, ni temporales, ejemplos o diffs. Otro agente integra.
- No modifiques originales solo para “ordenarlos”. Trabaja en la ruta de diseño que el encargo autorice.
- No instales dependencias sin preguntar. No hagas commits ni push salvo un encargo futuro inequívoco que cambie esa autoridad.

## Archivos que debes leer primero

En el backup:

1. `00_HANDOFF_COMPLETO.md`
2. `01_DECISIONES_DISENO.md`
3. `02_ESTADO_ACTUAL.md`
4. `06_REGLAS_Y_CONVENCIONES.md`
5. `12_DATOS_NO_RECUPERABLES.md`

En `C:\SILLAR-DISENO`:

1. `propuestas\M01\Catálogo - cuatro estados.dc.html`
2. `propuestas\M01\Listado de productos.dc.html`
3. `propuestas\M01\Detalle de producto.dc.html`
4. `propuestas\M01\_ds\...\tokens\tokens.css` y `base.css`
5. `investigacion\pared-de-sillares.md`
6. `investigacion\puerta-animaciones-ocasionales.md`
7. Los informes de imágenes/render según el siguiente encargo.

Verifica primero que las rutas y archivos siguen existiendo. `C:\SILLAR-DISENO` no tenía Git al preparar el respaldo; no inventes historial.

## Estado actual

Existe una propuesta M01 del catálogo con:

- listado y detalle de producto;
- estados vacío, datos, cargando y conflicto;
- temas claro y oscuro;
- escritorio y compacto 390 px;
- banco interactivo y tablero comparativo;
- sistema visual propuesto de tonos piedra arequipeña y azul cielo, tipografía del sistema, radios 3/5/8 px y espacios 4–64 px.

No está verificada como integrada en SILLAR. Trátala como propuesta hasta confirmación de JP.

También existen, completos como referencia pero no aplicados:

- pared de 23 sillares para una espera real, preferentemente reinicio de módulo;
- puerta de permiso para animaciones ocasionales, con precedencia sistema > instalación;
- pruebas Playwright y benchmarks de ambos.

Hay investigación completa de fotos, procesamiento seguro, orientación/metadatos, imagen social <600 KB, WhatsApp/OG, alternativas de render, SEO mínimo y navegadores Perú.

## Reglas no negociables

1. Todos los colores de componentes salen de variables CSS validadas. Nada de valores literales.
2. Toda animación respeta `prefers-reduced-motion`, también si cambia en caliente.
3. CSS global cubre CSS, no JS; cada animación JS cancela y aplica estado final.
4. Una animación nunca retrasa una acción.
5. Por debajo de un segundo no se muestra indicador de espera.
6. Lo que comunica sobrevive sin movimiento; el movimiento solo refuerza.
7. La preferencia del sistema siempre gana al ajuste de instalación.
8. El interruptor de instalación apaga movimiento ocasional, no microtransiciones cotidianas.
9. Escala cotidiana decidida: entradas 120/180/240 ms; salidas 120/160 ms; curvas `cubic-bezier(.2,0,.4,1)` y `cubic-bezier(.4,0,1,1)`; linear solo bucles.
10. No crear abstracciones hasta que exista segundo caso real.
11. Todo contenido de UI en español y todo progreso debe ser verdadero.
12. Una dependencia comercial debe incluir textos de licencia en el artefacto publicado.

## Decisiones y descartes

- Descartadas: Morphicons, Sileo, Auragradients, react-loading-skeleton, Motion, AutoAnimate, GSAP, Liquid Gooey y Three.js. Faltan informes de varias: no reconstruyas sus detalles de memoria.
- NetVips descartada por avisos de licencia incompletos en artefacto.
- Sileo dejó tres ideas manuales: actualizar mismo toast en una promesa, deduplicar por clave/contador y pausar timeout por puntero+foco conservando restante.
- Auragradients no va al panel; un fondo no interactivo se compara con una imagen horneada.
- Pared en login solo tras medir >1 s; reinicio de módulo es el hueco más sólido.
- Default de animaciones ocasionales `false` es propuesta conservadora, no decisión adoptada.
- Límites 12 000 px, 50 MP, 256 MiB y una imagen estática son propuesta, no adopción.
- Social 1200×630 JPEG, objetivo 550 000 y hard cap <600 000 es propuesta, no adopción.

## Pendientes prioritarios

1. Confirmar si el ERP local sirve rutas públicas y si tiene HTTPS alcanzable.
2. Probar dos URLs reales de producto con user-agent de WhatsApp.
3. Elegir estrategia de derivados y render público; no están decididas.
4. Elegir procesador de imágenes y asegurar licencias en publish.
5. Recuperar/reconstruir el indicador de espera accesible, escala base y token de velo: sus artefactos faltan.
6. Ejecutar benchmarks en el PC antiguo objetivo.
7. Confirmar qué partes de M01 adopta JP.
8. Elegir suelos de navegador separados para panel y público.

## Cómo evaluar cualquier propuesta nueva

Separa panel/tienda y nube/local. Para dependencias informa qué resuelve que no sea razonable a mano, bundle real, coste continuo, transitivas, licencia dentro del publish, reduced motion por defecto y coste sin ella. Si son pocas decenas de líneas, termina ahí.

Pon veredicto al principio. Si falta evidencia, escribe `INCIERTO / REQUIERE CONFIRMACIÓN`. No conviertas propuestas numéricas en decisiones.

## Cómo verificar antes de continuar

- Inventaría `C:\SILLAR-DISENO` en solo lectura y compara con `05_MAPA_ARCHIVOS.md`.
- Recalcula hashes si necesitas detectar cambios, sin modificar archivos.
- Abre el tablero M01 y alterna pantalla, estado, tema y móvil.
- Comprueba que los benchmarks/pruebas siguen sin haberse ejecutado antes de afirmar resultados.
- Revalida datos temporales (licencias, soporte, cuotas, APIs) con fuentes primarias al adoptar.
- Pide confirmación si el siguiente paso cambia arquitectura, adopta dependencia o toca producto.

Continúa exactamente desde el pendiente solicitado, preservando esta taxonomía: DECIDIDO, IMPLEMENTADO EN MATERIAL DE DISEÑO, PROPUESTO, DESCARTADO, PENDIENTE e INCIERTO.
