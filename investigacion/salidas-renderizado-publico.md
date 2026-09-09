# Salidas de arquitectura para el catálogo público

**Veredicto — El problema de las tarjetas se puede resolver sin convertir toda la aplicación a SSR: basta con entregar un `<head>` específico por URL antes de React. SEO completo y HTML útil sin JavaScript son un alcance mayor. En la instalación local hay un requisito anterior a cualquiera de las salidas: la tienda debe tener un origen público alcanzable mientras el equipo esté encendido. No se elige una opción en este informe.**

Fecha de consulta: 18 de agosto de 2026.

## Dos problemas que no deben mezclarse

1. **Representación inicial:** qué HTML devuelve `/producto/:slug`. Esto decide la tarjeta y parte del trabajo de buscadores.
2. **Alcanzabilidad:** si Meta, Telegram, Apple y Google pueden conectar con esa dirección desde Internet. SSR no vuelve pública una IP privada; prerender tampoco sirve si el archivo queda solo en la PC de la tienda.

El segundo punto no está documentado en el encargo. Si la instalación local publica el catálogo mediante un dominio, proxy o sincronización a un nodo público, hay que identificarlo antes de valorar costes. Si solo corre en `localhost` o LAN, compartir el enlace fuera de la tienda no es un flujo posible, con o sin Open Graph.

## Opciones y coste

### 0. Mantener el shell común de la SPA

**Qué añade al despliegue:** nada.

**Qué mantiene:** el despliegue estático actual, si ese es realmente el actual.

**Qué falla:** los rastreadores sin JavaScript reciben título, descripción e imagen genéricos; una ruta no configurada en el servidor puede devolver 404, y un `slug` inexistente puede convertirse en *soft 404* si todo devuelve el mismo `200`.

**Nube/local:** no resuelve tarjetas en ninguna; la local además necesita alcance público.

**Coste de cambiar después:** bajo a medio para añadir solo metadatos si ya existe un servidor que resuelve productos; alto si se pospone hasta necesitar SSR completo y los componentes mezclan carga de datos, efectos y render sin una frontera reutilizable.

### 1. Inyección de `<head>` en el servidor para todas las personas y bots

El servidor resuelve el `slug`, lee el producto, escapa sus valores e inserta `<title>`, descripción, canónica, Open Graph y JSON-LD en la plantilla de Vite. El cuerpo sigue siendo el shell que React monta. No requiere renderizar React en el servidor.

**Qué añade al despliegue:** una ruta HTML dinámica o una transformación de la plantilla, acceso a datos y caché/invalidez de metadatos. Vite puede generar un `manifest` para que un backend construya el HTML con los activos correctos.

**Mantenimiento:** una plantilla de `<head>`, escape seguro, URL pública por instancia, comportamiento de producto borrado/no publicado, caché y pruebas por ruta. Es importante que la fuente de nombre, precio, disponibilidad e imagen sea la misma que usa la API para evitar divergencia.

**Qué falla si falta:** React puede seguir abriendo el producto, pero la tarjeta vuelve a ser genérica y el JSON-LD inicial desaparece. Si el servidor no distingue un `slug` inexistente, permanece el *soft 404*.

**Nube/local:** funciona en ambas si el proceso que ya sirve HTTP puede consultar los datos y el origen es público. Añade una consulta por primera visita; la caché puede evitar repetirla. En hardware modesto el trabajo es pequeño frente a renderizar React completo.

**Coste de adoptarlo más tarde:** medio. No obliga a cambiar componentes, pero sí el contrato de despliegue “un `index.html` para todo” y la forma de cachear HTML. Es menor si desde ahora se conserva una función pura “producto → metadatos”.

**Qué no resuelve:** el cuerpo inicial sigue sin producto. Google puede renderizarlo, pero otros bots pueden no hacerlo; no mejora por sí solo la primera pintura del contenido.

### 2. Prerender por producto al cambiar el catálogo

