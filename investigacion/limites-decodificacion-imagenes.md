# Límite de píxeles y decodificación segura

**Veredicto: el límite de 5 MB debe complementarse antes de generar derivados con cuatro límites independientes: 12 000 px por lado, 50 millones de píxeles, 256 MiB de memoria de píxel estimada y una sola imagen estática; la razón de compresión no debe ser el criterio principal. Ninguna biblioteca elimina la obligación de repetir estas comprobaciones al decodificar.**

Fecha de comprobación: 19 de agosto de 2026.

## El contrato que falta

La propuesta que se sostiene para fotos de producto es:

| Límite | Valor investigado | Qué detiene |
|---|---:|---|
| Anchura | 12 000 px | Dimensiones extremas y errores de `stride` o aritmética aunque el área sea pequeña |
| Altura | 12 000 px | El caso simétrico; por ejemplo, 1 × 100 000 000 |
| Área | 50 000 000 px | El coste real principal de descomprimir una imagen estática |
| Memoria de píxel declarada/estimada | 256 MiB | Fuentes de más de 8 bits, canales adicionales y varias imágenes con igual área |
| Imágenes o fotogramas | 1 | WebP animado, APNG o secuencia AVIF que multiplican el coste |
| Archivo codificado | 5 MB | El límite ya existente; sigue siendo necesario para red, almacenamiento y análisis de cabeceras |

El cálculo debe usar enteros de 64 bits y aritmética comprobada:

```csharp
const int MaxSide = 12_000;
const long MaxPixels = 50_000_000;
const long MaxEstimatedPixelBytes = 256L * 1024 * 1024;
const int MaxFrames = 1;

long pixels = checked((long)width * height);

if (width <= 0 || height <= 0 ||
    width > MaxSide || height > MaxSide ||
    pixels > MaxPixels ||
    (frameCountKnown && frameCount != MaxFrames) ||
    estimatedPixelBytes > MaxEstimatedPixelBytes)
{
    // Rechazar antes de reservar el búfer de píxeles.
}
```

`frameCountKnown == false` no significa «una imagen»: significa que el prefiltro no pudo demostrarlo. En ese caso la decodificación debe verificar que no existe un segundo fotograma antes de aceptar el archivo.

### Por qué 50 millones y no un número menor

