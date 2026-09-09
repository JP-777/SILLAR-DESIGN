# Escenarios de soporte de navegadores en Perú

**Veredicto — La cuota peruana exige probar Chromium, Safari móvil y Firefox/Edge de escritorio; no permite calcular cuántas personas excluiría una versión mínima porque StatCounter publica una cola de versiones incompleta y SILLAR no tiene analítica propia. Hay tres suelos defendibles con costes distintos: capacidades modernas uniformes, el objetivo predeterminado de Vite actual, o alcance ESM amplio. No se selecciona uno.**

Fecha de consulta: 18 de agosto de 2026.

## La fotografía disponible

StatCounter, julio de 2026, tráfico web observado en Perú:

| Superficie | Chrome | Edge | Safari | Firefox | Opera | Brave | Otros relevantes |
|---|---:|---:|---:|---:|---:|---:|---:|
| Escritorio + móvil | 78,18 % | 6,58 % | 5,42 % | 3,73 % | 2,74 % | 2,17 % | resto 1,18 % |
| Escritorio | 77,06 % | 9,55 % | 1,24 % | 5,34 % | 3,63 % | 2,32 % | resto 0,86 % |
| Móvil | 80,37 % | — | 14,43 % | 0,42 % | 0,83 % | 1,88 % | Samsung Internet 1,41 %; resto 0,18 % |

Lectura para SILLAR:

- **Tienda pública:** Safari no es prescindible: representa 14,43 % del tráfico móvil medido. Chrome domina, pero ese nombre mezcla muchas versiones y WebViews Android.
- **Panel/mostrador:** Edge y Firefox pesan más en escritorio que en el total. Un soporte probado solo en Chrome no representa el ordenador de tienda.
- **Hardware viejo no equivale automáticamente a navegador viejo.** Un equipo de ocho años con Windows 10/Linux puede ejecutar un navegador actual; Windows 7/8 sí impone techos. Chrome y Edge 109 fueron sus últimas versiones. Firefox 115 ESR sigue siendo la última rama disponible en Windows 7/8/8.1 y Mozilla anunció actualizaciones hasta marzo de 2027, sujetas a reevaluación.
- Soportar un navegador retenido por un sistema operativo sin soporte también acepta un riesgo de seguridad. Google recuerda que Chrome 109 ya no recibe actualizaciones; Microsoft terminó el soporte de Windows 7/8.1. Esto importa más en un producto comercial que maneja ventas.

StatCounter mide páginas que incorporan su contador; no es un censo y no identifica clientas de SILLAR. Su cuota por marca no dice qué porcentaje usa Chrome 109, Safari 16 o un WebView antiguo. La tabla de versiones de Perú solo expone las principales y agrupa/omite la cola. Por eso no se convierte una cuota de marca en una falsa cifra de exclusión por versión.

## Escenario A — suelo de capacidades modernas uniformes

**Versiones de referencia:** Chrome/Edge 121+, Firefox 132+, Safari/iOS 17.5+.

No es “últimas dos versiones”; es un suelo estable por las capacidades aquí discutidas:

- AVIF en los cuatro motores de referencia: Edge fue el último en incorporarlo, en 121.
- `fetchpriority` para imágenes: Chrome 101, Firefox 132 y Safari 17.2.
- `@starting-style`: Chrome/Edge 117, Firefox 129, Safari 17.5.
- `transition-behavior: allow-discrete`: Chrome/Edge 117, Firefox 129, Safari 17.4.

**Qué permite:** menos bifurcaciones para imágenes y CSS moderno; las técnicas anteriores pueden tratarse como soporte base. Aun así, View Transitions no queda garantizado por este suelo: el soporte de la variante SPA llegó bastante después a Firefox y Safari, de modo que sigue siendo mejora progresiva.

**Qué sigue necesitando respaldo:** JPEG/WebP puede seguir siendo conveniente por clientes embebidos, imágenes compartidas con rastreadores y política de producto; el suelo del navegador no controla WhatsApp. Las transiciones nunca deben ser requisito funcional.

**A quién deja fuera:**