Al crear, editar, publicar o borrar un producto se genera una página/snapshot HTML para su URL. Puede contener solo el `<head>` específico o también contenido semántico del cuerpo; React toma el control después.

**Qué añade al despliegue:** generador, almacenamiento de archivos, nombres/rutas, invalidación atómica, eliminación de snapshots antiguos y reconstrucción completa como recuperación.

**Mantenimiento:** hay dos estados derivados —datos y HTML— que deben permanecer sincronizados. Necesita pruebas ante edición, borrado, cambio de disponibilidad, cambio de URL pública y recuperación tras fallo.

**Qué falla si falta:** una edición puede dejar precio o disponibilidad antiguos; un producto nuevo puede compartir el shell genérico hasta que se regenere; una eliminación mal invalidada puede seguir entregando `200`.

**Nube/local:** evita CPU por solicitud y es amable con hardware modesto. Consume disco. Hay que decidir si el HTML generado se replica entre nodos o se regenera en destino; replicarlo multiplica tráfico/estado derivado, regenerarlo exige que el destino ejecute el generador. Esto toca la arquitectura de sincronización.

**Coste de adoptarlo más tarde:** medio. Sube si hoy no existe un evento fiable para cada mutación del catálogo o si las escrituras ocurren por caminos distintos.

### 3. SSR/hidratación de las rutas públicas

React produce en el servidor el `<head>` y el cuerpo del catálogo/producto; el navegador hidrata el HTML.

**Qué añade al despliegue:** entrada cliente y servidor, runtime SSR, resolución de activos, carga de datos en servidor, serialización segura, hidratación, manejo de errores/estado HTTP y caché. Vite ofrece APIs de SSR, pero no es un servidor de producto ni impone una arquitectura.

**Mantenimiento:** cada componente de ruta debe ser compatible con servidor: sin leer `window` durante render, datos deterministas, mismos locales y estados en servidor/cliente, y vigilancia de discrepancias de hidratación.

**Qué falla si falta:** según el diseño del despliegue, puede caer toda la ruta pública o existir un respaldo CSR. Un fallo SSR tiene más radio que un fallo de metadatos.

**Nube/local:** funciona en ambas con runtime disponible y origen público. Consume CPU por solicitud, memoria y complejidad de caché; una PC modesta puede necesitar caché de páginas/productos para no renderizar repetidamente. A cambio entrega contenido útil antes de descargar/ejecutar todo React.

**Coste de adoptarlo más tarde:** alto, normalmente varias iteraciones, porque cambia la frontera de datos y render de todas las rutas públicas. No se puede estimar en jornadas sin leer la estructura del producto.

### 4. Renderizado estático completo en compilación

Se generan todas las rutas en `pnpm build`.

**Qué añade al despliegue:** inventario de productos disponible durante el build y un nuevo build/publicación cada vez que cambia el catálogo.

**Mantenimiento y fallo:** simple para contenido inmutable; desacoplado del dato vivo para un catálogo administrable. Un precio editado queda antiguo hasta reconstruir. Con una instancia por cliente, el artefacto pasa a ser específico del cliente.

**Nube/local:** en local exige construir y sustituir archivos en la tienda en cada cambio. En nube puede multiplicar builds. No encaja gratis con “el catálogo cambia solo”; se convierte en la opción 2 cuando se automatiza por mutación.

**Coste de adoptarlo más tarde:** bajo para pocos productos si ya existe pipeline por cliente; medio/alto si hoy solo hay un artefacto común.

### 5. Renderizado dinámico solo para bots

El servidor reconoce `User-Agent` y entrega HTML prerenderizado a rastreadores, mientras las personas reciben la SPA.

**Qué añade al despliegue:** lista de bots, renderer o plantilla alternativa, caché y vigilancia de paridad. Los agentes cambian y pueden falsificarse.

**Mantenimiento y fallo:** dos representaciones. Si divergen, aparecen errores difíciles de reproducir y riesgo de que buscadores interpreten la diferencia como contenido engañoso. Google define esta técnica como una solución temporal, no a largo plazo, y recomienda SSR, render estático o hidratación.

