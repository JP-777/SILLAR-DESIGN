# MATRIZ FINAL A1–A9 — M07 Paso 3.5

**Fecha:** 30/09/2026 · America/Lima  
**M07:** `3b69e34b6f3823f632ab2921fd8b06643a85971e`  
**CRM identidad:** `70cfee55baad8168cdb17cbc3be77dfc0cd20b15` (contrato autorizado, aún no integrado en M07)

| Superficie | Vacío | Cargando | Datos | Error | Conflicto real | Escritorio | Móvil | Estado para Paso 4 |
|---|---|---|---|---|---|---|---|---|
| A1 Bandeja personalizaciones | Sí | Sí | Sí | Sí | filtro sin resultados | Tabla | filas apiladas | Lista; identidad espera integración CRM |
| A2 Detalle personalización | N/A | Sí | Sí | Sí | transición inválida / reenlace | Drawer | Drawer ancho útil | Lista; identidad espera CRM |
| A3 Estado/notas/reenlace | búsqueda vacía | Sí | Sí | Sí | producto inactivo / estado inválido | subvista Drawer | subvista Drawer | **Lista** |
| A4 Bandeja volumen | Sí | Sí | Sí | Sí | filtro sin resultados | Tabla | filas apiladas | Lista; identidad espera CRM |
| A5 Detalle volumen | N/A | Sí | Sí | Sí | transición inválida | Drawer | Drawer ancho útil | Lista; identidad espera CRM |
| A6 Bandeja cotizaciones | Sí | Sí | Sí | Sí | enviada invalidada ≠ estado nuevo | Tabla | filas apiladas | Lista; identidad espera CRM |
| A7 Crear cotización | origen no disponible | Sí | Sí | Sí | solicitud final / línea inválida | página | página vertical | API lista; identidad espera CRM |
| A8 Editor borrador | 0 líneas válido | Sí | Sí | Sí | no-borrador / presentación inactiva | página | página vertical | **Lista** |
| A9 Detalle/ciclo | N/A | Sí | Sí | Sí | invalidada / transición incompatible / pago inválido | página | página vertical | **Lista**, C13 solo mejora «Registrado por» |

## Identidad humana

A1/A4/A6:
- nombre + correo;
- teléfono no ocupa columna por defecto;
- si el contrato no devuelve identidad: **Cliente no disponible**.

A2/A5/A7:
- nombre;
- correo;
- teléfono si existe;
- la ausencia no explica la causa.

## A7

`POST /api/admin/b2b/quotes`.

- Origen explícito: personalización o volumen.
- Puede crearse con líneas vacías.
- Al crear, mostrar número real `C-AAAA-NNNN`.
- Solicitud cerrada/rechazada: conflicto.

## A8

`PUT /api/admin/b2b/quotes/{id}`.

- Solo borrador.
- Líneas de catálogo o libres.
- Subir/Bajar.
- Precio unitario = lo cobrado.
- Precio de catálogo = referencia; nulo con item significa «a consultar».
- Umbral mayorista es ayuda, nunca descuento automático.

## A9

Acciones según estado y rol:

| Estado | Editor | Admin |
|---|---|---|
| Borrador | Editar; Enviar si tiene líneas | Lo mismo + baja |
| Enviada vigente | Registrar aprobación; Preparar para enviar | Lo mismo + baja |
| Enviada invalidada | Preparar nueva desde solicitud; lectura | Lo mismo + baja |
| Aprobada | Lectura | Registrar pago + baja |
| Pagada | Lectura | Lectura + baja |
| Anulada | Lectura | Lectura; no se inventa transición para llegar aquí |

### Pago

Yape:
- método Yape;
- **Código de operación** obligatorio.

Efectivo:
- método Efectivo;
- referencia no obligatoria.

Tarjeta:
- no aparece como opción disponible.

### Mayorista

- `alcanza`: informativo.
- `no_alcanza`: informativo.
- `no_evaluable`: el personal decide.
- `configuracion_pendiente`: falta configurar; el personal decide.

## Temas y accesibilidad

Las nueve superficies usan tokens SILLAR, modo claro/oscuro, foco visible y `prefers-reduced-motion`.
No hay tema público de cliente en A1–A9.
