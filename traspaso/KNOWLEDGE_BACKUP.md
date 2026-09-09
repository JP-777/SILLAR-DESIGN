# Respaldo consolidado de conocimiento — SILLAR Design

> Documento único de emergencia. Preparado el 29 de agosto de 2026 a partir de la conversación y una inspección solo lectura de `C:\SILLAR-DISENO`. No se inspeccionó ni modificó `C:\SILLAR`. Las etiquetas DECIDIDO, IMPLEMENTADO EN DISEÑO, PROPUESTO, DESCARTADO, PENDIENTE e INCIERTO evitan convertir recomendaciones en adopciones.

## 1. Contexto y propósito

SILLAR es una plataforma modular comercial para retail y servicios en Perú. Usa React + TypeScript + Vite y pnpm en frontend, y ASP.NET Core sobre .NET 10 para el backend mencionado en la investigación de imágenes.

Hay dos superficies:

- **panel/mostrador:** trabajo continuo, hasta ocho horas, a veces en un PC modesto;
- **tienda pública:** catálogo/escaparate, clientes móviles y datos.

`C:\SILLAR-DISENO` existe separado del producto para contener investigación, propuestas y código de referencia. La regla absoluta es no escribir en `C:\SILLAR`. Otro agente aplica cambios. La separación nació después de que la carpeta de diseño se moviera fuera y unos informes aterrizaran en la ruta antigua; Git evitó que entraran, pero se decidió que la barrera física debía ser primaria.

El trabajo no consistió en adoptar bibliotecas, sino en saber qué hacen, qué pesan, qué arrastran, su licencia distribuida, reduced motion y cuánto cuesta extraer a mano lo útil. En tareas concretas se entregó código listo, siempre fuera del producto.

## 2. Reglas invariables

### Proceso

- **DECIDIDO:** investigación no es decisión.
- **DECIDIDO:** no instalar dependencias sin preguntar.
- **DECIDIDO:** no crear abstracciones para un único caso.
- **DECIDIDO:** licencia completa señalable en el artefacto que se vende.
- **DECIDIDO:** si algo cuesta pocas decenas de líneas, no gana plaza como dependencia.
- **DECIDIDO:** veredicto al inicio e “INCIERTO / REQUIERE CONFIRMACIÓN” cuando falten datos.

### Visual y accesibilidad

- **DECIDIDO:** colores solo mediante variables CSS validadas; ningún literal en componentes.
- **DECIDIDO:** interfaz en español.
- **DECIDIDO:** toda animación respeta `prefers-reduced-motion`, incluso cambios en caliente.
- **DECIDIDO:** CSS base protege animaciones CSS; JS debe escuchar y cancelar por separado.
- **DECIDIDO:** una animación nunca retrasa la acción.
- **DECIDIDO:** el mensaje/estado sobrevive sin movimiento.
- **DECIDIDO:** por debajo de 1 s no se muestra indicador.
- **DECIDIDO:** la preferencia del sistema gana al ajuste de instalación.
- **DECIDIDO:** el interruptor de instalación apaga movimiento ocasional, no el cotidiano.
- **DECIDIDO:** foco visible, errores concretos y estados anunciables.

### Movimiento cotidiano

Escala decidida: entrada control 120 ms, mensaje 180 ms, superficie 240 ms; salidas 120/160 ms; entrada `cubic-bezier(.2,0,.4,1)`, salida `cubic-bezier(.4,0,1,1)`, linear solo bucles. Nombres por rol. La idea de conservar opacidad a 80 ms bajo reducción fue propuesta, pero el CSS final no está disponible.

## 3. Dirección visual M01

**PROPUESTA, no adopción confirmada:** identidad inspirada en piedra de sillar arequipeña y azul cielo de Arequipa. Geometría de bloque tallado, no cápsulas: radios 3/5/8 px. Tipografía del sistema, cuerpo 15 px/1.55, H1 26, H2 20, H3 16, títulos peso 640. Espacios 4/8/12/16/24/32/48/64 px.

