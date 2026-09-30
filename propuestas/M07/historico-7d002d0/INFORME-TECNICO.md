# Informe técnico de diseño — M07 Solicitudes B2B y Especiales

**Estado:** PROPUESTA  
**Creación:** 30/09/2026 · America/Lima  
**Última modificación:** 30/09/2026 · America/Lima  
**Última verificación:** 30/09/2026 · America/Lima  
**Producto main:** `e839989432283c755edf7d4ae47b2c37697215ec`  
**M07:** `m07-b2b-sobre-main` @ `7d002d040e844e4751a3b845d13982116523b0d9`

## 1. Verificación de base

Se verificaron directamente:

- `docs/modules/b2b/SPEC.md`, blob `d7c2c49bf4981b96ab538b9014e6eb88493a66fc`.
- `backend/Sillar.Modules.B2B/Endpoints/BandejaAdminEndpoints.cs`,
  blob `2ba674c3651df9f2b876997542926b6d059f93c2`.
- `backend/Sillar.Modules.B2B/Bandeja/BandejaDtos.cs`,
  blob `8517e10981ce3bcbb69c8b7bab2b2ac67340ebaa`.
- `backend/Sillar.Modules.B2B/Bandeja/BandejaService.cs`,
  blob `7bcbeb8e74b745b23ab6d637bbd568fc42774800`.
- `backend/Sillar.Modules.B2B/Bandeja/TransicionesDeSolicitud.cs`.
- `backend/Sillar.Modules.B2B/Catalogo/ReaccionAlCatalogo.cs`.
- `backend/Sillar.Modules.B2B/Domain/Entidades.cs`.
- `frontend/src/shared/styles/tokens.css`.
- `frontend/src/shared/ui/index.tsx`.
- `frontend/src/shared/ui/patterns.tsx`.
- `frontend/src/layout/AdminShell.tsx`.
- `frontend/src/layout/navigation.ts`.

### Hecho importante del commit actual

Las rutas administrativas de solicitudes ya permiten lectura y escrituras ordinarias, notas,
reenlace, cambios de estado y bajas lógicas. Las rutas de cotizaciones son hoy **solo lectura**:
`GET /api/admin/b2b/quotes` y `GET /api/admin/b2b/quotes/{id}`.

La propia cabecera de `BandejaAdminEndpoints` indica que creación y ciclo de cotizaciones llegan
después de decidir la serie. Por ello A7–A9 son diseño de referencia de la SPEC para el futuro
contrato de Paso 4; no convierten el prototipo en endpoint ni autorizan implementación adelantada.

## 2. Principios de composición

- Todo el panel utiliza el tema SILLAR real mediante roles de `tokens.css`.
- Se reutiliza `AdminShell`; no se diseña un armazón paralelo.
- Escritorio: contenido principal en `PageContainer`, bandejas con `Table`, detalle en `Drawer`.
- Móvil: el mismo `AdminShell` estrecho y su Drawer de navegación; el detalle sigue siendo Drawer,
  ocupando el ancho útil sin crear una página modal distinta.
- Ningún UUID es visible. `CustomerId`, `ProductId`, `ItemId` e IDs internos nunca se muestran.
- Estados usan texto + `Badge`; el color nunca es el único canal.
- Los conflictos se explican con causa y siguiente acción. No hay «Ha ocurrido un error» ni
  botones «Aceptar».
- El foco inicial y retorno de foco usan el patrón real de `Drawer`/`ConfirmDialog`.
- Objetivos táctiles principales: mínimo efectivo de 44 px en móvil, siguiendo el armazón estrecho.
- Las tablas que no caben no fuerzan la página completa a desplazamiento horizontal: en móvil se
  reemplazan por filas/tarjetas apiladas del mismo contenido.
- Nada depende de movimiento; `prefers-reduced-motion` conserva el fundido corto de plataforma.

## 3. Navegación del módulo

Grupo administrativo propuesto por SPEC: **Solicitudes**.