**Nube/local:** requiere runtime y alcance público en ambas; ejecutar un navegador sin cabeza en la PC modesta sería el caso más costoso. Una plantilla de metadatos no necesita detección de bot: es más simple servir el mismo `<head>` correcto a todos.

**Coste de adoptarlo más tarde:** medio; deuda creciente mientras aumentan consumidores y excepciones.

### 6. Servicio externo/edge de prerender o tarjetas

Un CDN, función de borde o proveedor recupera/genera HTML o imágenes de tarjeta.

**Qué añade al despliegue:** tercero, credenciales, facturación, configuración DNS/rutas, caché, observabilidad y contrato de privacidad/disponibilidad.

**Mantenimiento y fallo:** una caída o cuota agotada elimina tarjetas/HTML; se suma la invalidación entre producto, origen y proveedor.

**Nube/local:** puede encajar en nube. No es solución común para local si se exige operar sin terceros o sin salida a Internet; un puente público podría publicar una copia, pero eso ya es una nueva arquitectura de sincronización. Debe tratarse como variante, no como dependencia invisible.

**Coste de adoptarlo más tarde:** bajo/medio para nube si DNS y URLs son estables; no resuelve posteriormente el caso local sin diseñar el puente.

## Comparación rápida

| Salida | Tarjeta por producto | Cuerpo útil sin JS | CPU por visita | Estado derivado | Cambio posterior |
|---|---:|---:|---:|---:|---:|
| Shell SPA | No, salvo que ya haya inyección desconocida | No | mínima | ninguno | — |
| Inyección de `<head>` | Sí | No | baja y cacheable | caché | medio |
| Prerender al mutar | Sí | opcional | casi cero | archivos/snapshots | medio |
| SSR/hidratación | Sí | Sí | media, cacheable | caché | alto |
| Estático en build | Sí | Sí | cero | artefacto por catálogo | medio/alto |
| Solo bots | Sí | según renderer | media/alta | caché y lista UA | medio, deuda |
| Servicio externo | Sí | según servicio | fuera del nodo | caché externa | bajo/medio nube; alto local |

## Qué conviene fijar ahora aunque la arquitectura se aplace

Esto no selecciona una salida; reduce el coste de cualquiera:

- La URL canónica estable ya está bien planteada: `/producto/:slug`.
- Una única proyección de datos públicos: nombre, descripción corta, precio, moneda, disponibilidad, imagen pública y última modificación.
- Una función determinista de esa proyección a `<head>`/JSON-LD, sin acceder al navegador.
- Política explícita para producto no publicado o inexistente: `404`/`410`, nunca shell `200` indexable.
- URL de imagen de tarjeta estable y pública, sin sesión ni firma efímera.
- Evento/invalidez cuando cambian los campos visibles.
- Una respuesta documentada a “¿cómo es alcanzable desde Internet la instalación local?”.

No se propone crear una abstracción por anticipado dentro del producto: estos son límites de datos y despliegue que cualquier opción necesita. La forma concreta solo se implementa al elegir arquitectura.

## Lo no encontrado

- La topología de publicación de la instalación local.
- El servidor/backend que hoy entrega `index.html`, su lenguaje y su capacidad de templado.
- Si ya existe caché, eventos de catálogo o réplica de artefactos derivados.
- La versión de Vite y la organización real de las rutas/componentes; por eso no se da una estimación falsa en días.
- La respuesta HTML actual. “SPA” no equivale necesariamente a “sin metadatos de servidor”.

## Fuentes

- [Google Search Central — renderizado dinámico como solución temporal](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering?hl=es-419)
- [Google Search Central — JavaScript SEO, render y estados HTTP](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Vite — integración con backend y `manifest`](https://vite.dev/guide/backend-integration)
- [Vite — SSR](https://vite.dev/guide/ssr)
- [Open Graph Protocol](https://ogp.me/)