Paleta exacta:

```text
stone: #FAF8F5 #F2EEE7 #E3DCD1 #CBC2B2 #A29886
       #7A7062 #5C5447 #443E34 #2C2822 #1A1713
accent: #D4E5F0 #7FB0D0 #1F6795 #18536F #123D55
success #2E7D5B / bg #E6F2EC
warning #9C6414 / bg #FBF0DD
danger  #B23A2B / bg #FBEAE7
```

Claro: bg stone-50, raised blanco, sunken stone-100, texto stone-800, primario accent-500. Oscuro: bg stone-900, raised stone-800, sunken `#12100D`, texto stone-100, primario accent-600. Contrastes documentados: texto 13.8:1, primario 6.1:1 y borde 4.6:1. Todo color nuevo requiere revalidación. El panel conserva tema SILLAR; el público puede usar el tema del cliente.

El archivo primario es `propuestas\M01\_ds\...\tokens\tokens.css`; `base.css` define tipografía, foco 2 px + offset 2 y la regla global de reduced motion. `harness.css` solo permite revisar temas anidados y no debe integrarse como fuente.

## 4. M01 catálogo

**IMPLEMENTADO EN PROTOTIPO, no verificado en producto.** Archivos: `Listado de productos.dc.html`, `Detalle de producto.dc.html`, `Catálogo - cuatro estados.dc.html` y `.thumbnail`.

### Listado

- Cabecera “Catálogo / Productos”, recuentos y acciones Categorías/Nuevo producto.
- Búsqueda por nombre o código y switch para mostrar dados de baja.
- Vacío: define producto con ejemplo; solo CTA “Crear el primer producto”; sin filtros inútiles.
- Datos: producto sin barras, precio a consultar, tres variantes y dado de baja.
- Carga: conserva estructura, no inventa recuento, filtros inertes.
- Conflicto: desactivar categoría deja 23 productos sin categoría pero activos; se explica y ofrece deshacer.
- Compacto 390 px: apila nombre, código, precio, estado; solo acción Editar.
- Inactivos atenuados, no ocultos y legibles en oscuro.

### Detalle

- Regreso a Productos, título, badge activo y código interno; Descartar/Guardar.
- Datos básicos con nombre obligatorio y ayuda de búsqueda, categoría, código interno/barras, precio y “Precio a consultar”.
- Variantes comparten nombre/foto/precio; tabla solo distingue código/estado.
- Fotos y estado en cards separadas.
- Nuevo: no muestra estado/variantes/fotos ficticias.
- Carga: título “Producto”, un indicador, sin nombre/estado inventados.
- Conflictos: barras duplicadas con producto concreto; última variante activa impide dejar producto activo vacío; borrar foto con `alertdialog`.
- Escritorio: grid `1.35fr/1fr`; compacto: una columna.

### Componentes de revisión

Bundle generado `SillarUI` con Alert, Badge, Button, Card, ConfirmDialog, Drawer, EmptyState, FailureAlert, Field, Gallery, Input, Pagination, Spinner, Switch, Table y Toasts. No es source funcional ni prueba de integración. El Spinner del bundle es anillo `aria-hidden` con label sr-only opcional; el defecto semántico/reduced motion requiere solución en producto. IDs fijos de demo en Drawer/Dialog deben revisarse en producción.

No hay diseños recuperables de dashboard, sidebar, header global u otros módulos. No inventarlos a partir de M01.

## 5. Movimiento expresivo

### Pared de sillares

**PROPUESTA + código completo de referencia.** Mejor hueco: reinicio real al activar módulo. Login solo si se mide >1 s; nunca se fuerza duración para completar pared.

Implementación:

