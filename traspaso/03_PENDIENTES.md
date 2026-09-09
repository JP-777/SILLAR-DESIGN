# Pendientes conocidos

> No se añaden ideas nuevas: todos los puntos proceden de encargos, informes o huecos explícitos del historial.

## CRÍTICOS

### Confirmar alcance público de la instalación local

- **Qué:** decidir si el ERP instalado en la máquina del negocio monta `/catalogo`, `/catalogo/:categoria` y `/producto/:slug`, y si tiene un origen HTTPS público alcanzable.
- **Por qué:** determina si esa máquina procesa derivados y si los bots de mensajería/buscadores pueden entrar. Puede borrar o crear todo el coste de imagen local.
- **Conocimiento a respetar:** mismo código en nube/local; no asumir CDN; un bot externo no llega a `localhost`.
- **Dependencias:** arquitectura/despliegue.
- **Archivos:** `fotos-catalogo-publico.md`, `previsualizacion-enlaces-mensajeria.md`, `salidas-renderizado-publico.md`, `limites-decodificacion-imagenes.md`.
- **Terminado cuando:** existe una decisión escrita por modalidad y se conocen origen público, terminación TLS y responsabilidad de servir medios.

### Verificar tarjetas reales de producto

- **Qué:** solicitar dos slugs publicados distintos con user-agent de WhatsApp y comparar HTML inicial, status y OG; descargar la imagen sin sesión.
- **Por qué:** no se confirmó si hoy todos los productos comparten el mismo head SPA.
- **Conocimiento:** los bots no esperan a React; una sospecha condicional no es diagnóstico.
- **Dependencias:** entorno accesible y URLs reales.
- **Archivos:** `previsualizacion-enlaces-mensajeria.md`.
- **Terminado cuando:** dos productos muestran metadatos distintos en el primer HTML, inexistente devuelve 404/410 y la imagen absoluta cumple acceso/peso/tipo.

### Elegir y documentar arquitectura de derivados

- **Qué:** seleccionar generación al subir, bajo demanda con caché o ninguna, pudiendo separar derivado social de catálogo.
- **Por qué:** afecta CPU, disco, primer acceso y bytes replicados.
- **Conocimiento:** cuatro tamaños almacenados implican cuatro archivos replicados salvo política explícita de regeneración; social usa un bucle de codificación más caro.
- **Dependencias:** decisión anterior sobre ERP local, réplica e invalidación.
- **Archivos:** `fotos-catalogo-publico.md`, `previsualizacion-mensajeria-600kb.md`.
- **Terminado cuando:** están definidos qué se guarda, qué se replica, qué se regenera, cómo se invalida y qué pasa ante fallo.

### Elegir procesador de imágenes y cumplimiento de licencia

- **Qué:** decidir entre las opciones aún viables y configurar publicación de textos de licencia.
- **Por qué:** decodificar/redimensionar justifica dependencia; NetVips quedó fuera por artefacto, ImageSharp puede implicar pago y Magick.NET pesa más.
- **Conocimiento:** no basta la licencia en NuGet; debe señalarse en el publish comercial.
- **Dependencias:** formatos y arquitectura de derivados.
- **Archivos:** `limites-decodificacion-imagenes.md`.
- **Terminado cuando:** se ha revalidado licencia actual, medido artefacto publicado, incluido texto/avisos y probado el pipeline con corpus adversario.

### Reparar y probar el indicador de espera con movimiento reducido

- **Qué:** recuperar o reconstruir CSS/marcado/prueba del Spinner accesible.
- **Por qué:** un anillo congelado parece sistema colgado y el lector de pantalla no conoce el estado.
- **Conocimiento:** comunicar espera es objetivo; girar no. Evitar anuncios repetidos.
- **Dependencias:** componentes reales y hoja base, que otro agente integra.
- **Archivos:** artefacto ausente; referencia parcial en `_ds_bundle.js` y `base.css`.
- **Terminado cuando:** Playwright emula reducción y afirma mediante nombre/rol o texto anunciado que la espera persiste; visualmente no queda un spinner ambiguo.

## IMPORTANTES

### Confirmar adopción de la propuesta visual M01

- **Qué:** revisar con JP paleta, tipografía, radios, espaciado, layouts y estados.
- **Por qué:** están implementados en prototipo, no marcados como adoptados.
- **Archivos:** todo `propuestas\M01`.
- **Terminado cuando:** cada bloque figura como aprobado, ajustado o rechazado sin ambigüedad.

### Completar tokens de movimiento y velo

- **Qué:** incorporar, en material de diseño primero, tokens por rol de la escala decidida y recuperar la solución del velo por tema.
- **Por qué:** la pared consume fallbacks y el único velo conocido tenía `rgba(26,23,19,.45)` a mano.
- **Conocimiento:** reduced motion por defecto; color solo desde tokens; no inventar valores del velo perdido.
- **Dependencias:** validación de contraste/temas.
- **Terminado cuando:** tokens existen en ambos temas, ejemplos no escriben tiempos/colores sueltos y pruebas cubren reducción.

