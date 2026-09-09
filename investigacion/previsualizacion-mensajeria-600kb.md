# Derivado para previsualización en mensajería

**Veredicto: ninguna combinación fija de dimensiones y «calidad» garantiza menos de 600 KB; la garantía solo existe si se codifica, se cuenta el archivo real y se reduce calidad o dimensiones hasta cumplir. Para máxima compatibilidad del robot, el punto de partida defendible es JPEG sRGB de 1200 × 630, con objetivo operativo de 550 000 bytes y aserción dura menor de 600 000.**

Fecha de comprobación: 19 de agosto de 2026.

## Qué exige WhatsApp y qué no dice

La documentación de previsualizaciones de WhatsApp, republicada y actualizada el 5 de noviembre de 2025, indica:

- `og:image` debe ser una URL absoluta;
- la imagen debe pesar menos de 600 KB;
- debe medir al menos 300 px de ancho;
- su proporción ancho/alto no debe superar 4:1;
- las etiquetas deben aparecer en los primeros 300 KB del HTML;
- si no se cumplen las condiciones, WhatsApp puede relajar reglas, buscar otras etiquetas o mostrar una tarjeta pequeña.

La fuente disponible es la [copia de la documentación para desarrolladores](https://support.chatarchitect.com/books/meta-whatsapp/page/link-previews-developer-documentation). No se encontró la misma página accesible hoy bajo un dominio oficial de Meta; el límite de 600 KB ya estaba confirmado por la investigación anterior del proyecto.

WhatsApp **no publica allí** una dimensión recomendada de 1200 × 630, un valor de calidad JPEG ni una lista contractual de formatos modernos. 1200 × 630 (1,91:1) es una convención Open Graph interoperable, no un requisito de WhatsApp. El [protocolo Open Graph](https://ogp.me/) sí define `og:image`, tipo, anchura, altura y texto alternativo.

## Dimensiones, proporción y calidad

### Contrato propuesto para validar, no decisión adoptada

```text
Lienzo inicial       1200 × 630 px (1,9048:1)
Formato              JPEG baseline, 8 bits, sRGB, sin metadatos
Calidad inicial      82 como punto de partida, no como garantía
Objetivo operativo   <= 550 000 bytes
Condición externa    < 600 000 bytes medidos en el archivo terminado
Suelo de calidad     debe definirse visualmente con un corpus; no encontrado
```

La calidad JPEG de 82 no es una unidad universal: cada codificador mapea la escala de forma distinta y la entropía de la foto cambia el resultado. Una foto con ruido, pelo, hojas o texto puede pesar mucho más que una toma limpia al mismo tamaño y ajuste. Por eso «1200 × 630, calidad 82» puede ser el primer intento, nunca la garantía.

El algoritmo fiable es:

```text
1. Autoorientar y convertir a sRGB.
2. Componer el lienzo 1200 × 630.
3. Codificar JPEG sin metadatos con calidad inicial 82.
4. Medir bytes reales.
5. Si supera 550 000 B, bajar calidad dentro del suelo visual acordado.
6. Si aún supera, reducir a 1000 × 525 y después 800 × 420.
7. Repetir y aceptar solo si el resultado mide < 600 000 B.
8. Si para cumplir hay que cruzar el suelo de calidad, usar la salida de
   contingencia que se decida: tarjeta genérica o aviso de foto inadecuada.
```

Una búsqueda binaria de calidad reduce intentos, pero debe ejecutarse sobre los bytes reales. El margen de 50 000 B evita quedar en el borde por diferencias de codificador o por añadir accidentalmente un perfil. Si «KB» se interpretara como KiB, 600 KiB serían 614 400 B; usar 600 000 B es la lectura conservadora.

## Qué hacer con una foto cuadrada

Una foto cuadrada no encaja limpiamente en un lienzo 1,91:1:

- **`cover`**: al escalar un cuadrado a 1200 px de ancho, solo quedan visibles 630 de sus 1200 px de alto. Se conserva 52,5 % de la altura y se recorta 23,75 % arriba y abajo. Puede cortar el producto.
- **`contain`**: el cuadrado ocupa 630 × 630 y deja 285 px a cada lado. No corta nada, pero el producto ocupa solo 52,5 % del ancho de la tarjeta.
- **tarjeta compuesta**: conserva el cuadrado y usa el espacio lateral para marca o contexto. Evita el recorte, pero introduce una plantilla, tipografía, localización y contraste que deben mantenerse.

No hay una respuesta puramente técnica. Lo que sí se puede fijar es una zona segura central y prohibir que precio o nombre esencial estén horneados en la foto: las aplicaciones recortan y maquetan la tarjeta de forma distinta. Título, descripción y precio pertenecen al HTML Open Graph.

Si se usa un fondo plano para `contain`, su color debe proceder del mismo token validado del sistema de diseño, exportado a la configuración del generador; no puede aparecer como literal suelto en C#. Un duplicado ampliado y desenfocado de la propia foto evita un color literal, pero aumenta entropía, bytes y ruido visual.

## Fuente mínima

- Para llenar 1200 × 630 con un recorte nítido, la imagen ya orientada necesita al menos 1200 px de ancho y 630 px de alto, además de encuadre apto para el recorte.
- Para contener un cuadrado sin ampliarlo, bastan 630 × 630; el producto no llenará el ancho.
- Para llevar un cuadrado a 1200 px de ancho sin inventar detalle, la fuente debe ser al menos 1200 × 1200, sabiendo que casi la mitad de la altura se recortará.

Una foto cuadrada pequeña puede convertirse técnicamente en un JPEG de 1200 × 630, pero el escalado no crea detalle. Si el origen es menor que el área usada, la previsualización puede verse blanda en pantallas densas. Esto debe detectarse y comunicarse; no hay filtro que lo arregle.

## Formato consumido por un robot

**JPEG baseline es la opción de compatibilidad, no la de compresión máxima.** JPEG está ampliamente entendido por rastreadores, comprime bien fotografías y permite controlar bytes. PNG es apropiado para gráficos o transparencia, pero suele ser peor para una foto. AVIF y WebP pueden ahorrar bytes, pero no se encontró una lista oficial y actual de formatos `og:image` garantizados por WhatsApp y las demás aplicaciones de mensajería relevantes; no deben ser el único archivo de previsualización basándose en soporte de navegadores.

La salida debe:

- estar disponible por HTTPS y sin sesión, cookies ni encabezados especiales;
- responder con el `Content-Type` real `image/jpeg`;
- tener URL absoluta y estable;
- declarar `og:image:type`, `og:image:width`, `og:image:height` y `og:image:alt` junto a `og:image`;
- no depender de JavaScript para insertar las etiquetas;
- tener metadatos retirados y píxeles ya orientados.

## Coste de almacenamiento y replicación

Este es un derivado distinto de los del catálogo. Si se guarda y replica, con objetivo máximo de 550 000 B:

- 50 productos: hasta 27 500 000 B, aproximadamente 26,2 MiB por instalación;
- 1 000 productos: hasta 550 MB decimales, antes de copias históricas o respaldos.

El promedio real debería ser menor, pero no se debe presupuestar sin corpus. Si se regenera en destino, se replica el original y el coste pasa a CPU inicial; si se replica el derivado, viajan esos bytes. Este informe no elige entre ambos caminos.

## Coste de generación en máquina modesta

El trabajo es el mismo pipeline investigado para los demás derivados: identificar, decodificar, autoorientar, convertir color, componer, redimensionar y codificar una o varias veces hasta cumplir bytes. El bucle de calidad añade codificaciones, aunque opera ya sobre un lienzo pequeño de 1200 × 630; conviene decodificar y redimensionar el original una sola vez y repetir solo el codificador sobre ese búfer.

**No se encontró una medición publicada del caso exacto en un PC de tienda de ocho años.** No se asigna una cifra inventada. El informe de límites contiene el benchmark cercano y el protocolo que debe ejecutarse antes de decidir generación bajo demanda.

## Pruebas que convierten el límite en contrato

Para cada fixture de alto detalle, ruido, producto liso, foto oscura, foto cuadrada y fuente pequeña:

```text
assert formato_real == JPEG
assert ancho >= 300
assert ancho / alto <= 4
assert bytes < 600_000
assert orientación_visual_correcta
assert no_exif_gps_xmp_iptc
assert og:image es absoluta, pública y devuelve image/jpeg
```

Además, una prueba de integración debe descargar la URL sin sesión con un `User-Agent` de WhatsApp y comprobar que no hay redirección a login ni bloqueo por robots/WAF. No puede afirmar que WhatsApp renderizará exactamente un recorte: eso requiere una comprobación manual o automatizada fuera del producto y está sujeto a caché del servicio.

## Datos no encontrados

- No se encontró documentación oficial de WhatsApp que garantice AVIF o WebP para `og:image`.
- No se encontró una «calidad JPEG mínima» universal; la escala depende del codificador y la aceptabilidad visual del catálogo.
- No se encontró una cifra de tiempo/CPU del pipeline exacto en el hardware local objetivo.
- No se sabe si las fotos existentes alcanzan 630 o 1200 px en el encuadre útil; debe medirse antes de exigir una plantilla.