El límite deja entrar las capturas de alta resolución que ya producen teléfonos corrientes: Apple documenta fotos de 48 MP en el [iPhone 17](https://www.apple.com/iphone-17/specs/) y Samsung documenta modos de 50 MP y 200 MP, con 12,5 MP como modo predeterminado por agrupación de píxeles, en su [explicación de sensores de alta resolución](https://semiconductor.samsung.com/technologies/image-sensor/ultra-high-resolution/). Un sensor Samsung de 200 MP puede entregar 16 384 × 12 288, según su [ficha técnica](https://semiconductor.samsung.com/image-sensor/mobile-image-sensor/isocell-hp1/).

Así, 50 MP acepta una foto legítima de aproximadamente 8 160 × 6 120, pero no deja que un modo especial de 108 o 200 MP consuma cientos de megabytes para terminar en una tarjeta de catálogo. Los 12 000 px por lado todavía admiten recortes y panoramas razonables para este dominio, pero cierran dimensiones patológicas.

No es un límite gratuito: 50 millones de píxeles RGBA de 8 bits ocupan como mínimo 200 000 000 bytes (190,7 MiB) solo para un búfer. Un decodificador, el reescalado y la conversión de color pueden necesitar más de un búfer. En la instalación local conviene procesar una imagen a la vez o imponer un presupuesto global de memoria; eso es una decisión operativa distinta del límite de aceptación.

### Por qué no limitar la «razón de descompresión» como regla de negocio

`bytes_decodificados / bytes_del_archivo` sirve como telemetría, pero no como filtro primario. Una imagen PNG legítima, grande y casi uniforme puede comprimirse muchísimo; dos fotos con la misma área pueden tener tamaños codificados muy distintos. Con límite de archivo, dimensiones, área, número de fotogramas y memoria estimada, el coste queda acotado sin rechazar una imagen solo por comprimir bien.

## Leer dimensiones sin decodificar todos los píxeles

La premisa «las dimensiones siempre están en las primeras decenas de bytes» solo es cierta de forma simple para PNG. Para JPEG y AVIF es falsa.

| Formato | Dónde están | Qué debe validar el lector |
|---|---|---|
| PNG | `IHDR`, que debe ser el primer bloque tras la firma; anchura y altura son dos enteros de 32 bits | Firma, longitud 13 de `IHDR`, valores no nulos, tipo, CRC y operaciones sin desbordamiento. La [especificación PNG 3](https://www.w3.org/TR/png-3/#11IHDR) define la estructura. |
| JPEG | En un marcador SOF; antes pueden aparecer APPn y comentarios de longitud variable | SOI, longitudes de cada segmento, límites del flujo, todos los SOF admitidos y EOF. No se debe buscar bytes `FF C0` a ciegas. La propia estructura Exif permite APP1 y varios APP2 antes de los datos, según la [especificación CIPA](https://www.cipa.jp/std/documents/e/DC-008-2012_E.pdf). |
| WebP | Contenedor RIFF; las dimensiones cambian de posición entre `VP8 `, `VP8L` y `VP8X` | `RIFF`, tamaño, `WEBP`, longitud y relleno de cada bloque, banderas, dimensiones del lienzo, animación y coherencia entre bloques. La [especificación oficial](https://developers.google.com/speed/webp/docs/riff_container) muestra los tres casos. |
| AVIF | Cajas ISO BMFF; la propiedad `ispe` está anidada y asociada al elemento de imagen | Longitudes y anidamiento de cajas, elemento primario, asociaciones de propiedades, `ispe`, cuadrículas, secuencias y coherencia con el bitstream AV1. La [especificación AVIF 1.2](https://aomedia.org/docs/AV1%20Image%20File%20Format%20%28AVIF%29%20v1.2.0.pdf) advierte incluso que `ispe` y las dimensiones del bitstream pueden no coincidir. |

Esto se puede hacer sin decodificar el plano completo de píxeles, pero no significa «leer 32 bytes y confiar». Hay que usar el analizador del mismo códec que luego decodificará, con un presupuesto de bytes y tiempo.

## Cabeceras mentirosas o malformadas

La identificación es un prefiltro, no una garantía. El flujo seguro tiene dos puertas:

1. Identificar formato, dimensiones, área, memoria estimada y fotogramas sin reservar el plano completo.
2. Decodificar en modo estricto y volver a comprobar formato, dimensiones efectivas y fotogramas antes de guardar cualquier derivado.

Además:

- aplicar el límite de 5 MB al flujo real, no solo a `Content-Length`;
- cancelar por tiempo y por solicitud, y limitar la concurrencia;
- rechazar desbordamientos, longitudes fuera del archivo, CRC inválido donde corresponda, truncamiento y discrepancias entre contenedor y bitstream;
- limitar perfiles de metadatos; un perfil no debe poder consumir memoria sin relación con los píxeles;
- mantener los códecs actualizados: el análisis de archivos no confiables es una superficie de seguridad;
- no convertir un WebP/APNG/AVIF animado en «aceptado» por cargar solo el primer cuadro: primero se comprueba que el archivo completo es estático.

La biblioteca oficial `libavif`, por ejemplo, define límites independientes de área y dimensión y un error específico para discrepancias de `ispe`; se pueden ver en su [cabecera pública](https://github.com/AOMediaCodec/libavif/blob/main/include/avif/avif.h). Eso confirma que ni siquiera el códec confía en un único número.

## Bibliotecas .NET 10

Se auditaron los `.nupkg` oficiales, sin instalarlos, el 19 de agosto de 2026. Los tamaños de publicación son la suma de los archivos de runtime que corresponderían a `net10.0` y al RID indicado, antes de compresión, `single-file` o trimming. No se ejecutó `dotnet publish`: hacerlo habría requerido restaurar dependencias, expresamente fuera de este encargo.

### SixLabors.ImageSharp 4.0.0

```text
QUÉ RESUELVE       Identify sin píxeles, memoria estimada, límite de fotogramas,
                   decodificación estricta, redimensionado, AutoOrient y retirada de metadatos.
QUÉ PESA           1 213 157 B el nupkg; 2 566 656 B la DLL net8/net10 compatible.
QUÉ ARRASTRA       System.IO.Hashing 8.0.0; el nupkg incluye el componente de licencia de build.
BUILD PROPIO       No; es administrada y viene lista para net8.0 o superior.
LICENCIA           Six Labors Split License 1.0. Texto completo presente en la raíz del nupkg.
                   No se copia automáticamente al resultado de dotnet publish.
SIN ELLA           Escribir decodificadores y reescalado seguro no es razonable.
```

Sus [controles de producción](https://sixlabors.com/products/imagesharp/) cubren exactamente el prefiltro: `Image.Identify`, `GetPixelMemorySize`, `MaxFrames`, `TargetSize`, `SkipMetadata` y conversión de perfil. Su [guía de seguridad](https://docs.sixlabors.com/articles/imagesharp/security.html) insiste en que `Identify` no sustituye el manejo de fallos durante la decodificación.

Costes y límites:

- No soporta AVIF en 4.0.0; la [lista oficial de formatos](https://sixlabors.com/products/imagesharp/) incluye JPEG, PNG y WebP, pero no AVIF. Si AVIF es una entrada obligatoria, no es una solución única.
- Desde 4.0 una dependencia directa necesita una clave válida para compilar. En software cerrado con fines de lucro la licencia Apache solo aplica por debajo de USD 1 millón de ingresos brutos anuales; por encima se necesita licencia comercial. Los precios publicados son USD 799/año hasta 10 desarrolladores, USD 1 299/año hasta 20 y USD 4 999/año sin límite, según la [página oficial](https://sixlabors.com/pricing/).
- El texto de licencia está en el paquete fuente, pero no hay regla de MSBuild que lo copie al artefacto de SILLAR. Para cumplir el listón del producto hace falta una comprobación de build que lo incluya; no basta con que exista en la caché NuGet.

### Magick.NET-Q8-x64 14.16.0

```text
QUÉ RESUELVE       JPEG, PNG, WebP y AVIF; ping de cabeceras, orientación, metadatos,
                   reescalado y límites globales de recursos.
QUÉ PESA           nupkg principal 56 018 296 B + Core 2 270 476 B.
                   Payload por RID: ~25,2 MiB Windows x64; ~37,9 MiB Linux x64.
QUÉ ARRASTRA       Magick.NET.Core y un ImageMagick nativo con delegados, entre ellos
                   libheif/aom y muchos códecs que SILLAR no necesita.
BUILD PROPIO       No con el nupkg precompilado; sí si se quisiera reducir sus delegados.
LICENCIA           Magick.NET Apache-2.0; ImageMagick y licencias de terceros.
                   Notice.txt (426 524 B) dentro del nupkg contiene los textos completos.
                   Tampoco se copia automáticamente al resultado de dotnet publish.
SIN ELLA           La misma función exige otra biblioteca de códecs; no unas decenas de líneas.
```

La versión y el paquete están documentados en [NuGet](https://www.nuget.org/packages/Magick.NET-Q8-x64/). `MagickImageInfo` hace `Ping` para obtener información básica. `ResourceLimits.Width`, `Height`, `ListLength`, `Memory`, `Disk`, `Time` y otros existen en la [API](https://github.com/dlemstra/Magick.NET/blob/main/src/Magick.NET/ResourceLimits.cs).

Hay una trampa: `ResourceLimits.Area` y `Memory` no significan «rechazar»; por encima del límite, ImageMagick puede pasar la caché de píxeles a disco. Por eso se necesita igualmente el chequeo explícito de 50 MP. `Disk` sí puede convertir ese derrame en fallo. Los valores predeterminados pueden mirar la memoria del host en vez del límite de un contenedor; el propio mantenedor lo explica en [esta discusión](https://github.com/dlemstra/Magick.NET/discussions/1744).

### NetVips 3.2.0 + libvips 8.18.5

```text
QUÉ RESUELVE       Los cuatro formatos, AVIF incluido, con pipeline perezoso y por franjas;
                   thumbnail, autorotación y retirada de metadatos con bajo uso de memoria.
QUÉ PESA           NetVips.dll 212 992 B. Payload total aproximado por RID:
                   17,9 MiB Windows x64; 17,5 MiB Linux x64.
QUÉ ARRASTRA       libvips nativo y unas dos docenas de bibliotecas de códec, color, texto y XML.
BUILD PROPIO       No usando los paquetes por RID; cada plataforma lleva su binario.
LICENCIA           Binding MIT; binario nativo declarado LGPL-3.0-or-later y terceros.
                   El nupkg nativo solo lleva una tabla con enlaces, no los textos completos.
SIN ELLA           Habría que escoger otra biblioteca; implementar códecs no es viable.
```

NetVips soporta JPEG, PNG, WebP y AVIF con sus binarios publicados y explica el procesamiento por franjas en su [repositorio oficial](https://github.com/kleisauke/net-vips). Los paquetes vigentes son [NetVips 3.2.0](https://www.nuget.org/packages/NetVips) y [NetVips.Native 8.18.5](https://www.nuget.org/packages/NetVips.Native).

El problema para el listón de SILLAR es concreto: `NetVips.Native.win-x64` y `linux-x64` 8.18.5 incluyen `THIRD-PARTY-NOTICES.md`, pero ese archivo enumera licencias y enlaza a repositorios; no contiene sus textos. El paquete administrado tampoco incluye un archivo de licencia, solo la expresión MIT en el `.nuspec`. Tal como se publica, no satisface «el texto viaja dentro del artefacto». Subsanarlo requeriría construir y mantener un inventario de licencias completo, especialmente por LGPL; no es una simple copia de un archivo ya suministrado.

### SkiaSharp y System.Drawing.Common

SkiaSharp 4.151.1 es una alternativa de menor nivel. El paquete administrado comprimido pesa 9,14 MB y arrastra paquetes nativos por plataforma; su API ya enumera AVIF, pero **no se encontró una garantía oficial de que la decodificación y codificación AVIF estén habilitadas en todos los RIDs que SILLAR necesitaría**, ni una API pública equivalente a los presupuestos de memoria anteriores. Requiere más código de orientación, seguridad y metadatos. El nupkg administrado sí contiene el texto MIT, pero no se auditó toda su cadena nativa. No se presenta como respuesta cerrada.

`System.Drawing.Common` no es candidato para ASP.NET Core: Microsoft dice expresamente que GDI+ no está soportado en servicios ASP.NET/ASP.NET Core y que desde .NET 6 el paquete es solo Windows; desde .NET 7 ni siquiera existe el interruptor Unix. Véase la [documentación de Microsoft](https://learn.microsoft.com/en-us/dotnet/api/system.drawing).

## Comparación de coste de ejecución

No se encontró un benchmark publicado que mida el caso exacto —JPEG de producto de 12–50 MP, autoorientar, convertir a sRGB y producir 1200 × 630 en JPEG— en un PC x64 de tienda de unos ocho años con .NET 10. Ese número queda **no encontrado** y es decisivo para elegir generación bajo demanda.

El benchmark reproducible más cercano, pero no transferible sin más, usa un Ryzen 9 7900 y una operación distinta: recorta una imagen grande, la reduce solo al 90 %, enfoca y vuelve a guardar. En JPEG obtuvo 74,47 ms con NetVips, 366,95 ms con ImageSharp y 1 626,85 ms con Magick.NET. Hardware, código y resultados están publicados en [NetVips.Benchmarks](https://github.com/kleisauke/net-vips/tree/master/tests/NetVips.Benchmarks). Sirve para mostrar que la elección cambia el coste por un orden de magnitud; no sirve para prometer una latencia en la tienda.

Antes de decidir «bajo demanda», la prueba mínima debe ejecutarse en el hardware objetivo y publicar:

- corpus de al menos 100 fotos reales: 12 MP, 48/50 MP, orientación 1/6/8, JPEG/PNG/WebP/AVIF;
- salida 1200 × 630 y un tamaño de catálogo, con idéntico filtro y política de calidad;
- arranque frío y caliente, p50/p95, segundos de CPU, máximo de memoria privada y disco temporal;
- concurrencia 1 y 2; la instalación local no debe aceptar un número de trabajos ilimitado;
- entradas malformadas y el límite de 50 MP, para comprobar que se rechazan antes del gran búfer.

Como suelo físico, una foto de 12 MP necesita al menos 45,8 MiB para RGBA8 y una de 50 MP 190,7 MiB; esos sí son números independientes de la biblioteca. El máximo real del proceso no se debe inventar a partir de ellos.

## Mensaje de error

Usar un mensaje que incluya dimensiones, regla y salida:

> No se puede procesar esta foto: mide {ancho} × {alto} px. Se admiten hasta 50 millones de píxeles y 12 000 px por lado. Reduce su resolución o recórtala y vuelve a subirla.

Si el rechazo es por profundidad, fotogramas o memoria estimada, el texto debe cambiar y decirlo; no conviene afirmar «demasiados píxeles» cuando el área sí cumple.

## Datos que faltan antes de aplicar

- No se comprobó qué biblioteca usa hoy SILLAR para validar el tipo real: el encargo prohíbe acceder al producto. El agente de aplicación debe comprobarlo; reutilizarla podría evitar una segunda superficie de códecs.
- No se decidió si AVIF se acepta como archivo de entrada. Esa decisión separa a ImageSharp de las alternativas con códec nativo.
- No se midió el rendimiento en el PC modesto real. El benchmark anterior define cómo obtener el dato sin fingir precisión.
