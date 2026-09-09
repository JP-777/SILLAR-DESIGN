# Handoff completo — SILLAR Diseño

> Respaldo de conocimiento de la conversación, preparado el 29 de agosto de 2026. Este documento distingue explícitamente lo decidido, implementado en material de diseño, propuesto, descartado, pendiente e incierto. No afirma nada sobre el código actual de `C:\SILLAR`, que no se inspeccionó por instrucción expresa.

## Qué es SILLAR-DISENO

`C:\SILLAR-DISENO` es el espacio separado del producto donde se guardan investigación, propuestas visuales, prototipos y código de referencia listo para que otro agente lo aplique. Se sacó deliberadamente del repositorio funcional para impedir que el material de diseño entre por accidente al producto.

SILLAR es una plataforma modular comercial para negocios de retail y servicios en Perú. El frontend funcional usa React, TypeScript y Vite con pnpm. Tiene dos superficies con exigencias distintas:

- panel administrativo y mostrador: herramienta de trabajo usada hasta ocho horas diarias, en ocasiones en un equipo modesto;
- tienda pública: catálogo/escaparate consumido a menudo desde móviles y datos.

La misión de esta conversación fue investigar antes de adoptar, diseñar la propuesta del catálogo M01 y, en encargos concretos, entregar implementaciones de referencia sin tocar el producto. Consistencia, velocidad, claridad y mantenimiento pesan más que el espectáculo.

## Regla de separación

**DECIDIDO:** ningún agente de investigación/diseño escribe dentro de `C:\SILLAR`, ni siquiera temporales. Todo material original de esta línea vive en `C:\SILLAR-DISENO\investigacion` o `C:\SILLAR-DISENO\propuestas`. Este respaldo tampoco modifica ese árbol: se creó aparte.

## Estado global

### Terminado como investigación o propuesta autocontenida

- Investigación presente sobre Morphicons, Sileo y Auragradients.
- Investigación del peso de fotografías del catálogo, formatos, tamaños responsivos, carga diferida, CLS y estrategias de derivados.
- Investigación de límites seguros al decodificar imágenes, orientación/privacidad de metadatos y derivado social por debajo de 600 KB.
- Investigación de previsualizaciones de enlaces, soluciones de render público, descubrimiento/SEO mínimo y escenarios de soporte de navegadores en Perú.
- Pared de sillares: informe, componente React/TypeScript, CSS, integración ilustrativa, pruebas Playwright y benchmark. No aplicada al producto.
- Puerta de animaciones ocasionales: informe, provider/hook, CSS, prueba de precedencia, ejemplos y benchmark. No aplicada al producto.
- Propuesta M01 del catálogo: listado y detalle de producto, estados vacío/datos/cargando/conflicto, temas claro/oscuro, vista compacta, banco interactivo y tablero de revisión.
- Sistema visual de propuesta con tokens de color, espaciado, radios, tipografía, foco y componentes de revisión.

### Parcial o no verificable

- En la conversación se trabajaron el indicador de espera accesible, la escala de movimiento y el token de velo. Sus artefactos no están hoy en `C:\SILLAR-DISENO`; la conversación confirma el problema y los requisitos, pero no permite reconstruir con certeza todo el código final.
- Se encargaron informes sobre Three.js, GSAP y Liquid Gooey; el historial posterior afirma que nueve candidatas fueron descartadas, pero esos tres informes no están presentes. No deben recrearse de memoria.
- React-loading-skeleton, Motion y AutoAnimate aparecen como descartadas en el historial, pero sus informes tampoco están disponibles.
- Se habló de diez evaluaciones descartadas en el encargo de la puerta. La décima candidata no se identifica inequívocamente en el contexto conservado: **INCIERTO / REQUIERE CONFIRMACIÓN**.
- Las pruebas de la pared y de la puerta están escritas, pero no se ejecutaron contra SILLAR: faltaba conectar el harness y estaba prohibido tocar el producto.
- No se obtuvo una medición fiable del coste en el ordenador objetivo de tienda de ocho años. Se entregaron protocolos y benchmarks reproducibles.

## Decisiones firmes que gobiernan la continuación

### Producto y proceso

- **DECIDIDO:** se investiga y se entrega material para decidir; una investigación no equivale a adopción.
- **DECIDIDO:** no instalar dependencias sin preguntar.
- **DECIDIDO:** una dependencia comercial debe llevar el texto de su licencia dentro del artefacto publicado, no solo en el repositorio o en un enlace.
- **DECIDIDO:** no crear abstracciones por si acaso; solo extraer lo común al existir un segundo caso real.
- **DECIDIDO:** contenido de interfaz en español y mensajes de progreso veraces.

