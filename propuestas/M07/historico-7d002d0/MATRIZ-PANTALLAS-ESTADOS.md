# Matriz A1–A9 · estados y dispositivos

**Fecha:** 30/09/2026 · America/Lima  
**Estado:** PROPUESTA

Leyenda:
- ✓ diseñado
- C = conflicto real/contractual incluido
- N/A = no corresponde como estado autónomo
- HTTP pendiente = la SPEC define la superficie, pero 7d002d0 todavía no ofrece escritura HTTP.

| Superficie | Vacío | Cargando | Datos | Error | Conflicto | Escritorio | Móvil | Contrato actual |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| A1 Bandeja personalizaciones | ✓ | ✓ | ✓ | ✓ | C filtro sin resultados | ✓ | ✓ | Lectura real |
| A2 Detalle personalización | N/A | ✓ | ✓ | ✓ | C transición inválida / pendiente reenlace | ✓ | ✓ | Lectura + escritura real |
| A3 Estado/notas/reenlace | ✓ búsqueda | ✓ | ✓ | ✓ | C producto inactivo / sin coincidencias | ✓ | ✓ | Escritura real |
| A4 Bandeja volumen | ✓ | ✓ | ✓ | ✓ | C filtro sin resultados | ✓ | ✓ | Lectura real |
| A5 Detalle volumen | N/A | ✓ | ✓ | ✓ | C transición inválida | ✓ | ✓ | Lectura + escritura real |
| A6 Bandeja cotizaciones | ✓ | ✓ | ✓ | ✓ | C enviada invalidada ≠ nuevo estado | ✓ | ✓ | Lectura real |
| A7 Crear cotización | N/A | ✓ | ✓ | ✓ | C solicitud final | ✓ | ✓ | **HTTP pendiente** |
| A8 Editor borrador | ✓ líneas | ✓ | ✓ | ✓ validación | C no-borrador / E3b abierta | ✓ | ✓ | **HTTP pendiente** |
| A9 Detalle cotización | N/A | ✓ | ✓ | ✓ | C enviada invalidada | ✓ | ✓ | Lectura real; ciclo HTTP pendiente |

## Detalle por dispositivo

### Escritorio

- `AdminShell` con barra lateral y topbar reales.
- `PageContainer` ancho máximo de plataforma.
- A1/A4/A6: `Table`.
- A2/A5: `Drawer` derecho.
- A3: subvista dentro del mismo Drawer.
- A7/A8: página de trabajo, no Drawer: editar varias líneas requiere más espacio.
- A9: página/detalle de lectura con acciones contextuales.

### Móvil

- navegación de `AdminShell` mediante Drawer izquierdo;
- bandejas como filas apiladas, sin depender de scroll horizontal;
- A2/A3/A5: Drawer derecho a ancho útil;
- A7/A8/A9: página vertical;
- controles primarios con objetivo táctil suficiente;
- footer de acciones no puede tapar el campo cuando aparece el teclado.

## Temas

Todas las superficies administrativas se revisan en claro y oscuro con los tokens SILLAR actuales.
No existe tema cliente en estas pantallas.