### Medir inicio y reinicio reales

- **Qué:** instrumentar login, capacidades y montaje de rutas, además de activación/reconexión de módulo, separando frío/caliente y nube/local.
- **Por qué:** la pared solo acompaña una espera real >1 s.
- **Conocimiento:** medir p50/p75/p95; cero mínimo visual.
- **Archivos:** protocolo en `pared-de-sillares.md`.
- **Terminado cuando:** hay series reproducibles por entorno y una regla de aparición derivada de los datos.

### Ejecutar benchmarks en hardware objetivo

- **Qué:** correr pared y catálogo de concurrencia en el PC de tienda de referencia, no solo en máquina de desarrollo.
- **Por qué:** no existe cifra universal de elementos; el intento del entorno anterior falló con GPU Chromium.
- **Archivos:** ambos `benchmark-*.html` y ejecutores CDP.
- **Terminado cuando:** se guardan frame time, frames largos, paint/layout y condiciones exactas del equipo/navegador.

### Elegir salida de render público

- **Qué:** comparar en el contexto real inyección de head, prerender, SSR/hidratación o alternativa elegida.
- **Por qué:** tarjetas y SEO dependen del HTML inicial; migrar tarde puede ser costoso.
- **Conocimiento:** head por producto resuelve tarjetas/metadatos, no body/status/sitemap por sí solo.
- **Archivos:** `salidas-renderizado-publico.md`, `descubrimiento-minimo-catalogo.md`.
- **Terminado cuando:** contrato de URL, status, head, cuerpo, caché e invalidación está escrito.

### Elegir suelos de navegador separados

- **Qué:** elegir escenario para panel y público y fijarlo en build/tests/documentación.
- **Por qué:** hoy decisiones de AVIF, View Transitions y selectores ocurren implícitamente.
- **Conocimiento:** cuota Perú no basta para conocer versiones; usar analítica propia cuando exista.
- **Archivos:** `soporte-navegadores-peru.md`.
- **Terminado cuando:** matrices de soporte, mejora progresiva y fallback esencial están explícitos.

## MEJORAS

### Aplicar las tres ideas útiles de Sileo, solo si aparece el problema

- **Qué:** upsert de toast durante una promesa; deduplicación por clave con contador; pausa por puntero/foco conservando tiempo.
- **Por qué:** mejoran comprensión sin traer paquete.
- **Conocimiento:** no generalizar hasta tener el segundo caso; no ocultar acciones ni arrastrar gestos.
- **Archivo:** final de `sileo.md`.
- **Terminado cuando:** existe un caso real y pruebas de temporización/teclado/lector de pantalla.

### Validar M01 con teclado y lector de pantalla

- **Qué:** recorrer banco interactivo, diálogo, switch, tabla y errores.
- **Por qué:** el bundle modela ARIA, pero no se verificó en producto real.
- **Archivos:** `propuestas\M01`.
- **Terminado cuando:** foco, orden, nombres, errores y restauración pasan revisión manual y automatizada razonable.

### Seleccionar corpus de fotografías real

- **Qué:** medir JPEG/WebP/AVIF sobre fotos verdaderas de clientes y ranuras/DPR reales.
- **Por qué:** la muestra pequeña mostró WebP peor y AVIF con ahorro modesto.
- **Archivos:** `fotos-catalogo-publico.md`.
- **Terminado cuando:** se publican distribución de peso/calidad/tiempo y se ajustan formatos/ancho a evidencia.

## OPCIONALES

### Reconsiderar transición semántica de iconos

- Solo si aparece un estado real repetido que se beneficie de 2–3 morfologías. Empezar con SVG/CSS manual; no reabrir Morphicons por decoración.

### Usar fondo/gradiente en superficie pública o instalación

- Solo con variables validadas y preferentemente horneado si no reacciona. Nunca trasladarlo al panel por inercia.

### Añadir carácter a otros momentos ocasionales

- La puerta ya permite apagarlos, pero diseño de momentos/sensaciones no fue parte de la investigación. Cada nueva animación conserva estado final estático y no inventa espera.

## BLOQUEADOS POR DECISIÓN

- Medición de derivados en PC local: bloqueada por decidir si el ERP local sirve catálogo.
- Dimensiones definitivas de `srcset`: bloqueadas por layout final, DPR objetivo y analítica.
- Formato definitivo: bloqueado por corpus real, soporte elegido y procesador.
- Método de generar social: bloqueado por arquitectura, aunque el informe señala que al subir evita pagar el bucle en primera visita.
- Default definitivo de animaciones ocasionales: bloqueado por benchmark del equipo antiguo.
- Uso de pared en login: bloqueado por medición real >1 s.
- SSR/head/prerender: bloqueado por alcance público, infraestructura y SEO esperado.
- Merchant listing vs Product snippet: bloqueado por saber si existe compra directa visible.
- Política de slugs viejos/redirecciones: no especificada.