Entradas:

1. Personalizaciones → `/admin/solicitudes/personalizadas`
2. Solicitudes de volumen → `/admin/solicitudes/institucionales`
3. Cotizaciones → `/admin/solicitudes/cotizaciones`

Solo se compone cuando `b2b` está activo. Al desactivar el módulo desaparecen grupo, rutas y
acciones aportadas por M07 sin reservar hueco.

### Permisos

- `editor`: lectura y escritura ordinaria.
- `admin`: además, bajas lógicas y acciones que la SPEC reserva a `admin`.
- No se muestra una acción admin deshabilitada al editor: sencillamente no se aporta.
- A10 «Registrar pago» está fuera de A1–A9, pero cuando A9 la enlace debe ser visible solo a `admin`.
- Las notas internas nunca salen de estas superficies de personal.

## 4. A1 — Bandeja de personalizaciones

### Escritorio

`PageContainer` con título **Personalizaciones**, texto breve y filtro por los cinco estados.
`Table`:

- Producto de origen.
- Resumen de solicitud.
- Estado.
- Fecha.
- Indicador textual «Requiere reenlace» cuando `pending_relink`.
- Acción **Ver detalle**.

No se muestra `CustomerId`: el DTO actual no entrega identidad humana y un UUID está prohibido en UI.

### Móvil

Lista apilada. Cada fila conserva producto, estado, fecha, reenlace y resumen de dos/tres líneas.
La fila completa no se convierte en botón opaco; hay una acción explícita «Ver detalle».

### Estados

- Vacío: «Todavía no hay solicitudes de personalización».
- Filtro sin resultados: `NoResults`, distinto del vacío de módulo.
- Cargando: `Table`/`Spinner` con «Cargando personalizaciones».
- Datos: tabla/lista.
- Error recuperable: `FailureAlert` + «Reintentar».
- Módulo inactivo: la ruta no existe.

## 5. A2 — Detalle de personalización

Se abre en `Drawer` desde A1 para conservar contexto de la bandeja.

Contenido:

- producto de origen por nombre;
- descripción íntegra;
- cantidad si existe;
- fecha necesaria si existe;
- estado textual;
- bloque **Notas internas · Solo personal**;
- marca visible de baja lógica cuando `is_active = false`;
- aviso de reenlace cuando `pending_relink = true`.

### Acciones de editor

- Guardar notas.
- Ejecutar una transición permitida, mostrando **solo destinos válidos**.
- Abrir A3 si requiere reenlace.
- Abrir A7 «Preparar cotización» solo cuando la SPEC lo permita y exista contrato HTTP.

### Acción de admin

- «Dar de baja» mediante `ConfirmDialog`, nombrando consecuencia real.

### Conflicto real

Si se intenta una transición no permitida, el backend devuelve 409 con una frase que ya explica
qué estados son posibles. El diseño lo muestra en `Alert` dentro del Drawer, sin cerrarlo ni perder
las notas locales.

`cerrada` y `rechazada` son finales en el código actual: no se dibuja «Reabrir».

## 6. A3 — Cambio de estado, notas y reenlace

Este encargo agrupa en A3 los tres trabajos de una personalización.

### Estado y notas

Se mantienen dentro de A2; no se abre un modal por cada cambio. Guardar notas es una acción
independiente del cambio de estado.

### Reenlace

No se anida un segundo Drawer. A2 cambia a una subvista «Reenlazar producto» con:

- `Input` de búsqueda;
- resultados de catálogo;
- nombre del producto, sin UUID;
- acción «Reenlazar»;
- «Volver al detalle».

No se diseña drag-and-drop.

Conflictos:

- ningún producto coincide → `NoResults`;
- producto elegido ya no está activo al confirmar → 409:
  «Ese producto no está activo en el catálogo. Elige uno que lo esté.»
- solicitud dada de baja / inexistente → ausencia accionable y vuelta a bandeja.

La búsqueda debe apoyarse en contrato de M01; M07 no lee tablas de `catalog`.

