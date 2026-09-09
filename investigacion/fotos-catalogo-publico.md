**Veredicto: los mayores ahorros no vienen de elegir un códec aislado, sino de no enviar píxeles invisibles y no descargar las 50 fotos al entrar; una entrega bien dimensionada queda en torno a 1–2 MB al recorrer todo el catálogo, mientras el peor caso permitido llega a 250 MB.**

# Fotos del catálogo público

Fecha de consulta y medición: 18 de agosto de 2026 (America/Lima).

## Ficha rápida

| Campo | Resultado de investigación |
|---|---|
| QUÉ RESUELVE | Reducir transferencia, LCP, consumo de datos y desplazamientos de maquetación en la tienda pública. |
| DÓNDE VIVE | Tienda pública. Las decisiones de generación y replicación pertenecen al servidor, no al componente React. |
| TERCEROS | Ninguno necesario. `<picture>`, `srcset`, `sizes`, `loading` y `fetchpriority` funcionan con archivos servidos por la propia instalación. |
| CDN EXTERNA | Puede acelerar la instalación en nube, pero no es una base válida para el producto local. Todo el planteamiento de este informe funciona sin CDN. |
| QUÉ SE REPLICA | Depende de si un derivado se declara medio canónico o caché regenerable. Esa distinción todavía no está especificada. |
| NÚMERO DE TAMAÑOS | No encontrado como cifra cerrada: faltan los anchos reales de los espacios de la rejilla y la ficha. Con una o dos anchuras de espacio por uso suelen resultar dos o tres anchos, no cuatro por defecto. |
| CIFRA DE 50 PRODUCTOS | Mejor entrega: 1–2 MB tras recorrerlos todos; 80–160 KB para cuatro fotos iniciales. Peor caso permitido: 250 MB; una sola foto de 5 MB ya consume 25 s de transferencia a 1,6 Mb/s. |

## Hallazgo que contradice una restricción insuficiente

El límite de subida de 5 MB **no limita el coste de decodificación**. Un JPEG o PNG pequeño en disco puede declarar decenas o cientos de megapíxeles y obligar al procesador a reservar mucha memoria cuando se abre. Esto afecta especialmente a generación bajo demanda en la máquina de una tienda.

Antes de evaluar cualquier variante que decodifique imágenes hacen falta también:

- máximo de anchura y altura;
- máximo de píxeles `anchura × altura`;
- límite de memoria, tiempo y concurrencia del proceso de imagen;
- rechazo antes de realizar todas las transformaciones posibles.