### Sistema visual y accesibilidad

- **DECIDIDO:** todo color de interfaz sale de variables CSS validadas para contraste y daltonismo; nada de colores escritos dentro de componentes.
- **DECIDIDO:** toda animación respeta `prefers-reduced-motion`, incluso cuando cambia en caliente.
- **DECIDIDO:** una animación nunca retrasa una acción. El estado funcional cambia primero; la salida visual acompaña.
- **DECIDIDO:** lo que comunica debe sobrevivir sin movimiento; el movimiento solo refuerza.
- **DECIDIDO:** el movimiento cotidiano usa una escala corta de 120/180/240 ms; el ocasional y expresivo es una categoría distinta que puede desactivarse por instalación.
- **DECIDIDO:** la preferencia del sistema gana sobre el ajuste de la instalación.
- **DECIDIDO:** por debajo de un segundo no se muestra un indicador de espera.
- **DECIDIDO:** el panel prioriza consistencia y baja fatiga; iconos o fondos que se mueven solos durante ocho horas son impropios.

## Dirección visual recuperada

La identidad propuesta une el nombre SILLAR con la piedra labrada de Arequipa. La paleta de trabajo usa tonos piedra y un azul de acento descrito como cielo de Arequipa. La geometría es de “bloque tallado”: radios pequeños de 3, 5 y 8 px. La tipografía es de sistema, sobria, y la jerarquía evita tamaños de campaña. Esta dirección existe en los tokens M01, pero debe tratarse como **PROPUESTA** hasta que JP/equipo confirme su adopción en el producto.

Los colores exactos y roles se documentan en `01_DECISIONES_DISENO.md` y permanecen en `propuestas\M01\_ds\...\tokens\tokens.css`. Hay temas claro y oscuro. El panel conserva la identidad SILLAR; la tienda pública puede usar el tema de cada cliente.

## M01 — catálogo

### Listado de productos

**IMPLEMENTADO EN PROTOTIPO, NO EN PRODUCTO:** cabecera “Catálogo / Productos”, resumen, búsqueda por nombre o código, control para mostrar dados de baja, acciones Categorías y Nuevo producto, y tabla.

Los cuatro estados diseñados son:

- vacío: explica qué es un producto con un ejemplo concreto; solo ofrece “Crear el primer producto”; no enseña filtros ni acciones inútiles;
- con datos: hace visibles los casos incómodos (sin código de barras, precio a consultar, múltiples variantes, dado de baja);
- cargando: conserva la posición de cabecera y tabla, no inventa un conteo y deja inertes los filtros;
- conflicto: desactivar una categoría advierte que 23 productos perderán categoría pero seguirán activos, con posibilidad de deshacer.

En vista compacta la fila se apila como nombre, código, precio y estado; se conserva únicamente la acción Editar. Los productos inactivos se atenúan, pero no desaparecen y deben seguir siendo legibles, también en oscuro.

### Detalle de producto

**IMPLEMENTADO EN PROTOTIPO, NO EN PRODUCTO:** regreso a Productos, nombre/estado/código interno, acciones Descartar/Guardar, datos básicos, variantes, fotos y estado.

Casos importantes:

- producto nuevo: no enseña fotos, estado ni variantes inexistentes;
- carga: título genérico “Producto”, un solo indicador y ningún nombre/estado inventado;
- código de barras duplicado: el error nombra el código y el producto con el que choca;
- última variante activa: no permite dejar activo un producto sin nada vendible y propone desactivar el producto;
- borrar foto: usa diálogo de confirmación real con foco visible en el banco interactivo;
- variantes: comparten nombre, foto y precio; la tabla muestra solo lo que las distingue, principalmente código y estado.

### Componentes disponibles en el bundle de revisión

Alert, Badge, Button, Card, ConfirmDialog, Drawer, EmptyState, FailureAlert, Field, Gallery, Input, Pagination, Spinner, Switch, Table y Toasts. Son un bundle generado por la herramienta de diseño, no prueba de que sean componentes implementados o idénticos en SILLAR.

## Investigación de movimiento

### Pared de sillares

**PROPUESTO Y CODIFICADO COMO REFERENCIA:** encaja mejor durante la activación de un módulo, cuando el sistema se reinicia realmente. Para el inicio de sesión solo puede aparecer si la espera real supera un segundo y se mide; jamás se fuerza una duración mínima.