## 7. A4 — Bandeja de solicitudes institucionales/volumen

Mismo patrón de A1, sin forzar una abstracción visual que esconda diferencias.

Columnas escritorio:

- Institución.
- Qué se solicita.
- Cantidad.
- Estado.
- Fecha / fecha del evento cuando exista.
- Acción «Ver detalle».

`contact_person` puede aparecer como dato secundario si existe. No se lo presenta como comprador.

Móvil: institución + cantidad + estado arriba; descripción y fecha debajo.

Estados: vacío, filtro sin resultados, carga, datos, error y módulo inactivo como A1.

## 8. A5 — Detalle de solicitud de volumen

Drawer desde A4.

Muestra:

- institución;
- documento de institución si existe;
- persona de contacto si existe;
- descripción;
- cantidad;
- fecha del evento si existe;
- estado;
- notas internas claramente separadas.

Editor:
- notas;
- transiciones válidas;
- entrada a A7 cuando corresponda y exista el contrato de creación.

Admin:
- baja lógica.

Conflicto real: transición de solicitud no permitida. No hay reenlace porque la solicitud de
volumen puede no partir de catálogo.

## 9. A6 — Bandeja de cotizaciones

Hoy es completamente respaldable por el backend de lectura.

Escritorio:

- encabezado **Número de cotización**; las maquetas no fijan prefijo/letra;
- origen: «Personalización» o «Solicitud de volumen»;
- total;
- estado;
- validez separada del estado;
- fecha;
- acción «Ver detalle».

Una cotización `enviada` con `invalidated_at` conserva Badge **Enviada** y añade un aviso
**Ya no es válida**. No se renombra el estado a «Caducada».

`ProductoDesactivado` no produce invalidación y no se representa como tal.

Filtros: cinco estados reales de cotización. La validez puede mostrarse como dato de fila, no se
inventa un sexto estado.

Vacío ≠ filtro sin resultados.

## 10. A7 — Crear cotización desde una solicitud

**Referencia de SPEC; no hay endpoint de creación en `7d002d040e844e4751a3b845d13982116523b0d9`.**

El diseño nace desde A2/A5 y conserva arriba una tarjeta de «Solicitud de origen» de solo lectura.
No enseña IDs.

Contenido:

- origen;
- resumen;
- cliente: **no se inventa nombre** porque el contrato administrativo actual solo aporta
  `CustomerId`; si producto requiere identidad humana, hace falta ampliar contrato.
- bloque de líneas iniciales;
- total calculado visualmente a partir de las líneas;
- leyenda neutra **«Número de cotización: se asignará al guardar»**.

Conflicto contractual de SPEC:

- solicitud `cerrada` o `rechazada`: no puede iniciar cotización; se muestra causa y retorno al detalle.

No se fija letra, formato final ni unicidad entre nodos.

## 11. A8 — Editor de cotización en borrador

**Referencia de SPEC; edición de cotización aún no tiene endpoint en el commit verificado.**

Solo se presenta como editable cuando el estado es `borrador`.

Cada línea tiene:

- descripción;
- cantidad;
- precio unitario cobrado;
- si viene de catálogo: presentación y precio de catálogo de referencia;
- si es libre: no se inventa precio de catálogo;
- subtotal.

### Línea de catálogo

La unidad es `catalog.product_items`, no el producto agregado.

Si `catalog_price_at_quote` es nulo con `ItemId` presente, el texto es **«Precio de catálogo:
a consultar»**. E3b sigue abierta y la pantalla **no promete** qué ocurrirá si luego aparece precio.

### Concepto mayorista

Puede mostrarse «Precio acordado / mayorista» como explicación del `unit_price`. No aparece:

- importe de umbral;
- porcentaje inventado;
- clave de setting;
- regla automática inexistente.

### Orden

Sin drag-and-drop. Cada línea puede tener botones accesibles «Subir» y «Bajar». El orden tiene
representación explícita y navegable por teclado.

