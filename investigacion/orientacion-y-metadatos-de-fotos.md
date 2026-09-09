# Orientación y metadatos de fotografías

**Veredicto: la orientación debe materializarse en los píxeles antes de recortar o quitar metadatos; después se convierte el color a sRGB y se omiten EXIF, XMP, IPTC, GPS y miniaturas. El ahorro de bytes no tiene un porcentaje universal y debe medirse en el corpus real; la razón principal para retirar esos datos es privacidad y coherencia.**

Fecha de comprobación: 19 de agosto de 2026.

## Orden correcto del pipeline

1. Detectar el formato real e identificar dimensiones, fotogramas y coste estimado.
2. Decodificar con límites y tratamiento estricto de errores.
3. Interpretar la orientación y reflejo de la fuente; transformar físicamente los píxeles.
4. Convertir desde el perfil de color válido de origen a sRGB.
5. Recortar y redimensionar usando ya las dimensiones visuales correctas.
6. Codificar el derivado sin metadatos de origen; incluir solo los datos que el contrato de salida requiera.

Si se borra EXIF antes de `AutoOrient`, desaparece la instrucción que decía cómo poner derecha la foto. Si se recorta antes, anchura y altura pueden estar intercambiadas y el encuadre se hace sobre el eje equivocado.

ImageSharp documenta explícitamente «`AutoOrient()` antes de quitar EXIF» en su [guía de retirada de metadatos](https://docs.sixlabors.com/articles/imagesharp/stripmetadata.html). libvips puede aplicar la orientación durante la carga JPEG mediante `autorotate`, según su [API oficial](https://www.libvips.org/API/current/ctor.Image.jpegload.html).

## En qué formatos aparece la orientación

| Formato | Mecanismo que puede aparecer | Implicación |
|---|---|---|
| JPEG | Etiqueta Orientation dentro de Exif/APP1 | Es el caso habitual de fotos de teléfono. Debe hornearse antes de quitar APP1. |
| PNG | Perfil Exif en el bloque `eXIf` | PNG 3 admite Exif y advierte que sus punteros pueden ser inválidos; véase la [especificación](https://www.w3.org/TR/png-3/#11eXIf). No se puede asumir que «PNG ya viene derecho». |
| WebP | Bloque `EXIF` dentro del RIFF | La [especificación WebP](https://developers.google.com/speed/webp/docs/riff_container) permite Exif; un decodificador que lo ignore puede perder orientación. |
| AVIF | Propiedades de transformación `irot`/`imir`; también puede llevar Exif | La transformación pertenece al contenedor. `libavif` expone ambas y también intenta interpretar orientación Exif; véase su [API pública](https://github.com/AOMediaCodec/libavif/blob/main/include/avif/avif.h). |

La cobertura exacta depende de la biblioteca. «Tiene un método AutoOrient» no demuestra que cubra AVIF: ImageSharp no decodifica AVIF; Magick.NET y libvips sí dependen de sus delegados nativos. Esto debe probarse con ocho orientaciones Exif y combinaciones `irot`/`imir`, no solo con una foto girada 90°.

## Qué datos conviene retirar

Una foto puede llevar:

- latitud, longitud, altitud, hora GPS y dirección de la cámara;
- fecha, hora y zona de la captura;
- marca, modelo y número de serie de cámara o lente;
- nombre de propietaria, autora o editora;
- identificador único de imagen, comentarios, historial y software usado;
- palabras clave, descripciones y derechos en IPTC/XMP;
- una miniatura JPEG incrustada;
- perfiles ICC o datos CICP de color;
- información específica del fabricante.

La CIPA enumera ubicación, fecha, nombre de cámara, lente, software, propietaria, fotógrafa y números de serie dentro de Exif; su [resumen de Exif 3.0](https://cipa.jp/std/documents/e/Exif3.0-Overview_E.pdf) muestra por qué una foto pública puede revelar más que sus píxeles. La [norma Exif](https://www.cipa.jp/std/documents/e/DC-008-2012_E.pdf) también contempla una miniatura comprimida.

Política técnicamente coherente para derivados públicos:

- retirar EXIF completo después de orientar;
- retirar GPS, XMP, IPTC, comentarios, miniaturas y MakerNotes;
- no copiar nombre original ni identificadores del dispositivo;
- tratar ICC/CICP de forma distinta: primero convertir los píxeles al espacio de salida sRGB y solo después omitir el perfil de origen. Borrar el perfil antes de convertir puede cambiar el color del producto;
- codificar con `SkipMetadata` o `strip`, no copiar perfiles selectivamente por accidente.

No se modifica aquí la política del original guardado. Este informe se refiere a los derivados públicos; conservar o retirar metadatos del archivo maestro es otra decisión de datos y privacidad.

## Cuánto se ahorra

**No se encontró un porcentaje serio y generalizable para «foto de producto tomada con teléfono».** Los metadatos son segmentos separados cuyo tamaño depende del dispositivo y del software. Un EXIF JPEG individual cabe en un APP1 de hasta 65 533 bytes, pero puede haber APP2 para ICC, XMP extendido y miniaturas; PNG permite un `eXIf` mucho mayor y el límite total de subida sigue siendo 5 MB.

Por eso el ahorro correcto es un dato de corpus:

```text
ahorro_metadatos = bytes_codificados_con_mismos_píxeles_y_ajustes
                 - bytes_codificados_sin_metadatos
```

La comparación debe mantener exactamente los mismos píxeles, formato, calidad, submuestreo y modo progresivo. Re-guardar el original con otra calidad y atribuir toda la diferencia a EXIF daría un número falso.

Lo que sí puede afirmarse:

- en un original cercano a 5 MB, decenas de kilobytes suelen ser un porcentaje pequeño;
- en una previsualización de 100–500 KB, la misma miniatura o perfil puede ser una fracción material;
- el ahorro puede ser casi cero o cientos de kilobytes; no hay un valor fijo fiable;
- aunque el ahorro sea cero, quitar GPS, serie y nombres sigue estando justificado por privacidad.

La prueba a guardar junto al pipeline debería publicar para el corpus: bytes EXIF, ICC, XMP/IPTC, miniatura, total antes/después, p50/p95/máximo y número de fotos con GPS.

## Tratamiento por biblioteca

| Biblioteca | Orientación | Metadatos de salida | Coste o hueco |
|---|---|---|---|
| ImageSharp 4.0 | `AutoOrient()` para Exif | `SkipMetadata`, acceso a EXIF/ICC/IPTC/XMP/CICP | Flujo claro y administrado; no cubre entrada AVIF. |
| Magick.NET 14.16 | `AutoOrient()` y orientación expuesta por `MagickImageInfo` | `Strip()`/eliminación de perfiles | Cubre AVIF con delegados; binario y superficie de códecs grandes. |
| NetVips/libvips | `autorot` o `autorotate` durante carga/operación | opciones `strip` y retirada de campos | Bajo uso de memoria; su artefacto nativo no trae los textos completos de licencias. |
| SkiaSharp 4.151 | `SKCodec.EncodedOrigin`, transformación manual | la recodificación suele omitir metadatos, pero el contrato es de menor nivel | Más código propio y cobertura AVIF por RID no verificada. |

## Pruebas que evitan el fallo «solo aparece con fotos reales»

- fixtures JPEG con orientaciones Exif 1 a 8 y un objeto asimétrico con texto legible;
- WebP y PNG con Exif Orientation;
- AVIF con `irot`, `imir` y ambos; si también lleva Exif, definir y probar la precedencia del decodificador elegido;
- afirmar anchura/altura finales, posición de cuatro marcadores de esquina y ausencia de GPS/serial/XMP en el archivo de salida;
- una foto Display P3 conocida: comparar el color tras convertir a sRGB, no después de borrar ICC sin conversión;
- un archivo con metadatos corruptos: debe fallar o ignorar solo lo permitido por una política explícita, nunca colgarse.

## Datos no encontrados

- No se encontró una distribución de tamaños de metadatos representativa de comercios peruanos; hay que medirla con fotos reales del producto.
- No se verificó la biblioteca que SILLAR ya usa para detectar tipos, porque el producto está fuera del alcance del agente.
- No se encontró una promesa única y transversal de que cada biblioteca aplique correctamente toda combinación de orientación AVIF; se requiere la matriz de fixtures anterior.