La implementación tiene 23 bloques, cinco filas y máximo cinco caídas simultáneas. Forma la pared en unos 1.5 s con `transform` y `opacity`, sin bucle JS. La carga controla la salida: el panel se monta/habilita en el mismo cambio en que la superposición deja de capturar eventos; la salida visual dura 160 ms y no se espera `animationend`. Si termina a media altura, se congela la posición calculada y sale el conjunto sin corte abrupto. En esperas largas hay movimiento ambiental muy leve y un control explícito para detenerlo.

Con movimiento reducido no cae nada: queda una pared estática y el texto verdadero. La región `role="status"` es `polite` y `atomic`; al terminar anuncia “Sistema disponible”. Las fases de reinicio deben venir del estado real, no de temporizadores decorativos.

### Puerta de animaciones ocasionales

**PROPUESTO Y CODIFICADO COMO REFERENCIA:** el segundo caso real justificó compartir únicamente la pregunta “¿está permitido el movimiento ocasional?”, no la maquinaria de cada efecto.

La autorización es: ajuste de instalación explícitamente `true` **y** sistema sin reducción. Un valor de configuración pendiente (`null`) falla cerrado. Si el permiso cambia durante un efecto, se corta inmediatamente y se aplica el estado visual final. La barrera existe en React para JS y en CSS como defensa adicional.

**PROPUESTO, NO DECIDIDO:** valor de instalación predeterminado `false` hasta que el benchmark pase en el equipo objetivo antiguo. No existe una señal web fiable para predecir “máquina lenta”; `hardwareConcurrency`, `deviceMemory`, WebGL/WebGPU, batería o red no equivalen a rendimiento de animación.

## Investigación del catálogo público

### Fotos y bytes

La principal ganancia proviene de servir el tamaño correcto y cargar diferido solo lo que está debajo del primer viewport. En el escenario investigado, recorrer 50 productos optimizados suma aproximadamente 1–2 MB y las primeras cuatro fotos 80–160 KB. El peor caso permitido (50 originales de 5 MB) suma 250 MB; a 1.6 Mbps, una foto de 5 MB tarda unos 25 s y cuatro unos 100 s.

No se eligió arquitectura de derivados. Permanecen tres opciones: generar al subir (CPU una vez, disco y réplica multiplicados), generar bajo demanda con caché (primera petición y CPU local), o no generar (simplicidad, bytes altos al cliente). Antes de medir el PC local hay que decidir si la instalación ERP monta las rutas públicas; si no las monta, ese equipo nunca decodifica derivados.

AVIF obtuvo solo 1.7–15 % de ahorro en la pequeña muestra; WebP llegó a pesar más que JPEG en algunas fotos. La selección debe basarse en un corpus real, no en fama de formato. `srcset` se deriva del ancho real de la ranura por DPR y se deduplica; probablemente basten 2–3 anchos, pero no hay valores cerrados. Las imágenes del primer viewport son eager; la candidata LCP recibe prioridad alta; `lazy` va debajo. Se reserva espacio con contenedor de proporción conocida y también `width`/`height` en el recurso.

### Seguridad al procesar imágenes

**PROPUESTO, NO ADOPTADO:** 12 000 px por lado, 50 MP, 256 MiB de memoria de píxeles estimada y una sola imagen estática, además de los 5 MB codificados ya existentes. Esto protege de dimensiones hostiles y animaciones multiframe. La identificación por cabecera debe ser acotada y la decodificación estricta debe volver a comprobar dimensiones.

Bibliotecas evaluadas: ImageSharp (compacta/administrada, sin AVIF, licencia comercial posible a partir del umbral de ingresos), Magick.NET (todos los formatos, 25–38 MiB por plataforma, avisos completos disponibles en paquete pero deben copiarse al publish), NetVips (técnicamente eficiente, pero artefactos sin textos completos de licencias: descartada por criterio). No se eligió entre ImageSharp y Magick.NET.

Orientación: identificar/limitar, decodificar, autoorientar/reflejar, convertir perfil válido a sRGB, recortar/redimensionar y codificar sin metadatos de origen. Se deben retirar GPS, Exif, XMP, IPTC, comentarios, miniaturas y MakerNotes del derivado.

### Previsualización social y render público

Una calidad JPEG fija no garantiza 600 KB. Contrato propuesto: 1200×630, JPEG baseline, sRGB, sin metadatos, calidad inicial 82, objetivo operativo <=550 000 bytes y límite estricto <600 000; medir y bajar calidad/dimensiones si hace falta. El cuadrado se recorta de forma agresiva en 1.91:1, por lo que puede hacer falta una composición diseñada.

