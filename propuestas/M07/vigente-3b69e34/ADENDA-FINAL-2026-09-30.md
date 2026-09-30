# ADENDA FINAL — M07 B2B · Paso 3.5

**Fecha:** 30/09/2026 · America/Lima  
**Estado:** PROPUESTA FINAL PARA REVISIÓN DE CHAT 2 · NO APROBADA  
**Prevalece sobre:** los puntos superados del paquete histórico construido sobre `7d002d040e844e4751a3b845d13982116523b0d9`  
**Producto main verificado:** `e839989432283c755edf7d4ae47b2c37697215ec`  
**M07 verificado:** `m07-b2b-sobre-main` @ `3b69e34b6f3823f632ab2921fd8b06643a85971e`  
**Contrato CRM identidad verificado:** `integration/crm-identidad-cliente` @ `70cfee55baad8168cdb17cbc3be77dfc0cd20b15`

## 1. Regla de esta adenda

El paquete histórico permanece intacto. Esta adenda no lo reescribe: corrige únicamente las
afirmaciones que quedaron obsoletas después de cerrar el ciclo real de cotizaciones y publicar
el contrato de identidad humana de clientes.

Cuando haya contradicción entre el material histórico y esta adenda, rige esta adenda.

## 2. A7–A9 dejan de ser hipotéticas

En `3b69e34b6f3823f632ab2921fd8b06643a85971e` existen realmente:

- `POST /api/admin/b2b/quotes`
- `PUT /api/admin/b2b/quotes/{id}`
- `PUT /api/admin/b2b/quotes/{id}/send`
- `PUT /api/admin/b2b/quotes/{id}/approve`
- `PUT /api/admin/b2b/quotes/{id}/payment` — solo `admin`
- `DELETE /api/admin/b2b/quotes/{id}` — solo `admin`
- `GET /api/admin/b2b/quotes/{id}`

Por tanto A7, A8 y A9 se diseñan contra contrato real.

### A7 · Crear cotización

- Nace de una personalización o solicitud de volumen activa.
- Una solicitud `cerrada` o `rechazada` no admite una nueva cotización.
- Crear cotización puede recibir líneas iniciales vacías.
- La creación pasa la solicitud a `cotizada` si todavía no lo estaba.
- La respuesta creada ya tiene número visible real.

### A8 · Editor de borrador

- Solo `borrador` admite sustitución de líneas.
- Cada guardado sustituye el conjunto de líneas.
- Una presentación de catálogo debe seguir activa al guardar.
- Línea libre exige descripción.
- Cantidad > 0.
- Precio unitario >= 0.
- El orden de la lista define `SortOrder`; el diseño conserva **Subir / Bajar**.
- No se añade drag-and-drop.

### A9 · Ciclo posterior

- `borrador` → `enviada`, solo si hay al menos una línea.
- `enviada` → `aprobada`, solo si sigue vigente.
- `aprobada` → `pagada`, registro manual y solo `admin`.
- Baja lógica: solo `admin`.
- La auditoría de cotizaciones usa el número visible.

**No se inventa transición a `anulada`:** el estado existe en dominio/filtros, pero el contrato HTTP
verificado no ofrece una acción para alcanzarlo. A9 puede representarlo en lectura, no ofrecer
un botón «Anular».

## 3. Número visible cerrado

Formato ratificado e implementado:

`C-AAAA-NNNN`

Ejemplo:

`C-2026-0001`

El correlativo tiene al menos cuatro cifras y puede crecer sin truncarse. Se reinicia por año.
La UI nunca presenta UUID como identificador de la cotización.

## 4. E3b cerrada

Para una cotización `enviada`:

| Antes | Ahora | Resultado |
|---|---|---|
| Precio conocido | Otro precio conocido | Invalida |
| Precio conocido | «A consultar» | Invalida |
| «A consultar» | Aparece precio | **No invalida** |
| Línea libre | Cualquier cambio de catálogo | No participa |

La invalidación **no cambia `status`**. Visualmente:

- estado: **Enviada**;
- condición separada: **Ya no es válida**;
- motivo legible devuelto por M07.

`ProductoDesactivado` sigue sin invalidar cotizaciones.

## 5. Umbral mayorista

Clave ratificada:

`b2b_wholesale_threshold_amount`

La evaluación real de backend es una de:

- `alcanza`
- `no_alcanza`
- `no_evaluable`
- `configuracion_pendiente`

### Regla visual

El umbral **informa; no aplica descuento**.

- `alcanza`: «A precio de lista, esta cotización alcanza el umbral mayorista.»
- `no_alcanza`: «A precio de lista, esta cotización no alcanza el umbral mayorista.»
- `no_evaluable`: explicar que existen líneas sin precio de catálogo y decide el personal.
- `configuracion_pendiente`: explicar que falta configurar el umbral y que mientras tanto decide
  el personal.

No se inventa importe. El valor solo se muestra si el backend lo devuelve.

## 6. Identidad humana del cliente

Contrato autorizado disponible en `70cfee55baad8168cdb17cbc3be77dfc0cd20b15`:

`ICustomerIdentityReader`
- `GetAsync(customerId)`
- `GetManyAsync(customerIds)`

`CustomerIdentity`
- `CustomerId`
- `FullName`
- `Email`
- `Phone` opcional

La implementación devuelve únicamente fichas activas. Ausencia, baja o bloqueo producen `null` /
ausencia del diccionario **sin informar el motivo**.

### Diseño final

A1, A2, A4, A5, A6 y A7 pueden mostrar:

- nombre;
- correo;
- teléfono solo donde aporte valor, principalmente detalle/acción de contacto.

Las bandejas deben apoyarse en lectura por lotes. El frontend **no consulta CRM directamente**.

### Ausencia de identidad

Representación reversible de diseño:

**Cliente no disponible**

Se conserva visible toda la información propia de la solicitud/cotización. No se añade «eliminado»,
«bloqueado», «inactivo» ni ninguna causa que el contrato no revela.

### Límite actual

La costura CRM todavía no está integrada en M07/main. Los DTO de M07 en `3b69e34b6f3823f632ab2921fd8b06643a85971e` continúan
exponiendo `CustomerId`. La maquetación de identidad está cerrada, pero su implementación espera
la proyección backend mediante el contrato autorizado.

## 7. Pago

Contrato real:

- Yape: exige código de operación.
- Efectivo: no exige referencia.
- Tarjeta: no disponible hasta M11.
- Registrar pago: solo `admin`.
- La cotización debe estar `aprobada`.

### C13

`paid_registered_by` debería representar el nombre humano, pero `ICurrentAdmin` hoy ofrece id,
correo y rol. El backend almacena provisionalmente el correo.

Diseño:

- puede mostrar **Registrado por** con el valor disponible;
- no afirma que sea ya el nombre de la persona;
- C13 queda documentada como mejora de contrato CORE.

C13 no bloquea el flujo de pago ni A9.

## 8. WhatsApp

Sigue sin integración externa.

Acción: **Preparar para enviar**.

Ayuda: «Prepara la cotización y envíala desde tu propio WhatsApp.»

No existe:
- API de WhatsApp;
- estado «enviado por WhatsApp»;
- confirmación automática;
- credenciales;
- historial remoto.

## 9. Partes listas para Paso 4

### Listas contra contrato M07 actual

- A3: estado, notas y reenlace.
- A8: editor de borrador, incluidos Subir/Bajar.
- A9: lectura, envío, aprobación, pago y baja según rol; invalidación y umbral.
- Estructura, estados, carga, error, accesibilidad y responsive de A1–A9.

### Listas con una dependencia de integración CRM

La parte de **identidad humana** de:
- A1
- A2
- A4
- A5
- A6
- A7

El diseño ya está definido; el frontend no debe implementarla leyendo CRM directamente. Espera que
M07 proyecte `CustomerIdentity`.

### Dependencia C13

Solo la calidad humana del campo **Registrado por** en A9. Hoy puede aparecer el valor provisional
existente. No bloquea el resto.

### Otras costuras reales

- `b2bNavigation` y rutas frontend aún deben montarse en el mecanismo modular del panel.
- C12: provisionar en CORE la fila de `b2b_wholesale_threshold_amount`. No bloquea el diseño:
  `configuracion_pendiente` es un estado real y diseñado.
- `anulada`: existe como estado, pero no hay acción HTTP de anulación. No se inventa.
- E1/E9 son entradas públicas fuera de A1–A9 y no bloquean este conjunto administrativo.

## 10. Aprobación

Esta adenda no aprueba el Paso 3.5. Deja el material listo para revisión de Chat 2.