- 23 bloques, cinco filas, máximo cinco caídas simultáneas;
- pared completa alrededor de 1.5 s;
- solo `transform`/`opacity`, sin bucle JS ni dependencia;
- salida visual 160 ms, pero panel habilitado y overlay sin eventos inmediatamente;
- final a media altura: pausa en transform calculado y salida conjunta;
- espera larga: dos motas sutiles (3.7/5.1 s) y botón “Detener movimiento”;
- reduced motion: pared completa estática, sin caída/polvo, mensajes reales;
- `role=status`, polite/atomic; final “Sistema disponible”.

Mensajes reales: guardar activación, reiniciar servicios, esperar disponibilidad, actualizar módulos, sistema disponible. No se rotan por reloj.

Pruebas escritas afirman: 400 ms no muestra indicador; panel clicable aunque salida siga visible; mensaje/estático bajo reducción; cambio caliente; detener movimiento prolongado. No se ejecutaron contra SILLAR.

### Puerta de animaciones ocasionales

**PROPUESTA + código completo de referencia.** El segundo caso justificó compartir permiso:

```text
permitidas = (ajusteInstalacion === true) && !prefersReducedMotion
```

Devuelve permitido y causa `sistema`, `instalacion`, `configuracion-pendiente` o null. Configuración null falla cerrada. La capa React sirve a JS y un atributo/CSS duplica defensa. Al bloquear en caliente se cancela y aplica estado final, no se deja terminar. El ajuste solo cubre carácter ocasional.

**PROPUESTO, no decidido:** default false hasta que pase benchmark en PC antiguo. No se puede detectar hardware lento con fiabilidad previa: núcleos, memoria aproximada, GPU, batería y red no son un score. Medir frames sirve para telemetría futura pero ya mostró el fallo una vez.

No hay “número universal” de elementos. La pared presupuestó cinco concurrentes. Se entregó benchmark para 1/2/4/8/16/32/64 y compositor/paint/layout. Falta ejecutarlo en hardware objetivo.

## 6. Indicador, velo y artefactos perdidos

### Spinner

**DEFECTO CONFIRMADO:** la regla global reduce todas las animaciones con `!important` y congela el único spinner. Un anillo quieto conserva contraste pero no comunica espera. Un lector de pantalla tampoco conoce un indicador puramente visual.

**PENDIENTE:** recuperar/reconstruir el código que sustituye movimiento, aporta estado/live region y prueba Playwright. Evitar anuncios repetidos. La conversación sugiere que se entregó una vez, pero el archivo falta.

### Velo

**PENDIENTE:** reemplazar el `rgba(26,23,19,.45)` de componente por token/roles de tema. No se recuperaron nombre ni valores finales; no inventar si uno o dos.

## 7. Bibliotecas descartadas e ideas rescatadas

**DESCARTADAS por historial:** Morphicons, Sileo, Auragradients, react-loading-skeleton, Motion, AutoAnimate, GSAP, Liquid Gooey, Three.js. Se menciona una décima descartada, no identificable.

- Morphicons: ~8 191 B gzip medidos, MIT incluida, reduced motion no seguro por defecto. Transición usual a mano <1 KB. Solo reconsiderar estados semánticos cerrados.
- Sileo: sin texto de licencia en artefacto y movimiento que retrasa. Rescatar manualmente upsert de promesa, dedupe/contador, pausa por foco+puntero conservando tiempo. No copiar gooey/drag/seis posiciones/acción oculta.
- Auragradients: no se identificó paquete inequívoco; pocos gradientes CSS. No panel. Público/instalación solo con tokens y preferentemente horneado si estático.
- Las otras seis carecen de informes actuales. No inventar pesos/licencias.
- NetVips: descartada para imágenes porque el artefacto no traía textos completos de licencias, aunque técnicamente era eficiente.

## 8. Fotos del catálogo

**INVESTIGACIÓN TERMINADA; arquitectura abierta.**

### Cifra de impacto

Mejor estrategia investigada: 50 fotos recorridas ~1–2 MB; primeras cuatro 80–160 KB. Peor: 50×5 MB = 250 MB; a 1.6 Mbps, una 5 MB ~25 s, cuatro ~100 s, cincuenta ~20 min 50 s.

