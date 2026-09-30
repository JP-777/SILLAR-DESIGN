# DECISIONES ABIERTAS Y BARRERAS RESTANTES — M07

**Fecha:** 30/09/2026  
**M07:** `3b69e34b6f3823f632ab2921fd8b06643a85971e`  
**CRM contrato:** `70cfee55baad8168cdb17cbc3be77dfc0cd20b15`

## 1. Integración CRM — única dependencia para identidad humana de A1/A2/A4/A5/A6/A7

`ICustomerIdentityReader` ya está autorizado y publicado en la rama de integración, pero todavía no
está integrado en M07/main.

El diseño final ya define:
- FullName;
- Email;
- Phone opcional;
- fallback «Cliente no disponible».

Pendiente técnico:
M07 debe proyectar esa identidad en DTO propios. El frontend no consulta CRM.

## 2. C13 — nombre de quien registra el pago

`ICurrentAdmin` actual tiene:
- AdminUserId;
- Email;
- Role.

No tiene nombre visible.

Hoy M07 persiste el correo en `paid_registered_by`. C13 solicita que CORE exponga el nombre humano.
No bloquea A9 ni el Paso 4, pero el diseño no debe presentar el dato actual como nombre definitivo.

## 3. C12 — provisionamiento del ajuste mayorista

La semántica y clave están cerradas:
`b2b_wholesale_threshold_amount`.

M07 ya maneja `configuracion_pendiente`, así que la ausencia del seed/configuración no bloquea el
diseño. Integración deberá provisionar el ajuste en CORE para que una instalación pueda configurarlo.

## 4. Estado `anulada`

Existe en `QuoteStatus` y en el filtro administrativo. En los endpoints verificados no existe una
acción de anulación.

Decisión de diseño:
- sí representar el estado si viene en lectura;
- no ofrecer botón «Anular».

Si producto necesita alcanzar ese estado desde el panel, hace falta contrato backend explícito.

## 5. Formato de «Preparar para enviar»

Sigue abierta la forma concreta:
- texto;
- imagen;
- PDF;
- otra exportación local.

No bloquea el diseño del flujo. La acción permanece neutral y sin integración WhatsApp.

## 6. Entradas públicas E1/E9

Continúan fuera de A1–A9 y no bloquean este cierre administrativo:
- E1 consulta de producto «a consultar»;
- E9 origen del formulario de volumen sin producto.

## 7. Navegación frontend

En `3b69e34b6f3823f632ab2921fd8b06643a85971e` todavía no existe `frontend/src/modules/b2b` y `MODULE_NAVIGATION` no incluye M07.
Esto es trabajo real del Paso 4/costura de integración, no una decisión de diseño pendiente.

## Barreras para comenzar Paso 4 por superficie

- A3, A8, A9: ninguna barrera de diseño.
- A1/A2/A4/A5/A6/A7: la composición está cerrada; la **identidad humana** requiere integrar la
  costura CRM antes de implementar ese bloque con datos reales.
- A9 «Registrado por»: C13 es mejora posterior; puede mostrarse el valor provisional actual.
