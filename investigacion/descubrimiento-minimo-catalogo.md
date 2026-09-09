# Descubrimiento mínimo del catálogo público

**Veredicto — La misma respuesta HTML específica por producto puede resolver título, descripción, canónica, Open Graph y datos `Product`; no resuelve por sí sola el contenido semántico del cuerpo, los estados HTTP ni el mapa del sitio. Que el producto tenga una única URL `/producto/:slug` evita el duplicado por categoría, pero todavía conviene declarar una canónica propia y controlar parámetros/URLs alternativas.**

Fecha de consulta: 18 de agosto de 2026.

## Mínimo técnico, separado por trabajo

### Comparte solución con la previsualización

- `<title>` único y descriptivo por producto.
- `<meta name="description">` único. Google puede usarlo como fragmento, pero puede elegir texto de la página si responde mejor a la consulta.
- `<link rel="canonical">` absoluto y estable.
- Open Graph por producto.
- JSON-LD `Product` y `Offer` en el HTML inicial. Google puede procesar JSON-LD añadido con JavaScript, pero para productos recomienda el HTML inicial y advierte que el marcado dinámico puede volver menos frecuentes o fiables los rastreos de Shopping, justo donde precio y disponibilidad cambian.

Una única función del lado servidor puede generar estos datos desde la misma proyección pública del producto. Open Graph no sustituye a `meta description`, la canónica ni JSON-LD: comparten datos, no vocabulario.

### Es trabajo aparte

- Contenido semántico del cuerpo sin depender de una segunda fase de render. Google ejecuta JavaScript; no todos los bots lo hacen y el render puede esperar en cola.
- Enlaces rastreables: categorías y catálogo deben usar `<a href="/producto/slug">`, no navegación que solo exista en manejadores.
- Estados HTTP reales: producto ausente/no publicado debe entregar `404` o `410`. Una SPA que responde `200` para cualquier ruta crea *soft 404*.
- `sitemap.xml` y `robots.txt` por origen/cliente.
- Verificación continua con Rich Results Test y Search Console; los resultados enriquecidos son elegibilidad, no garantía.

## Datos estructurados de producto

Google distingue dos casos:

- **Merchant listing:** página donde la persona puede comprar en esa tienda. Puede habilitar experiencias en Search, Google Images, Lens, paneles y resultados de compra; requiere `Product` con una `Offer` y datos comerciales.
- **Product snippet:** página informativa donde no se compra directamente. Puede enriquecer el resultado con precio, disponibilidad o valoraciones según los campos válidos.

