# CONFLICTOS REALES FINALES — M07

**Fecha:** 30/09/2026  
**Base M07:** `3b69e34b6f3823f632ab2921fd8b06643a85971e`

## Solicitudes

### Estado no permitido

Respaldado por `TransicionesDeSolicitud`.
La UI presenta solamente destinos válidos, pero conserva el manejo del 409 si el estado ya cambió.

### Reenlace a producto no activo

Mensaje backend:
«Ese producto no está activo en el catálogo. Elige uno que lo esté.»

### Solicitud final al crear cotización

Una solicitud `cerrada` o `rechazada` no se vuelve a cotizar.

### Baja lógica

Solo `admin`.

## Cotizaciones

### Editar fuera de borrador

Conflicto real. El backend indica que las líneas solo se editan en borrador y pide crear una nueva
desde la misma solicitud si hace falta cambiar lo ya enviado.

### Enviar sin líneas

Conflicto real:
la cotización borrador necesita al menos una línea antes de enviarse.

### Aprobar una enviada invalidada

Conflicto real. La cotización conserva estado **Enviada**, muestra **Ya no es válida** y el motivo.
Debe crearse una nueva desde la solicitud.

### E3b cerrada

- conocido → conocido distinto: invalida;
- conocido → «a consultar»: invalida;
- «a consultar» → precio: no invalida;
- línea libre: no participa.

### Pago

- estado distinto de `aprobada`: conflicto;
- Yape sin código: conflicto;
- efectivo sin referencia: válido;
- tarjeta: conflicto hasta M11;
- registrar pago: solo `admin`.

### Baja de cotización

Solo `admin`. Es baja lógica, no equivale a estado `anulada`.

### Estado `anulada`

Existe en dominio y filtros, pero no existe endpoint verificado que haga la transición. Se representa
si llega en lectura; no se inventa botón.

## Mayorista

No es conflicto comercial automático.

- `configuracion_pendiente`: ayuda al personal, no rechazo de cotización.
- `no_evaluable`: ayuda al personal, no rechazo.
- `alcanza` / `no_alcanza`: información; nunca aplica descuento.

## Identidad humana ausente

No es error de la solicitud. Si `ICustomerIdentityReader` no devuelve ficha:
**Cliente no disponible**.

No se afirma la causa.

## Fuera de la revisión vigente

- edición simultánea sin contrato de versión;
- caducidad temporal;
- invalidación por ProductoDesactivado;
- envío automático por WhatsApp;
- tarjeta antes de M11;
- reserva/inventario;
- descuento automático mayorista.