- Chrome/Edge 109 de Windows 7/8/8.1 y Edge 110–120.
- Firefox 115 ESR de esos sistemas.
- iPhone/iPad retenido antes de iOS 17.5 y Safari de macOS anterior.
- WebViews y navegadores integrados no equivalentes a esas versiones.

**Cuántas personas deja fuera en Perú:** **no encontrado**. La cuota regional por versión necesaria no está completa y no hay telemetría SILLAR.

**Coste de mantenimiento:** bajo entre los tres escenarios; menos respaldos de código, pero mayor coste comercial si una tienda vieja queda fuera. Exige una pantalla de incompatibilidad y un procedimiento de actualización si el producto local se instala en equipos no conformes.

## Escenario B — objetivo predeterminado del Vite actual

**Versiones de referencia de la documentación Vite consultada:** Chrome 111+, Edge 111+, Firefox 114+, Safari/iOS 16.4+ (`baseline-widely-available` del major actual).

La versión de Vite de SILLAR no se inspeccionó. Los objetivos predeterminados cambian entre versiones mayores; por tanto, “usar el valor por defecto” sin fijar la versión no es una política de soporte duradera.

**Qué permite:** módulos ES modernos, `import.meta`, importación dinámica y el bundle normal de Vite sin rama legacy. Incluye Firefox 115 ESR en términos de versión de motor.

**Qué no permite asumir de forma uniforme:**

- AVIF, porque Edge no lo tuvo hasta 121: `<picture>` necesita respaldo si la imagen debe aparecer en Edge 111–120.
- `fetchpriority`, porque Firefox no lo tuvo hasta 132.
- `@starting-style`/transiciones discretas, por los mínimos 117/129/17.4–17.5.
- View Transitions; se usa con detección y ausencia de animación como respaldo.

**A quién deja fuera:** Chrome/Edge 109 de Windows 7/8/8.1; Safari/iOS anterior a 16.4; Firefox anterior a 114; WebViews viejos. Puede conservar Firefox 115 ESR en Windows antiguo, aunque la plataforma subyacente siga fuera de soporte de Microsoft.

**Cuántas personas deja fuera en Perú:** **no encontrado** por la misma limitación de versiones. En los datos agregados, las marcas cubiertas representan casi todo el tráfico; eso no prueba que sus versiones cumplan el mínimo.

**Coste de mantenimiento:** medio. Un solo bundle moderno, más mejora progresiva y respaldos concretos de formato/estilo. Las pruebas deben incluir los mínimos declarados, no solo los navegadores instalados en desarrollo.

## Escenario C — alcance ESM amplio / equipos antiguos

**Límite técnico mínimo publicado por el Vite actual al bajar `build.target`:** Chrome 64+, Firefox 67+, Safari 11.1+, Edge 79+. Vite aclara que solo transforma sintaxis y no aporta *polyfills* generales. Para navegadores sin ESM ofrece `@vitejs/plugin-legacy`, que sería una dependencia/configuración adicional y no está autorizada por este informe.

Este no es un suelo listo para copiar: es el borde máximo de alcance que la herramienta declara. Una política podría fijar versiones menos extremas, por ejemplo Chrome/Edge 109 y Firefox 115 para cubrir Windows 7/8, pero debe hacerlo explícitamente.

**Qué permite:** llegar a navegadores retenidos y a más WebViews; Chrome/Edge 109 ejecutan ESM y pueden cargar un bundle dirigido a ellos.

**Qué obliga a respaldar o evitar:**

- JPEG como último recurso; WebP no llegó a Safari hasta 14 y AVIF falta en amplios tramos.
- Carga diferida, `fetchpriority`, `@starting-style`, transiciones de `display`, View Transitions y APIs de JS mediante detección/fallback.
- Sintaxis transformada no equivale a API disponible: `Intl`, métodos nuevos, observers u otras APIs requieren auditoría y, si son esenciales, *polyfills* explícitos.
- Una matriz de pruebas real en las versiones mínimas; emular tamaño de pantalla no emula motor.

**A quién deja fuera:** según el punto concreto, principalmente IE y navegadores sin ESM; si se fija 109/115, deja fuera versiones aún anteriores. Aceptar Chrome/Edge 109 permite funcionar en Windows 7/8, pero esos Chromium dejaron de recibir seguridad en 2023. Firefox 115 ESR es la excepción temporal anunciada hasta marzo de 2027.

