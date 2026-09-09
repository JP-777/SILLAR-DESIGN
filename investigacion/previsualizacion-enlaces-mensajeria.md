# Previsualización de enlaces en mensajería

**Veredicto — ¿se ve mal hoy un producto compartido por WhatsApp? NO se puede confirmar con la evidencia disponible: no se inspeccionó SILLAR ni una URL publicada. SÍ se verá mal —con una tarjeta genérica, incompleta o sin tarjeta— si dos `/producto/:slug` entregan el mismo `<head>` inicial y los datos propios se añaden después con JavaScript. React + Vite permite esa arquitectura, pero no la demuestra.**

Fecha de consulta: 18 de agosto de 2026.

## Lo que está comprobado

- WhatsApp es el caso principal en Perú, no una suposición de producto: Erestel 2025 de OSIPTEL dice que lo usa el 98,6 % de quienes emplean mensajería instantánea; Messenger aparece con 45,1 %, seguido por mensajes directos de TikTok (27,9 %) e Instagram (20,5 %).
- WhatsApp solicita la dirección con un `GET` HTTP y extrae marcas del `<head>`. Su documentación reproducida en noviembre de 2025 exige `og:title`, `og:description`, `og:url` y `og:image` dentro del `<head>` y dentro de los primeros 300 KB del HTML. La imagen debe tener URL absoluta, medir al menos 300 px de ancho, tener relación ancho/alto no superior a 4:1 y pesar menos de 600 KB.
- Las marcas creadas después por React no sirven para este rastreo. La documentación disponible describe un `GET` y análisis del HTML; pruebas técnicas actuales coinciden en que WhatsApp no ejecuta el JavaScript de la aplicación. Por eso cambiar `document.title`, usar un componente tipo Helmet o insertar `meta` en un efecto no corrige la tarjeta.
- Open Graph define cuatro propiedades básicas: `og:title`, `og:type`, `og:image` y `og:url`; recomienda `og:description` y `og:site_name`. Si se publican varias imágenes, el protocolo da preferencia a la primera de arriba hacia abajo. `og:image:width`, `height`, `type` y `alt` describen la imagen y evitan que el consumidor tenga que descubrir esas propiedades.
- La imagen y la página tienen que ser accesibles por HTTP desde fuera. Una imagen que requiere sesión, cookies o acceso a la red local no está disponible para el rastreador aunque el usuario autenticado sí la vea.
- Una ruta que solo conoce el enrutador del cliente tiene dos fallos posibles: si el servidor no hace *fallback*, devuelve 404 y no hay tarjeta; si devuelve siempre `index.html`, el rastreador solo ve el `<head>` común. Que el navegador llegue luego al producto no cambia lo que ya leyó el rastreador.

La fuente detallada de WhatsApp encontrada es una reproducción de documentación de Meta, no una URL oficial de Meta accesible durante esta investigación. Sus cifras son específicas y comprobables, pero esta procedencia debe conservarse en el registro. No se encontró una página oficial pública actual de WhatsApp con el mismo texto.

## Qué lee cada consumidor

| Consumidor | ¿Ejecuta la aplicación React? | Contrato útil | Orden y respaldo documentados | Límites comprobados |
|---|---:|---|---|---|
| WhatsApp | No | `og:title`, `og:description`, `og:url`, `og:image` en el HTML inicial | Dice que puede relajar requisitos y buscar otras marcas, pero no publica un orden estable. No hay que depender del respaldo | `<head>` dentro de los primeros 300 KB; imagen absoluta, < 600 KB, ancho >= 300 px, relación <= 4:1; la propia guía pide verificar que la tarjeta aparezca en 10 s |
| Facebook Messenger / ecosistema Meta | No se encontró una especificación actual de Messenger que prometa ejecutar JS; el flujo de Meta consume Open Graph mediante rastreo | El mismo núcleo Open Graph cubre Facebook y Messenger | Orden exacto y límites propios de Messenger: **no encontrados en fuente oficial actual** | Probar con el rastreador de Meta y en un chat real; no extrapolar el límite de WhatsApp |
| Telegram | No, según documentación técnica actual independiente; el esquema oficial de Telegram confirma que la previsualización es un objeto generado y almacenado por Telegram | `og:title`, `og:description`, `og:image`; se observan respaldos Twitter Card y `<title>` | El orden exacto actual no está publicado por Telegram; la precedencia OG → Twitter → HTML procede de fuentes independientes | Máximo de imagen y TTL de caché oficiales: **no encontrados** |
| Mensajes de Apple | No. Apple dice expresamente que no sigue redirecciones `meta` ni ejecuta JS | Open Graph; `og:image`, `og:title`, `og:site_name`; icono como respaldo | Apple documenta esos respaldos | HTML principal <= 1 MB; recursos asociados <= 10 MB; imagen >= 900 px recomendada, < 150 px puede ignorarse; icono cuadrado >= 108 px |

Telegram no apareció entre las cuatro opciones detalladas por Erestel 2025. La última cifra peruana localizada fue 18 % en un estudio urbano de Ipsos de 2022; es demasiado antigua para usarla como cuota actual. Se incluye por compatibilidad regional, no porque esta investigación haya probado que hoy sea la segunda aplicación de SILLAR.

