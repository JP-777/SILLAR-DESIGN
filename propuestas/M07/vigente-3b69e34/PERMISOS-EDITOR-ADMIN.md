# PERMISOS — M07 Paso 3.5

**Fecha:** 30/09/2026 · America/Lima  
**Contrato:** `3b69e34b6f3823f632ab2921fd8b06643a85971e`

El grupo `/api/admin/b2b` exige como mínimo `editor`.

| Operación | Editor | Admin |
|---|---:|---:|
| Ver bandejas A1/A4/A6 | Sí | Sí |
| Ver detalles A2/A5/A9 | Sí | Sí |
| Cambiar estado de solicitud | Sí | Sí |
| Guardar notas internas | Sí | Sí |
| Reenlazar producto | Sí | Sí |
| Crear cotización A7 | Sí | Sí |
| Editar líneas de borrador A8 | Sí | Sí |
| Enviar cotización | Sí | Sí |
| Registrar aprobación | Sí | Sí |
| Registrar pago | **No** | Sí |
| Baja lógica personalización | **No** | Sí |
| Baja lógica volumen | **No** | Sí |
| Baja lógica cotización | **No** | Sí |

## Regla visual

Las acciones reservadas a `admin` **no se muestran** al `editor`. No se dejan deshabilitadas como
anuncio de una facultad que no tiene.

Las notas internas permanecen exclusivamente en panel y nunca forman parte de la vista del cliente.

## Pago

A9, rol `admin`:

- Yape → campo «Código de operación» requerido.
- Efectivo → no exige referencia.
- Tarjeta → no se presenta como opción habilitada.

## Registrado por

Hoy `paid_registered_by` recibe el correo de `ICurrentAdmin`. C13 pide nombre humano.
El diseño usa el rótulo **Registrado por** sin prometer el tipo de identidad almacenada.