**Cuántas personas recupera en Perú:** **no encontrado**. Sin telemetría, no se sabe si ese mantenimiento rescata clientas reales o navegadores residuales.

**Coste de mantenimiento:** alto: más formatos, más ramas de CSS/JS, pruebas, documentación de degradación y posible bundle adicional. También puede impedir que una actualización de dependencia compile al objetivo sin cambios.

## Comparación de decisiones que habilita cada suelo

| Capacidad | A: 121/132/17.5 | B: Vite 111/114/16.4 | C: ESM amplio |
|---|---|---|---|
| Bundle Vite moderno | Sí | Sí | objetivo personalizado |
| AVIF sin respaldo por navegador declarado | Sí | No (Edge 111–120) | No |
| WebP | Sí | Sí | No en todo el rango |
| `fetchpriority` base | Sí | No | No |
| `@starting-style` base | Sí | No | No |
| Transiciones discretas base | Sí, con pruebas de propiedad concreta | No | No |
| View Transitions obligatoria | No: mejora progresiva | No: mejora progresiva | No |
| Windows 7/8 con Chrome/Edge | No | No (109 < 111) | Posible, inseguro/obsoleto |
| Windows 7/8 con Firefox 115 ESR | No | Sí por motor | Posible |
| Carga de pruebas | baja | media | alta |

## Cómo convertir escenarios en una política verificable

La elección futura debería producir, como mínimo:

- versiones mínimas separadas para panel/mostrador y tienda pública si sus riesgos son distintos;
- `build.target` fijado, no heredado accidentalmente de cada major de Vite;
- lista de funciones esenciales frente a mejoras progresivas;
- matriz Playwright/navegadores reales en los mínimos disponibles;
- telemetría anónima de versión/errores, con consentimiento y política aplicable, para reemplazar StatCounter por audiencia real;
- procedimiento para una tienda local incompatible: diagnóstico previo a instalar, actualización de navegador/OS o rechazo explícito.

No se recomienda un suelo. Los números regionales justifican no ignorar Safari móvil, Edge ni Firefox; no justifican por sí solos pagar soporte para Windows obsoleto.

## Lo no encontrado

- Versión de Vite y `build.target` reales de SILLAR.
- Analítica propia separada entre panel, mostrador y tienda pública.
- Distribución peruana completa por **versión**, necesaria para cuantificar exclusión.
- Sistemas operativos mínimos comerciales del producto y número real de instalaciones Windows 7/8.
- WebViews usados dentro de WhatsApp, Facebook, Instagram o TikTok por clientas peruanas.

## Fuentes

- [StatCounter — navegadores, todas las plataformas, Perú](https://gs.statcounter.com/browser-market-share/all/peru)
- [StatCounter — navegadores de escritorio, Perú](https://gs.statcounter.com/browser-market-share/desktop/peru)
- [StatCounter — navegadores móviles, Perú](https://gs.statcounter.com/browser-market-share/mobile/peru)
- [StatCounter — versiones de navegador, Perú](https://gs.statcounter.com/browser-version-market-share/all/peru)
- [Vite — compatibilidad de producción](https://vite.dev/guide/build.html#browser-compatibility)
- [Vite — `build.target`](https://vite.dev/config/build-options.html#build-target)
- [Can I Use — AVIF](https://caniuse.com/avif)
- [MDN — `fetchpriority`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/fetchpriority)
- [MDN — `@starting-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style)
- [Can I Use — `transition-behavior: allow-discrete`](https://caniuse.com/mdn-css_properties_transition-behavior_allow-discrete)
- [View Transitions Feature Explorer — mínimos por variante](https://view-transitions.chrome.dev/)
- [Google — requisitos de Chrome y fin en Windows 7/8](https://support.google.com/chrome/a/answer/7100626)
- [Microsoft — ciclo de vida de Edge 109](https://learn.microsoft.com/en-us/lifecycle/products/microsoft-edge)
- [Mozilla — Firefox 115 ESR en Windows 7/8/8.1](https://support.mozilla.org/en-US/kb/firefox-users-windows-7-8-and-81-moving-extended-support)