## Etiquetas mínimas por producto

Estas marcas deben estar ya presentes en la respuesta HTTP de `/producto/:slug`; no son código para aplicar aquí:

```html
<title>Nombre del producto · Nombre de la tienda</title>
<meta
  name="description"
  content="Descripción breve y específica del producto."
>

<link
  rel="canonical"
  href="https://tienda.example/producto/slug-estable"
>

<meta property="og:type" content="website">
<meta property="og:locale" content="es_PE">
<meta property="og:site_name" content="Nombre de la tienda">
<meta property="og:title" content="Nombre del producto">
<meta
  property="og:description"
  content="Descripción específica; en WhatsApp 80 caracteres bastan."
>
<meta
  property="og:url"
  content="https://tienda.example/producto/slug-estable"
>
<meta
  property="og:image"
  content="https://tienda.example/medios/producto-preview.jpg"
>
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="675">
<meta
  property="og:image:alt"
  content="Fotografía de Nombre del producto"
>
```

Una fotografía 16:9 de 1200 × 675 respeta la proporción ya decidida para la ficha y el límite 4:1 de WhatsApp. **No se encontró una obligación de usar 1200 × 630 en WhatsApp**; esa cifra es una convención multiplataforma, no el requisito publicado localizado. Para WhatsApp, el dato con fuente es menos de 600 KB y al menos 300 px de ancho.

## La prueba que decide el estado actual

No basta con abrir DevTools después de que cargue React. Hay que leer la respuesta original, sin ejecutar scripts, y usar dos productos distintos.

```powershell
$urls = @(
  'https://TIENDA/producto/slug-a',
  'https://TIENDA/producto/slug-b'
)

foreach ($url in $urls) {
  curl.exe --silent --show-error `
    --user-agent 'WhatsApp/2.25.0.0 A' `
    --dump-header - `
    $url
}
```

Qué debe afirmar una prueba automatizada del servidor:

1. Cada producto existente responde `200`; un `slug` inexistente responde `404`, no el shell con `200`.
2. En los primeros 300 KB de cada respuesta están `<title>`, descripción, canónica y las cuatro marcas OG.
3. `og:title`, `og:description`, `og:url` y `og:image` coinciden con ese producto; los dos `slug` producen valores distintos.
4. `og:url` es absoluta, limpia y estable: `/producto/:slug`, sin categoría ni identificadores de sesión.
5. `og:image` responde sin sesión con `200`, tipo real `image/jpeg` o `image/png`, menos de 600 KB, ancho >= 300 px y relación <= 4:1.
6. La imagen no necesita JavaScript ni una URL firmada que caduque.
7. Una comprobación manual pega una URL nueva en WhatsApp y espera hasta 10 s antes de enviarla. La tarjeta debe mostrar nombre, descripción e imagen del producto. Una URL ya compartida puede estar en caché y no sirve como única prueba.

Resultado interpretado:

- Si las dos respuestas contienen el mismo título, imagen o metadatos genéricos, **sí: hoy los productos se ven iguales al compartirlos**, aunque la pantalla sea correcta al abrirla.
- Si cada respuesta ya contiene metadatos propios antes de ejecutar JS y la imagen es pública, la sospecha queda refutada para esas rutas; todavía conviene probar WhatsApp por caché, bloqueo de bot o límites de imagen.

## Lo no encontrado

- Una URL desplegada de SILLAR o capturas de dos respuestas reales; por eso no hay veredicto factual sobre producción.
- La URL oficial original de Meta que contiene la guía detallada de WhatsApp; solo se localizó una reproducción actualizada.
- Un orden de respaldo contractual de WhatsApp cuando falta Open Graph. La guía dice que intenta otras marcas, pero advierte que no se garantizan.
- Límites actuales oficiales y orden de respaldo específicos para Messenger y Telegram.
- Un TTL oficial de caché de WhatsApp. No se incluye una duración tomada de blogs como si fuera contrato.
- Cómo la instalación local obtiene una dirección HTTPS pública. Si solo es accesible en LAN, ningún rastreador externo puede leerla.

## Fuentes

- [OSIPTEL — Erestel 2025: herramientas y servicios digitales](https://www.osiptel.gob.pe/portal-del-usuario/noticias/erestel-2025-cu%C3%A1les-son-las-herramientas-y-servicios-digitales-que-m%C3%A1s-usan-los-peruanos/)
- [Reproducción de “Link Previews | Developer Documentation” de WhatsApp, actualizada el 5-11-2025](https://support2.chatarchitect.com/books/meta-whatsapp/page/link-previews-developer-documentation)
- [Open Graph Protocol](https://ogp.me/)
- [Share Preview — comportamiento de WhatsApp y HTML inicial, 2026](https://share-preview.com/blog/whatsapp-link-preview)
- [Telegram Core — objeto `webPage` generado y cacheado](https://core.telegram.org/constructor/webPage)
- [Apple Developer — TN3156: Create rich previews for Messages](https://developer.apple.com/documentation/technotes/tn3156-create-rich-previews-for-messages)
- [Google Search Central — fundamentos SEO para JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
