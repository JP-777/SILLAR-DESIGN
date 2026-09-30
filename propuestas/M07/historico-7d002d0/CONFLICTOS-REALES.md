# Conflictos reales — M07 Paso 3.5

**Fecha:** 30/09/2026  
**Regla:** solo se diseñan conflictos respaldados por SPEC o código verificado.

## Solicitudes

### Transición de estado no permitida

Respaldado por `TransicionesDeSolicitud`.

- `recibida` → `en_revision` o `rechazada`
- `en_revision` → `cotizada` o `rechazada`
- `cotizada` → `cerrada` o `rechazada`
- `cerrada` y `rechazada` son finales

La UI no dibuja destinos imposibles; si el estado cambió antes de enviar la operación, el 409 se
presenta sin perder el detalle abierto.

### Reenlace a producto inactivo

Respaldado por `BandejaService.ReenlazarAsync`.

Mensaje contractual actual:
«Ese producto no está activo en el catálogo. Elige uno que lo esté.»

### Ningún producto coincide

Es un estado de búsqueda, no un error de servidor. Se usa `NoResults`.

### Baja lógica

Solo `admin`. Un editor no recibe un botón deshabilitado; la acción no se presenta.

## Cotizaciones

### Enviada invalidada por precio

Respaldado por `ReaccionAlCatalogo`.

- solo cotizaciones `enviada`;
- solo si aún no estaban invalidadas;
- solo líneas de catálogo con `CatalogPriceAtQuote` no nulo;
- conserva `status = enviada`;
- presenta `invalidated_at` y `invalidated_reason`.

### Producto desactivado

**No invalida cotizaciones.** Solo afecta el reenlace de solicitudes de personalización.

### E3b

Una línea que era «a consultar» (`CatalogPriceAtQuote = null` con `ItemId`) no se evalúa mientras
E3b esté abierta. La propuesta no muestra una garantía de caducidad en ese caso.

### Edición fuera de borrador

Respaldada por la SPEC: las líneas solo se editan en `borrador`.
El endpoint aún no existe en `7d002d0`; es conflicto contractual para el futuro ciclo, no una
respuesta HTTP observada hoy.

### Solicitud cerrada/rechazada al crear cotización

Respaldado por §7.1 para A7. El endpoint aún no existe; se diseña como frontera de la SPEC, no como
comportamiento ya implementado.

## Validaciones

Para A8, cuando exista escritura:

- descripción de línea no vacía;
- cantidad > 0;
- precio unitario >= 0;
- el precio de catálogo puede ser nulo y eso no equivale a cero.

No se inventan mensajes de servidor definitivos mientras el endpoint no exista.

## No son conflictos de esta propuesta

- «edición simultánea» genérica sin control de versión;
- caducidad temporal;
- invalidación por desactivación de producto;
- WhatsApp desconectado;
- pasarela de pago;
- reserva de inventario;
- umbral mayorista con un importe concreto;
- una letra concreta de serie.