No se pudo confirmar el estado de producción porque no se inspeccionó una URL. **CONDICIONAL:** si dos rutas de producto entregan el mismo HTML inicial y React cambia el `<head>` después, WhatsApp mostrará tarjetas genéricas o iguales, pues sus rastreadores no ejecutan la aplicación como un navegador. Debe comprobarse con dos slugs reales y user-agent del bot.

Rutas públicas conocidas: `/catalogo`, `/catalogo/:categoria`, `/producto/:slug`. La URL de producto única ya evita duplicación por aparecer en varias categorías; aun así se recomienda canonical propio y auditar parámetros, mayúsculas, barras, dominios y slugs viejos.

No se eligió salida de render: shell SPA, inyección de head por servidor, prerender al mutar, SSR/hidratación, estático o servicio externo. Antes de cualquier técnica, la instalación local necesita un origen HTTPS público alcanzable por el bot; de lo contrario ninguna etiqueta ayuda.

## Bibliotecas y técnicas descartadas

**DESCARTADAS expresamente en el historial:** Morphicons, Sileo, Auragradients, react-loading-skeleton, Motion, AutoAnimate, GSAP, Liquid Gooey y Three.js. Los informes conservados permiten explicar con precisión las tres primeras. Para las otras seis solo deben reutilizarse afirmaciones verificables en los documentos existentes o repetir investigación desde fuentes primarias.

De Sileo sí se rescataron ideas sin dependencia: actualizar el mismo aviso durante una promesa, deduplicar por clave semántica y contar repeticiones, y pausar la caducidad por puntero y foco conservando el tiempo restante. No se rescataron morfología viscosa, arrastre, seis posiciones ni acciones ocultas.

## Pendientes que controlan el siguiente paso

1. Confirmar con JP qué partes de M01 son decisiones adoptadas y cuáles siguen como propuesta.
2. Determinar si el ERP local sirve el escaparate público y si dispone de origen HTTPS accesible.
3. Probar el HTML inicial de dos productos reales y sus imágenes sociales.
4. Elegir, a nivel de arquitectura, estrategia de render público y estrategia de derivados; la investigación no las decidió.
5. Elegir biblioteca de procesamiento de imágenes y política de publicación de licencias; NetVips queda fuera bajo el criterio actual.
6. Ejecutar los benchmarks de pared/puerta en el equipo modesto objetivo y fijar presupuesto a partir de datos.
7. Recuperar o rehacer, sin asumir resultados, los artefactos faltantes de indicador accesible, escala de movimiento y velo.
8. Ejecutar las pruebas entregadas cuando exista un harness integrado, preservando las afirmaciones: el panel no espera a la animación, el mensaje sobrevive sin movimiento y la preferencia del sistema siempre gana.
9. Seleccionar los suelos de navegador por separado para panel y tienda pública, usando analítica propia cuando exista.

## Cómo continuar exactamente

1. Leer primero este documento, `01_DECISIONES_DISENO.md`, `02_ESTADO_ACTUAL.md`, `06_REGLAS_Y_CONVENCIONES.md` y `12_DATOS_NO_RECUPERABLES.md`.
2. Verificar en modo lectura el contenido y hashes de `C:\SILLAR-DISENO`; no asumir que esta copia refleja cambios posteriores.
3. No abrir el trabajo escribiendo en `C:\SILLAR`. Si se pide integración, señalar que otro agente debe aplicarla o pedir una corrección explícita de autoridad.
4. Separar en toda respuesta panel frente a tienda pública y nube frente a instalación local.
5. Para cualquier dependencia, medir bundle real, dependencias, licencia y presencia de texto en publish, reduced motion por defecto y coste de hacerlo a mano.
6. Para M01, revisar los prototipos y el tablero antes de cambiar tokens o componentes; las pantallas expresan casos límite deliberados.
7. No convertir propuestas numéricas (límites, calidad, valor predeterminado, navegadores) en decisiones sin confirmación.

## Alcance y cautelas

- `C:\SILLAR-DISENO` no contiene `.git`; no hay historial local recuperable.
- Los archivos `.dc.html` y `_ds_bundle.*` son material generado/de revisión. No son por sí solos especificación de producción.
- Los informes incluyen fuentes web que eran actuales al escribirse; soporte, licencias y cuotas de navegador son datos temporales y deben revalidarse al adoptar.
- La ausencia de un informe no significa que el tema no se discutió. Consultar `12_DATOS_NO_RECUPERABLES.md`.