Para una ficha comprable, el núcleo mínimo investigado es:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nombre del producto",
  "image": [
    "https://tienda.example/medios/producto-1x1.jpg",
    "https://tienda.example/medios/producto-4x3.jpg",
    "https://tienda.example/medios/producto-16x9.jpg"
  ],
  "description": "Descripción pública del producto.",
  "sku": "SKU-PUBLICO-SI-EXISTE",
  "brand": {
    "@type": "Brand",
    "name": "Marca"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://tienda.example/producto/slug-estable",
    "priceCurrency": "PEN",
    "price": "129.90",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
</script>
```

No todos los campos son obligatorios en todos los casos. Solo deben emitirse datos verdaderos y visibles/coherentes con la página. No se deben inventar `review` ni `aggregateRating`; además, precio y disponibilidad necesitan invalidarse con el catálogo. La ficha de un solo producto sí coincide con la exigencia de Google de enfocar el marcado en un producto o sus variantes, no en una lista de categoría.

**Qué se gana:** elegibilidad para resultados con precio, disponibilidad, valoraciones válidas y experiencias comerciales/visuales; mejor comprensión de la entidad. **Qué no se gana:** posición garantizada, indexación garantizada ni tarjeta de WhatsApp. Un feed de Merchant Center amplía elegibilidad, pero es integración aparte y no es requisito para el mínimo de esta investigación.

## Título y descripción por página

Google recomienda un `<title>` descriptivo y distinto en cada página. Construye el enlace de título con varias señales —`<title>`, encabezado principal, texto prominente, `og:title` y enlaces— y puede reescribirlo. Por eso las señales deberían coincidir.

La meta descripción también debe ser propia del producto. Google la usa a veces; no hay un límite normativo de caracteres y el resultado se recorta según el dispositivo. Para WhatsApp, en cambio, la guía localizada dice que 80 caracteres bastan y muestra una o dos líneas. Se puede partir de una misma descripción corta, pero son consumidores diferentes.

Si ambos valores solo se cambian después con JavaScript:

- Google puede verlos cuando renderiza.
- WhatsApp y Apple Messages no los verán.
- La salida compartida es incluirlos ya en la respuesta inicial.

## Canónicas y categorías

El hecho descrito —un producto se enlaza desde varias categorías pero siempre abre `/producto/:slug`— **no crea contenido duplicado**. Varias rutas de navegación apuntando a una sola dirección no equivalen a varias direcciones con el mismo contenido. La categoría principal usada en la miga de pan tampoco cambia la canónica.

Todavía falta comprobar que no existan variantes accesibles, por ejemplo:

- `/catalogo/categoria/producto/slug` además de `/producto/slug`;
- parámetros de campaña, orden, vista o categoría que devuelvan el mismo producto;
- mayúsculas, barra final o dominios/esquemas alternativos;
- slug antiguo que siga con `200` en vez de redirigir permanentemente al actual.

Por producto, la señal coherente es:

```html
<link
  rel="canonical"
  href="https://tienda.example/producto/slug-estable"
>
<meta
  property="og:url"
  content="https://tienda.example/producto/slug-estable"
>
```

La canónica es una señal, no una orden. Google recomienda coherencia entre `rel=canonical`, enlaces internos, redirecciones y sitemap. Una canónica propia (*self-canonical*) no es imprescindible para que la única URL sea única, pero explicita el contrato y protege frente a parámetros/variantes.

Si alguna vez se cambia un slug manualmente, el anterior debería responder con redirección permanente a la nueva canónica; de lo contrario se rompe precisamente el enlace compartido que la regla de datos protege. La política exacta de slugs históricos no está descrita.

## Sitemap que cambia con el catálogo

Google dice que un sitio pequeño —aproximadamente 500 páginas indexables o menos— bien enlazado puede no necesitar sitemap. Cincuenta productos no lo vuelven obligatorio. Sí puede ayudar cuando el sitio es nuevo, tiene pocos enlaces externos, crece, o quiere facilitar el descubrimiento de imágenes y cambios.

No debe mantenerse a mano. Tres mecanismos posibles, alineados con las arquitecturas del informe anterior:

1. **Endpoint dinámico con caché:** consulta URLs publicadas y devuelve XML; invalida al mutar el catálogo.
2. **Archivo regenerado al mutar:** escribe `sitemap.xml` de forma atómica; necesita recuperación si falla.
3. **Generación al publicar/build:** válida solo si cada cambio del catálogo dispara esa publicación.

Contenido mínimo:

- solo URLs canónicas, absolutas y públicas;
- catálogo, categorías indexables y productos publicados;
- `lastmod` únicamente cuando refleja una modificación real relevante;
- exclusión de borradores, productos eliminados y variantes con parámetros;
- referencia desde `robots.txt` y envío una vez por origen a Search Console.

Cada cliente/origen necesita su propio mapa. Una instalación local no alcanzable desde Internet puede generar XML correcto, pero ningún buscador externo podrá leerlo.

## Qué no conviene aplazar sin contrato

No es una elección de arquitectura, sino identificación del coste de rehacer:

- Mantener una sola URL canónica por producto y redirigir cualquier variante.
- Poder proyectar los datos públicos sin depender del estado del navegador.
- Distinguir producto publicado, privado, eliminado e inexistente con estados HTTP.
- Tener eventos o invalidación cuando cambian precio, disponibilidad, imagen o publicación.
- Saber cuál es el origen público por instalación.

SSR del cuerpo, Merchant Center, estrategia de contenido, analítica SEO y campañas pueden añadirse después como trabajos separados. Rehacer URLs o recuperar múltiples fuentes inconsistentes de precio/canónica es lo costoso.

## Lo no encontrado

- Si SILLAR permite comprar directamente en la ficha o solo contactar: esto decide `Merchant listing` frente a `Product snippet`.
- Qué variantes de URL devuelve hoy el servidor y qué estado usa un `slug` inexistente.
- Si se conservan slugs anteriores y existen redirecciones.
- El límite esperado de productos por cliente y si las categorías se consideran indexables.
- La disponibilidad pública de instalaciones locales.

## Fuentes

- [Google Search Central — introducción a datos `Product`](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Google Search Central — `Product` para merchant listings](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [Google Search Central — `Product` para product snippets](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [Google Search Central — generar datos estructurados con JavaScript](https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript)
- [Google Search Central — títulos](https://developers.google.com/search/docs/appearance/title-link)
- [Google Search Central — meta descripciones](https://developers.google.com/search/docs/appearance/snippet)
- [Google Search Central — consolidar URLs duplicadas](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google Search Central — cuándo hace falta un sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Google Search Central — construir un sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search Central — JavaScript SEO y *soft 404*](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
