# Estado actual del trabajo de diseño

> Inventario funcional a 29 de agosto de 2026. “Terminado” significa terminado como informe/prototipo de diseño, no aplicado al producto.

## TERMINADO

### Investigación de bibliotecas iniciales

- **Morphicons:** informe presente. Describe API, peso medido, licencia MIT incluida, reduced motion no seguro por defecto, alternativas y versión manual.
- **Sileo:** informe presente y ampliado con “Qué vale la pena copiar”. Descartada; ideas concretas rescatadas sin dependencia.
- **Auragradients:** informe presente. No se identificó paquete inequívoco; se trató como técnica y se separó panel frente a escaparate.

### Fotografías del catálogo

- Formatos AVIF/WebP/JPEG con soporte y una muestra real.
- Construcción de `srcset`/`sizes` a partir del layout.
- Lazy loading, `fetchpriority`, LCP y CLS.
- Comparación de derivados al subir, bajo demanda y ninguno.
- Escenarios cuantificados para 50 productos.
- Archivo: `investigacion\fotos-catalogo-publico.md`.

### Seguridad y normalización de imágenes

- Límites propuestos de lado/píxeles/memoria/frame.
- Lectura acotada de cabeceras y verificación al decodificar.
- Evaluación ImageSharp/Magick.NET/NetVips.
- Orientación 1–8, perfiles y retirada de metadatos.
- Contrato propuesto del derivado social <600 KB.
- Archivos: `limites-decodificacion-imagenes.md`, `orientacion-y-metadatos-de-fotos.md`, `previsualizacion-mensajeria-600kb.md`.

### Descubrimiento y compartir productos

- Condición exacta para que WhatsApp vea mal una SPA.
- Etiquetas OG mínimas, accesibilidad pública de imagen, prueba con dos slugs.
- Alternativas de render público y coste de migrar.
- Product/Offer JSON-LD, canonical, sitemap y 404/410.
- Escenarios de navegadores y cuotas peruanas de julio de 2026.
- Archivos: `previsualizacion-enlaces-mensajeria.md`, `salidas-renderizado-publico.md`, `descubrimiento-minimo-catalogo.md`, `soporte-navegadores-peru.md`.

### Pared de sillares

- Informe y código completo de referencia.
- CSS sin colores literales y sin dependencia.
- Integración ilustrativa con reinicio de módulo.
- Harness y cinco familias de pruebas Playwright.
- Benchmark HTML y ejecutor CDP.
- Archivos en `investigacion\pared-de-sillares*`.

### Puerta de animaciones ocasionales

- Informe, provider/hook, defensa CSS, ejemplo CSS y ejemplo JS.
- Pruebas de precedencia y cambio en caliente.
- Benchmark de concurrencia y parche de integración no aplicado.
- Archivos en `investigacion\puerta-animaciones-ocasionales*`.

### Propuesta M01 catálogo

- Listado de productos en vacío, datos, carga y conflicto.
- Detalle de producto en vacío, datos, carga y tres conflictos.
- Claro, oscuro, compacto e interactivo.
- Tablero de revisión y thumbnail.
- Bundle de componentes/tokens para representación del prototipo.
- Archivos en `propuestas\M01`.

## PARCIAL

### Sistema visual M01

- Existe paleta, roles, tipografía, escala espacial, radios, sombras y foco.
- Falta confirmación explícita de adopción general fuera de M01.
- Los tokens de movimiento que consume la pared no están definidos en el `tokens.css` actual.
- El velo sigue sin token recuperable.

### Accesibilidad de Spinner

- Problema confirmado: la regla global reduce el giro y deja un anillo quieto que no comunica espera.
- La conversación pidió semántica, live region y prueba; más tarde alude a que se entregó.
- No existe hoy el informe/código correspondiente en `C:\SILLAR-DISENO`.
- Estado: **PARCIAL / REQUIERE RECUPERACIÓN O RECONSTRUCCIÓN VERIFICADA**.

### Escala de movimiento

- Los valores cotidianos están fijados en el historial.
- La implementación base y su prueba no aparecen en archivos actuales.
- La pared usa nombres de tokens con fallbacks, señal de integración pendiente.

### Benchmark en hardware modesto

- Protocolos y herramientas terminados.
- Medición real no obtenida; Chromium GPU falló en el entorno de investigación.

### Arquitectura pública

- Opciones y costes investigados.
- No se eligieron render, derivados ni rol del ERP local.

## NO INICIADO EN EL MATERIAL RECUPERADO

- Dashboard global.
- Sidebar global.
- Header/app shell global.
- Módulos posteriores a M01 y sus seis pantallas anunciadas.
- Página pública del catálogo como propuesta visual completa; lo presente es investigación técnica.
- Diseño visual del derivado social/composición 1200×630.
- Política visual integral de navegación móvil.

No asumir que estos puntos nunca se trabajaron fuera de esta conversación; solo no aparecen aquí.

## REQUIERE REVISIÓN

### Prototipos M01

- Confirmar con JP cuáles decisiones pasan de propuesta a sistema.
- Revisar estados interactivos en navegador real y con tecnología asistiva.
- Confirmar que ejemplos inventados coinciden con dominio/modelo final.
- Verificar compacto más allá del ancho de referencia de 390 px.

### Bundle SillarUI de diseño

- Es generado por `cc-design-sync`; los sources originales no están en este árbol.
- El Spinner del bundle solo tiene anillo `aria-hidden` y texto sr-only opcional; no constituye por sí solo una región de estado.
- IDs fijos de Drawer/Dialog (`drawer-titulo`, `dialogo-titulo`) pueden chocar si hay instancias simultáneas; revisar al llevar a producción.
- Toasts es simple; el informe Sileo describe mejoras manuales posibles, no adoptadas.

### Datos temporales

- Licencias, soporte de navegador, cuotas y APIs deben revalidarse antes de adoptar.
- La fuente oficial de WhatsApp no se pudo recuperar; el informe usa reproducción y límites observados.

## DESCARTADO

- Morphicons como dependencia actual.
- Sileo como dependencia.
- Auragradients para el panel y como dependencia no identificada.
- React-loading-skeleton, Motion, AutoAnimate, GSAP, Liquid Gooey y Three.js según el historial; faltan varios informes.
- NetVips bajo el requisito de texto completo de licencia en artefacto.
- Usar animación para inventar una espera mínima.
- Detectar automáticamente “hardware lento” como verdad fiable.
- CDN externo como requisito de la estrategia base.
- Calidad JPEG fija como garantía de 600 KB.

## Problemas conocidos

1. Artefactos de varias investigaciones no están en el árbol actual.
2. No hay repositorio Git en `C:\SILLAR-DISENO`, por lo que no se puede recuperar historial.
3. Las pruebas de pared/puerta no se han ejecutado contra el producto.
4. No hay benchmark del equipo antiguo objetivo.
5. Estado real de tarjetas sociales de SILLAR no confirmado.
6. No se sabe si la instalación local sirve catálogo público.
7. No se sabe si los tokens visuales M01 ya fueron aprobados o solo propuestos.