### Errores

- descripción vacía;
- cantidad <= 0;
- precio unitario negativo;
- presentación de catálogo ya no disponible al intentar una operación futura, si el contrato así
  lo devuelve.

### Conflicto contractual

Intentar editar una cotización que ya no está en `borrador` debe conservar el documento y mostrar
que las líneas de una enviada no se cambian. No se ofrece «forzar guardado».

## 12. A9 — Detalle de cotización

Una única composición cubre:

- `enviada`;
- `aprobada`;
- `pagada`;
- `anulada`;
- `enviada` + invalidación.

Nunca se crea un estado visual «invalidada».

### Encabezado

- «Número de cotización» con valor real cuando el backend lo proporcione;
- Badge de estado;
- total;
- origen;
- fecha.

### Documento

Líneas congeladas, cantidades, precio unitario y total. El precio de catálogo de referencia puede
aparecer como metadato para personal, no como precio cobrado.

### Invalidación

Para `enviada` invalidada:

> **Esta cotización ya no es válida.**  
> {motivo legible devuelto por M07}

El estado sigue **Enviada**.

Solo se promete la invalidación que el código actual respalda: una cotización enviada, válida y
con precio de catálogo registrado puede invalidarse cuando cambia ese precio. Las líneas que
estaban «a consultar» no se evalúan mientras E3b siga abierta.

Desactivar un producto no invalida una cotización.

### Preparación para WhatsApp

Acción visible: **Preparar para enviar**.

Microcopy:

> Prepara la cotización y envíala desde tu propio WhatsApp.

No se dibuja:
- botón «Enviar por WhatsApp»;
- confirmación de envío remoto;
- token/estado de conexión;
- historial de mensajes.

El formato concreto preparado —texto, imagen o PDF— continúa como decisión de Diseño/JP; esta
propuesta no la cierra.

### Permisos

Las acciones ordinarias que el futuro contrato exponga pueden ser de `editor`.
«Registrar pago» y bajas lógicas, cuando se integren, son solo `admin` según la SPEC; al editor no
se le muestran.

## 13. Estados visuales transversales

### Vacío

Explica qué falta y qué puede hacer la persona. Una tabla vacía no es estado vacío.

### Cargando

Reutiliza `Spinner`/estado de `Table`. El texto nombra la operación:
«Cargando cotizaciones», no solo «Cargando».

### Error

`FailureAlert` junto a la operación, con reintento cuando sea recuperable.

### Conflicto

No destruye el contexto. Frase = causa + siguiente paso.

### Baja lógica

Las filas inactivas pueden usar el soporte `dimmed` de `Table` si el producto decide seguir
listándolas. La acción de baja sigue siendo exclusivamente `admin`.

## 14. Armazón, móvil y accesibilidad

- Navegación estrecha: se reutiliza el Drawer izquierdo de `AdminShell`.
- Detalles: Drawer derecho compartido.
- No se apilan dos capas modales. Las subvistas cambian contenido dentro del Drawer.
- El teclado nunca queda oculto detrás de una acción fija: si se usa footer de Drawer en móvil,
  el cuerpo es el único contenedor con scroll y el footer permanece después del campo enfocado,
  sin cubrirlo.
- No se introduce una barra inferior fija global.
- Textos largos usan `overflow-wrap`; los números se alinean sin forzar ancho de página.
- En móvil no se replica una tabla ancha con scroll lateral como única vía.
- Foco visible siempre.
- `ConfirmDialog` se usa únicamente para una acción destructiva real.
- El botón que confirma nombra la acción: «Dar de baja la solicitud», nunca «Aceptar».

## 15. Resultado

A1–A6 pueden revisarse directamente contra contratos existentes.  
A7–A9 pueden revisarse visualmente contra la SPEC, pero cualquier control de escritura que todavía
no tenga endpoint debe quedar anotado como **no implementable aún**.

Nada de esta propuesta equivale a aprobación del paso 3.5.