OWASP ASVS 5.0 pide expresamente rechazar imágenes cuyo número de píxeles supere el máximo para evitar ataques de *pixel flood*. ImageMagick documenta el caso de una imagen preparada para expandirse a 20 000 × 20 000 píxeles y recomienda límites de área, memoria, disco y tiempo. Fuentes: [OWASP ASVS, V5.2.6](https://cornucopia.owasp.org/taxonomy/asvs-5.0/05-file-handling/02-file-upload-and-content) e [ImageMagick Security Policy](https://imagemagick.org/security-policy/).

No se propone aquí un número para ese máximo: debe salir de la mayor resolución que la ficha pueda servir, el margen de recorte y la memoria mínima soportada. Los 5 MB por sí solos no bastan.

---

## 1. Formatos

### Soporte actual

Datos globales de julio de 2026:

| Formato | Uso global con soporte | Primeras versiones relevantes | Observación |
|---|---:|---|---|
| AVIF | 94,67 % | Chrome 85, Edge 121, Firefox 93, Safari completo 16.4 | Safari 16.1–16.3 tiene soporte parcial; iOS anterior a 16 no lo abre. |
| WebP | 96,18 % | Chrome 32, Edge 18, Firefox 65, Safari completo 16 | Safari 14–15.6 tiene soporte parcial dependiente también del sistema operativo. |
| JPEG | Prácticamente universal | Navegadores históricos y actuales | Respaldo de mayor alcance y decodificación muy madura. |

Fuentes actuales: [Can I Use — AVIF](https://caniuse.com/avif), [Can I Use — WebP](https://caniuse.com/webp) y [MDN — Image file type and format guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types).

El porcentaje global no es el porcentaje de clientes de SILLAR en Perú. No se encontraron analíticas ni una matriz mínima de navegadores del producto; sin una de esas dos cosas no se puede declarar muerto el respaldo.

### Cuánto ahorran de verdad

No existe un porcentaje fijo por formato. Cambian el contenido, la resolución, el encoder, su esfuerzo y el criterio con el que se iguala la calidad.

Como referencia amplia, Google midió WebP sobre conjuntos fotográficos Kodak y Tecnick y obtuvo archivos entre 25 % y 34 % menores que JPEG al mismo SSIM. web.dev recoge casos de AVIF superiores al 50 % frente a JPEG, pero también advierte que el ahorro exacto depende del contenido y de la configuración. Fuentes: [Google — WebP Compression Study](https://developers.google.com/speed/webp/docs/webp_study) y [web.dev — Compress images with AVIF](https://web.dev/articles/compress-images-avif).

Eso no debe convertirse en presupuesto sin medir fotos de producto. Se hicieron dos mediciones reproducibles sobre medios públicos de producto de Cloudinary, redimensionados y recortados a cuadrado con su ajuste automático de calidad. Cloudinary fue **solo la fuente de la muestra y el encoder de la medición**, no una dependencia propuesta para SILLAR.

| Muestra real | Tamaño | JPEG | WebP | AVIF | WebP frente a JPEG | AVIF frente a JPEG |
|---|---:|---:|---:|---:|---:|---:|
| Mochila, fotografía JPEG de origen | 480 × 480 | 42 136 B | 42 096 B | 38 999 B | 0,1 % menor | 7,4 % menor |
| Zapato, *packshot* PNG de origen | 480 × 480 | 24 392 B | 29 796 B | 20 737 B | **22,2 % mayor** | 15,0 % menor |
| Zapato, *packshot* PNG de origen | 320 × 320 | 14 938 B | 17 770 B | 14 684 B | **19,0 % mayor** | 1,7 % menor |

URLs base medidas:

- `https://res.cloudinary.com/demo/image/upload/c_fill,w_480,h_480,q_auto,f_{formato}/backpack.jpg`
- `https://res.cloudinary.com/demo/image/upload/c_fill,w_480,h_480,q_auto,f_{formato}/samples/ecommerce/shoes.png`

La cabecera `Server-Timing` confirmó para la mochila un original JPEG de 890 × 593 y 207 491 bytes. `q_auto` intenta igualar calidad de entrega, pero es un algoritmo propietario y no una prueba perceptual independiente. Por eso estas cifras son una muestra de realidad —incluido un WebP peor que JPEG—, no una promesa del encoder que finalmente use el producto.

Cloudinary publica además un ejemplo a calidad aproximadamente equivalente con 64,7 KB en JPEG, 48,6 KB en WebP y 31,6 KB en AVIF: 25 % y 51 % de ahorro respectivamente. La gran distancia entre ese ejemplo y las dos muestras anteriores confirma que hay que medir un corpus del catálogo, no adoptar una media de Internet. [Cloudinary — matched quality](https://cloudinary.com/blog/how_to_adopt_avif_for_images_with_cloudinary#matched_quality).

### Coste de codificación

El estudio CID22 de Cloudinary midió, en un Intel Core i7-9750H y un solo hilo:

| Encoder estudiado | Rendimiento aproximado |
|---|---:|
| MozJPEG | 3 megapíxeles/s |
| libwebp | 6 megapíxeles/s |
| libaom AVIF, ajuste rápido `s7` | 2 megapíxeles/s |
| libaom AVIF, ajuste lento `s1` | 0,1 megapíxeles/s |

Fuente: [Cloudinary Image Dataset ’22, metodología, página 2](https://cloudinary-marketing-res.cloudinary.com/image/upload/v1682076683/CID22.pdf).

La velocidad se refiere a píxeles **de salida** y no incluye todo el coste de leer, orientar, recortar y redimensionar el original. Una variante de 480 × 480 tiene 0,23 MP; diez variantes suman sus respectivos píxeles de salida. El AVIF lento puede consumir veinte veces más CPU que el rápido antes de contar el resto del proceso. web.dev lo resume así: AVIF puede ser competitivo en ajustes normales, pero es el más lento para generación en caliente cuando se busca el máximo ahorro. [web.dev — AVIF encode speed](https://web.dev/articles/avif-updates-2023#avif_encode_speed).

En una máquina de tienda antigua esas cifras serán peores y compartirán CPU, memoria y disco con el producto. No se encontró un benchmark del hardware mínimo real de SILLAR; debe medirse en esa máquina antes de permitir AVIF síncrono en una petición.

### ¿Sigue haciendo falta respaldo?

El navegador elige una sola fuente de `<picture>`; no descarga AVIF, WebP y JPEG a la vez. Por tanto, el respaldo casi no cuesta red al visitante, pero sí cuesta disco, generación y replicación.

Hay cuatro cadenas técnicamente válidas, con distinto coste:

| Cadena | Archivos por ancho | Qué cubre | Coste |
|---|---:|---|---|
| AVIF → JPEG | 2 | Máximo ahorro moderno y respaldo universal | Omite el escalón WebP; menos derivados. |
| AVIF → WebP → JPEG | 3 | Navegadores que aceptan WebP pero no AVIF, además de históricos | Multiplica más almacenamiento para una franja pequeña. |
| WebP → JPEG | 2 | Soporte moderno más profundo y encoder rápido | Renuncia al posible ahorro adicional de AVIF. |
| Un único formato moderno | 1 | Solo si el contrato mínimo de navegadores lo garantiza | Sin respaldo para dispositivos excluidos. |

Con 94,67 % de soporte global de AVIF, WebP intermedio solo beneficia al subconjunto «WebP sí, AVIF no». No se encontró cuánto representa ese subconjunto entre clientes del catálogo de SILLAR. Por eso generar los tres formatos no está justificado todavía, pero tampoco se puede eliminar todo respaldo.

El original ya guardado puede ser respaldo solo si su formato es decodificable por navegador y su proporción/transferencia son aceptables. Un PNG de 5 MB usado como respaldo de una tarjeta no es un respaldo gratuito para el visitante que lo necesite.

---

## 2. Tamaños, `srcset`, `sizes` y `<picture>`

### Cuántos tamaños hacen falta

Las proporciones conocidas —1:1 y 16:9— resuelven la reserva de espacio, pero no dicen cuántos píxeles necesita cada espacio. Hace falta conocer:

- ancho CSS mínimo y máximo de una tarjeta en cada configuración de columnas;
- ancho CSS máximo de la foto en la ficha;
- densidades de píxel que se decide cubrir;
- ancho real máximo del original;
- diferencia de bytes entre candidatos tras codificar fotos representativas.

La fórmula de partida es:

```text
ancho requerido = mínimo(ancho del original,
                         techo(ancho CSS del espacio × DPR objetivo))
```

Proceso sin inventar cortes:

1. Medir el ancho del espacio de imagen en todos los *breakpoints* reales y en los extremos fluidos.
2. Multiplicar esos anchos por los DPR que el producto decida soportar.
3. Eliminar duplicados y todo resultado mayor que el original.
4. Codificar un corpus de fotos reales en esos anchos.
5. Unir dos candidatos cuando el menor ahorro de bytes no compense almacenar, replicar y mantener otro derivado.

Si el cuadrado tiene un único ancho CSS, 1× y 2× requieren solo dos tamaños. Si tiene dos anchos según rejilla, la unión suele quedar en dos o tres después de deduplicar. No hay razón automática para generar cuatro. La ficha 16:9 es otro uso y puede necesitar su propio conjunto.

No se encontraron los anchos CSS ni un presupuesto de diferencia mínima de bytes; por eso el número definitivo queda señalado como no encontrado.

### Responsabilidad de cada atributo

- `srcset` enumera candidatos de la **misma composición y proporción**, usando anchos reales como `320w`, `480w` y `640w`.
- `sizes` dice cuánto mide el espacio en el diseño antes de que el navegador conozca todo el CSS. Sin él, un `srcset` con descriptores `w` asume por defecto `100vw` y puede escoger una imagen demasiado grande.
- `<picture>` es útil para formatos alternativos o dirección artística. No es necesario solo para cambiar resolución si se conserva un formato.
- El navegador combina `sizes`, DPR, zoom y condiciones de red para seleccionar un candidato; la aplicación no debe detectar «móvil» con JavaScript.

Fuentes: [MDN — Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images), [MDN — `<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img) y [MDN — `<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture).

Ejemplo estructural —los anchos y condiciones son marcadores que deben sustituirse por los medidos—:

```html
<picture>
  <source
    type="image/avif"
    srcset="producto-cuadrado-320.avif 320w,
            producto-cuadrado-480.avif 480w,
            producto-cuadrado-640.avif 640w"
    sizes="(condición-real-de-rejilla) ancho-real-del-espacio,
           ancho-real-por-defecto"
  >
  <source
    type="image/webp"
    srcset="producto-cuadrado-320.webp 320w,
            producto-cuadrado-480.webp 480w,
            producto-cuadrado-640.webp 640w"
    sizes="(condición-real-de-rejilla) ancho-real-del-espacio,
           ancho-real-por-defecto"
  >
  <img
    src="producto-cuadrado-480.jpg"
    srcset="producto-cuadrado-320.jpg 320w,
            producto-cuadrado-480.jpg 480w,
            producto-cuadrado-640.jpg 640w"
    sizes="(condición-real-de-rejilla) ancho-real-del-espacio,
           ancho-real-por-defecto"
    width="640"
    height="640"
    alt="Descripción concreta del producto"
  >
</picture>
```

La fuente WebP se elimina si la matriz elegida es AVIF → JPEG; no se conserva «por si acaso».

---

## 3. Carga diferida y prioridad

`loading="lazy"` debe ir en imágenes fuera del primer viewport. Los navegadores que no soportan el atributo lo ignoran y cargan normalmente; no hace falta una biblioteca ni JavaScript.

No debe ir en:

- la imagen que probablemente será LCP;
- las tarjetas visibles al entrar;
- una imagen crítica introducida tarde por JavaScript cuando podría aparecer en el HTML inicial.

web.dev es explícito: nunca se debe diferir la imagen LCP. En una prueba sobre páginas WordPress, dejar de aplicar `lazy` sobre imágenes iniciales mejoró el LCP móvil del listado un 18 % respecto al comportamiento que las difería. Fuentes: [Browser-level image lazy loading](https://web.dev/articles/browser-level-image-lazy-loading), [Optimize LCP](https://web.dev/articles/optimize-lcp) y [The performance effects of too much lazy loading](https://web.dev/articles/lcp-lazy-loading).

Patrón para la rejilla:

1. La foto que las mediciones identifiquen como candidata LCP: `loading="eager" fetchpriority="high"`.
2. Las demás fotos realmente visibles en el viewport inicial: `loading="eager"`, prioridad automática.
3. El resto: `loading="lazy"`, sin prioridad alta.

`fetchpriority="high"` es una pista, no una orden ni una precarga. Subir muchas imágenes a prioridad alta anula la utilidad de la señal y crea competencia con CSS, fuentes y la verdadera LCP. web.dev recomienda una o, como máximo, muy pocas candidatas. El soporte global registrado es 92,65 %; los navegadores antiguos lo ignoran sin romper la imagen. Fuentes: [MDN — fetchpriority](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/fetchpriority) y [Can I Use — fetchpriority](https://caniuse.com/mdn-html_elements_img_fetchpriority).

No se puede fijar desde este informe cuántas tarjetas son iniciales. Debe observarse la matriz de viewports soportados. Como regla de implementación, se marca como `eager` el mayor número que pueda verse inicialmente en las pruebas, no «las primeras diez» por costumbre.

---

## 4. Evitar que la página salte

`aspect-ratio` **puede reservar el espacio por sí solo** si se aplica a un contenedor cuyo ancho ya está determinado. Aun así conviene declarar `width` y `height` en el `<img>`:

- el navegador obtiene la proporción al parsear HTML, antes de cargar CSS e imagen;
- queda una defensa si la hoja de estilos tarda o falla;
- se documentan las dimensiones intrínsecas del candidato;
- los navegadores modernos convierten esos atributos en una proporción intrínseca `auto w / h`.

Para la rejilla:

```html
<div class="foto-producto foto-producto--cuadrada">
  <img src="..." width="640" height="640" alt="...">
</div>
```

```css
.foto-producto--cuadrada {
  aspect-ratio: 1;
  overflow: hidden;
}

.foto-producto--cuadrada > img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
```

Para la ficha se usa `width="1280" height="720"` —o cualquier pareja entera 16:9 que coincida con el candidato— y `aspect-ratio: 16 / 9` en el contenedor.

Todos los candidatos de un mismo `srcset` deben compartir proporción. Si `<picture>` cambia también el recorte según condición, se declaran `width` y `height` en cada `<source>`. Fuente: [web.dev — Optimize CLS](https://web.dev/articles/optimize-cls).

Resultado: para estas dos composiciones, el contenedor con proporción fija evita el salto; los atributos HTML siguen siendo la segunda barrera recomendable. Ninguno reemplaza `object-fit` cuando se quiere recortar.

---

## 5. Dónde generar derivados

### Comparación de los tres caminos

| | Al subir | Bajo demanda con caché | Ningún derivado |
|---|---|---|---|
| Disco | Original + todos los derivados persistentes. | Original + solo derivados que se hayan pedido; la caché crece con uso. | Solo original. |
| Replicación | Si los derivados son medios canónicos, viajan todos. | Puede replicarse solo el original y regenerar caché en destino, **si** la caché queda fuera del contrato de medios. | Viaja solo el original. |
| CPU | Pico controlable una vez por subida; puede ejecutarse en cola. | En la primera petición de cada combinación de tamaño/formato/recorte. | Cero CPU de codificación en servidor. |
| Primera vez | La subida tarda o queda procesando; la primera visita ya encuentra archivos listos. | La primera visita paga generación, salvo que se sirva temporalmente un respaldo. | No hay generación; la primera visita paga todos los bytes. |
| Concurrencia | Fácil limitar trabajos en segundo plano. | Riesgo de estampida: varias peticiones pueden intentar crear lo mismo; exige bloqueo por clave y escritura atómica. | El origen y la red sirven originales grandes a cada caché fría. |
| Máquina modesta | Trabajo pesado concentrado al administrar, pero puede bloquear si es síncrono. | El cliente público puede activar AVIF mientras el negocio usa el equipo; peor interferencia. | Servidor simple; clientes y enlace soportan transferencia y decodificación. |
| Fallo de encoder | Se rechaza o marca la subida; no contamina una petición pública. | Puede convertir la primera vista en error o latencia extrema; necesita respaldo y tiempo máximo. | No aplica. |
| Invalidación | Nombre nuevo del original debe producir nuevas variantes. | La clave debe incluir identidad del original, geometría, formato y versión de receta. | Solo cambia el original. |

### Qué se replica y qué se regenera

**Al subir:** si se producen `S` tamaños cuadrados, `D` tamaños 16:9 y `F` formatos, aparecen `F × (S + D)` derivados por foto. Con tres tamaños de rejilla, dos de ficha y dos formatos serían diez archivos adicionales; con tres formatos serían quince. Para cincuenta productos: 500 o 750 derivados, además de los cincuenta originales. Son ejemplos algebraicos, no un conjunto adoptado.

Si todos se guardan junto a medios canónicos, se replican todos sus bytes. No es válido contar una sola vez «la foto».

**Bajo demanda:** puede replicarse únicamente el original y regenerar en cada destino, pero solo si los derivados se definen formalmente como caché descartable. Al llegar un nodo nuevo, la primera petición vuelve a pagar CPU. Si se borra la caché, ocurre lo mismo.

**Nada:** se replica únicamente el original y no se regenera nada.

### Conflicto con el identificador de archivo

La regla actual dice que el nombre del archivo es el identificador compartido por fila y disco. Un conjunto de derivados introduce varios nombres para una sola fila. No se puede añadir `-320.avif`, `-640.webp`, etc. como detalle informal sin definir cuál de estas dos arquitecturas rige:

1. **Derivados canónicos:** cada variante tiene identidad/manifestación persistente y forma parte de la replicación.
2. **Caché derivada:** la base conserva solo el identificador del original; la URL derivada se calcula de manera determinista bajo un espacio de caché excluido de replicación y puede borrarse/regenerarse.

La segunda permite regenerar en destino, pero es un cambio explícito del contrato: esos nombres no son medios autónomos. Además, la clave debe incluir versión de receta/encoder para no servir bytes antiguos con el mismo nombre.

Este punto toca arquitectura y no se decide en el informe.

### Coste en hardware modesto

- Codificar WebP suele consumir menos tiempo que AVIF al mismo nivel de esfuerzo.
- AVIF rápido puede ser viable en una cola; AVIF de esfuerzo alto no debe asumirse viable en la ruta de una petición.
- Varias transformaciones simultáneas necesitan límite de concurrencia; «un hilo por petición» puede dejar sin respuesta al resto del producto.
- Si el caché de píxeles desborda memoria y cae a disco, el proceso puede volverse órdenes de magnitud más lento. ImageMagick advierte que su caché en disco puede ser hasta mil veces más lenta que memoria. [ImageMagick — Architecture](https://imagemagick.org/architecture/).
- El número definitivo solo puede salir de un benchmark en la máquina mínima, con un corpus de cargas válido y adversarial. No encontrado.

### CDN externa, aparte

Una CDN de imágenes puede generar formatos y tamaños al vuelo cerca del usuario y ocultar gran parte de esta complejidad en nube. Contradice la instalación local si se convierte en requisito, introduce coste por servicio y envía medios a un tercero.

Puede existir como aceleración opcional del producto en nube únicamente si:

- las URLs y el HTML tienen una ruta equivalente desde el origen propio;
- local conserva generación/caché y entrega sin conectarse a terceros;
- la indisponibilidad del servicio no rompe las fotos;
- replicación no depende de la CDN como almacén canónico.

Nada de `srcset`, `<picture>`, carga diferida o prioridad depende de una CDN.

---

## 6. La cifra: cincuenta productos desde un móvil

### Supuestos de cálculo

Para hacer comparables los extremos se usa el perfil móvil recomendado por Lighthouse:

- 1,6 Mb/s de bajada = aproximadamente 200 KB/s;
- 150 ms de latencia;
- sin pérdida de paquetes.

Lighthouse indica que representa aproximadamente el cuartil inferior de 4G y el superior de 3G. Fuente: [Lighthouse — Network throttling](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md).

Se separan tres cosas:

1. **Contribución de una foto LCP:** desde que el HTML hace descubrible su URL hasta transferir sus bytes.
2. **Primer viewport reconocible:** cuatro fotos como ejemplo de una rejilla móvil; el número real debe medirse.
3. **Catálogo completo transferido:** después de recorrer los cincuenta productos.

No se dispone del TTFB, HTML, CSS, JavaScript, fuentes, consultas, hidratación ni tiempo de decodificación de SILLAR. Por eso no es honesto dar un tiempo total de «aplicación interactiva». Las cifras siguientes son el suelo atribuible a las fotos.

### Mejor entrega técnicamente alcanzable

Supuesto derivado de las muestras medidas: cada cuadrado móvil correctamente dimensionado pesa entre 20 y 40 KB en el formato elegido; la primera foto tiene prioridad alta, cuatro son `eager` y las otras 46 son `lazy`.

| Momento | Bytes de fotos | Transferencia a 1,6 Mb/s | Con una latencia de referencia |
|---|---:|---:|---:|
| Foto LCP | 20–40 KB | 0,10–0,20 s | aproximadamente 0,25–0,35 s desde que se solicita |
| Cuatro fotos iniciales | 80–160 KB | 0,40–0,80 s | aproximadamente 0,55–0,95 s desde que se solicitan |
| Las cincuenta, tras recorrer | 1–2 MB | 5–10 s acumulados | más peticiones/latencia y desplazamiento del usuario |

Así, la capa de imágenes puede dejar reconocible la primera rejilla en menos de un segundo después de que sus URLs sean descubribles. No prueba que la tienda completa sea usable en menos de un segundo: falta medir el resto de la aplicación.

### Peor caso permitido por las reglas actuales

Supuesto: cincuenta originales de 5 MB, tamaño máximo admitido, todos descubiertos/cargados sin derivados adecuados.

| Momento | Bytes de fotos | Suelo de transferencia a 1,6 Mb/s |
|---|---:|---:|
| Una foto | 5 MB | 25 s |
| Cuatro fotos iniciales | 20 MB | 100 s |
| Cincuenta fotos | 250 MB | 1 250 s = 20 min 50 s |

Si las cincuenta se cargan de forma ansiosa, compiten entre sí y el tiempo de la foto LCP puede ser todavía peor que el cálculo aislado. Si solo la primera recibe prioridad, el suelo de su transferencia sigue siendo 25 s. La decodificación y el resto de la página se añaden encima.

### Distancia entre extremos

- Recorrer todo el catálogo: 1–2 MB frente a 250 MB; entre 125 y 250 veces menos transferencia.
- Primera rejilla de cuatro fotos: 80–160 KB frente a 20 MB; también entre 125 y 250 veces menos.
- El formato explica una parte. Reducir de 5 MB a una variante de 20–40 KB procede sobre todo de **redimensionar y comprimir para el espacio real**, no de cambiar la extensión.

---

## Qué falta medir antes de decidir

1. Los anchos CSS reales de la rejilla y la ficha en la matriz de viewports.
2. La densidad máxima que se quiere servir; no se debe asumir 3× solo porque el teléfono la anuncie.
3. Un corpus de al menos fotos claras, oscuras, con textura, texto de etiqueta, fondo uniforme y transparencias permitidas.
4. Calidad perceptual aceptable por formato y producto; comparar solo `quality=75` entre códecs no iguala calidad.
5. Tiempo y pico de memoria de cada receta en la máquina mínima local.
6. Matriz mínima de navegadores o analíticas del catálogo para valorar AVIF → JPEG frente a tres formatos.
7. Política formal de derivados canónicos frente a caché regenerable.
8. TTFB y peso del resto de la tienda para convertir la contribución de fotos en tiempo total hasta usable.

## Material de prueba que debe acompañar la decisión

- Lighthouse o WebPageTest con 1,6 Mb/s, 150 ms y CPU ralentizada, repetido varias veces.
- Afirmar en la traza que la candidata LCP no lleva `loading="lazy"`, aparece en el HTML y tiene prioridad alta.
- Contar solicitudes antes de desplazar: no deben aparecer las cincuenta.
- Verificar que el recurso elegido por `currentSrc` corresponde al ancho esperado para slot × DPR.
- Medir CLS con caché fría y comprobar que los cuadrados y 16:9 reservan espacio antes de recibir bytes.
- Vaciar caché de derivados y medir el primer acceso en la máquina local; repetir con varias peticiones concurrentes.
- Replicar un medio y documentar si viajan variantes o se regeneran, incluyendo el fallo parcial y la recuperación.