### Formato/tamaño

Soporte global de referencia julio 2026: AVIF ~94.67 %, WebP ~96.18 %, JPEG universal; falta analítica propia. Muestra real: AVIF ahorró 1.7–15 %; WebP fue hasta 22.2 % peor que JPEG. Medir corpus.

`srcset` se calcula por ranura×DPR y deduplica; probablemente 2–3 anchos. LCP eager y high priority, otras visibles eager/auto, lazy debajo. Reservar cuadrado/16:9 con contenedor `aspect-ratio` y atributos `width`/`height`.

### Derivados

- al subir: CPU una vez, disco y réplica multiplicados;
- demanda+caché: primer visitante paga CPU, riesgo de estampida, especialmente local;
- ninguno: simple, cliente paga originales.

No elegir hasta saber si ERP local sirve escaparate. Sin CDN obligatorio.

## 9. Decodificación, orientación y social

**PROPUESTO:** 12 000 px por lado, 50 MP, 256 MiB estimada y una imagen estática, más 5 MB. Usar enteros de 64 bits, parser acotado y revalidar tras decode.

Error propuesto:

> No se puede procesar esta foto: mide {ancho} × {alto} px. Se admiten hasta 50 millones de píxeles y 12 000 px por lado. Reduce su resolución o recórtala y vuelve a subirla.

Opciones:

- ImageSharp 4.0: ~2.57 MB, administrada, sin AVIF, licencia Split y posible pago tras umbral de ingresos; texto en nupkg no se copia solo.
- Magick.NET Q8 x64 14.16: AVIF/todos, ~25.2 MiB Windows/~37.9 MiB Linux, avisos disponibles pero deben publicarse.
- NetVips 3.2/libvips 8.18.5: ~17.9 MiB, descartada por textos incompletos.

No se eligió ImageSharp/Magick.

Pipeline: identificar/limitar → decodificar → autoorientar/reflejar → convertir a sRGB → recortar/redimensionar → codificar sin EXIF/GPS/XMP/IPTC/comentarios/thumbnail/MakerNotes.

Social propuesto: 1200×630, JPEG baseline sRGB sin metadata, calidad inicial 82, objetivo <=550 000, hard cap <600 000, medir y ajustar; luego 1000×525/800×420 si hace falta. Un cuadrado en cover pierde 47.5 % de altura total; puede requerir composición diseñada. El derivado social es caro por recompresión iterativa y puede usar estrategia distinta.

## 10. Compartir, render y SEO mínimo

No se confirmó el estado real. Si dos `/producto/:slug` entregan el mismo HTML inicial y React cambia head después, WhatsApp mostrará tarjeta genérica/igual. La prueba usa dos slugs, user-agent, compara status/head y descarga imagen sin sesión.

Head mínimo por producto: title, description, canonical, `og:type/site_name/title/description/url/image/type/width/height/alt`, locale es_PE. Imagen absoluta HTTPS, pública, <600 KB. Ruta client-only sin fallback da 404; con fallback index da head genérico.

Opciones abiertas: shell SPA, head server-injected, prerender por mutación, SSR/hidratación, estático, bot rendering temporal o edge externo. Head injection resuelve tarjetas/metas, no body/status/sitemap completo. Antes: origen local público.

SEO mínimo: Product/Offer JSON-LD solo con datos verdaderos visibles, título/description, canonical propio, anchors, 404/410 y sitemap mantenido por mutaciones si se usa. `/producto/:slug` único ya evita duplicación entre categorías; auditar variantes URL. Merchant listing depende de compra directa: incierto.

## 11. Navegadores Perú

StatCounter julio 2026 (temporal): overall Chrome 78.18 %, Edge 6.58, Safari 5.42, Firefox 3.73, Opera 2.74, Brave 2.17. Desktop Chrome 77.06, Edge 9.55, Firefox 5.34; mobile Chrome 80.37, Safari 14.43.

Tres escenarios no elegidos:

- moderno: Chrome/Edge 121+, Firefox 132+, Safari/iOS 17.5+;
- referencia Vite: Chrome/Edge 111+, Firefox 114+, Safari 16.4+;
- ESM amplio: Chrome 64+, Firefox 67+, Safari 11.1+, Edge 79+ o pisos explícitos 109/115.

Panel y público pueden diferir. Probar Chromium, Safari móvil y Firefox/Edge escritorio. Falta analítica propia/versiones para cuantificar exclusión.

## 12. Mapa y conservación

`C:\SILLAR-DISENO` tenía 39 archivos relevantes, sin `.git`:

- 13 informes Markdown principales;
- 7 archivos pared;
- 9 archivos puerta;
- 10 archivos M01 incluyendo thumbnail, tres `.dc.html`, harness/runtime y design-system bundle/tokens.

Conservar todos. Fuentes de alto valor: informes, TSX/CSS/pruebas, `.dc.html`, tokens. Generados necesarios para reproducibilidad: `_ds_bundle.*`, `support.js`, thumbnail. `harness.css` es auxiliar y puede divergir.

No había SVG/logo/Figma/screenshots externos ni fotos de corpus accesibles.

## 13. Pendientes ordenados

### Críticos

1. Definir si ERP local sirve catálogo y su origen público.
2. Verificar dos tarjetas reales.
3. Elegir estrategia de derivados e invalidación/réplica.
4. Elegir procesador y publicar licencias.
5. Reparar/probar indicador accesible bajo reduced motion.

### Importantes

6. Confirmar adopción de M01/tokens.
7. Recuperar escala base y token de velo.
8. Medir login/reinicio reales.
9. Ejecutar benchmarks en hardware objetivo.
10. Elegir render público y suelos de navegador.

### Condicionados

- uso de pared en login: solo con espera medida >1 s;
- default ocasional: tras benchmark;
- anchos/formato: tras layout/DPR/corpus;
- benchmark local de derivados: solo si local sirve público;
- Merchant listing: según compra directa;
- redirecciones de slugs viejos: política no definida.

## 14. Información perdida/incierta

- Informes/código final de Spinner, escala, velo y movimiento nativo.
- Informes de seis bibliotecas descartadas.
- Identidad de la décima candidata.
- Estado real de integración en SILLAR.
- Historial Git/archivos borrados de SILLAR-DISENO.
- Referencias visuales externas, Figma, logo y fotos del corpus.
- Benchmark del PC antiguo, medición real de tiempos y analítica propia.
- Fuente oficial WhatsApp/TTL exacto.

No interpretar estos silencios como inexistencia. Repetir investigación con fuentes actuales o pedir confirmación.

## 15. Continuación inmediata

1. Verificar en solo lectura `C:\SILLAR-DISENO` y comparar `05_MAPA_ARCHIVOS.md`.
2. Leer handoff/decisiones/reglas/datos perdidos.
3. Abrir tablero M01; no confundir prototipo con producción.
4. Preguntar qué pendiente se retoma y cuál autoridad existe.
5. Mantener panel/público y nube/local separados.
6. Al adoptar, revalidar licencias, soporte y cifras temporales.
7. No escribir en `C:\SILLAR`; entregar fuera para que otro agente integre.

Con estas reglas y archivos se puede continuar sin la conversación original, preservando tanto lo concluido como lo que deliberadamente quedó abierto.

## 16. Referencias, integración y continuidad

- **Referencias:** la referencia visual primaria es el tablero M01 y su thumbnail; la referencia conceptual es la piedra sillar de Arequipa. No hay Figma, logo ni moodboard externo recuperable.
- **Integración:** todo el contenido sigue siendo diseño/investigación o código de referencia hasta que otro agente lo contraste y aplique en `C:\SILLAR`; bundle y harness no son source de producto.
- **Continuidad:** usar `10_PROMPT_CONTINUACION.md` como entrada en la nueva computadora y este archivo como respaldo único si faltan los demás.
