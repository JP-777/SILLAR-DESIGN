# INVENTARIO FINAL DE COMPONENTES — M07

**Fecha:** 30/09/2026

## Reutilización obligatoria

| Existente | Uso |
|---|---|
| `AdminShell` | armazón A1–A9 |
| `PageContainer` | páginas de bandeja/editor/detalle |
| `Table` | A1, A4, A6 escritorio |
| `Badge` | estados y condición de validez |
| `Button` | acciones |
| `Input` | búsqueda, referencia de pago y campos simples |
| `Field` | etiqueta/hint/error |
| `Alert` / `FailureAlert` | conflictos y fallos |
| `EmptyState` | módulo/bandeja vacía |
| `NoResults` | filtros o búsqueda sin coincidencias |
| `Spinner` | carga |
| `Drawer` | A2/A3/A5 |
| `ConfirmDialog` | bajas lógicas admin |
| `Toasts` | confirmación de escrituras |
| `ThemeToggle` | ya en AdminShell |

## Tokens

Solo roles existentes de `tokens.css`:
- `--bg`, `--bg-raised`, `--bg-sunken`;
- `--text`, `--text-muted`, `--text-subtle`;
- `--border`, `--border-strong`;
- `--primary`, `--primary-hover`, `--on-primary`, `--link`;
- `--selected`, `--selected-bg`;
- `--success`, `--warning`, `--danger` y fondos;
- `--s1`…`--s8`;
- `--r-sm`, `--r-md`, `--r-lg`;
- tokens de duración/curva y movimiento reducido.

## Patrones de diseño final

### Cliente compacto

En bandeja:
- nombre;
- correo debajo;
- fallback «Cliente no disponible».

No requiere componente nuevo si se resuelve como celda compuesta.

### Cliente detallado

En A2/A5/A7:
- nombre;
- correo;
- teléfono opcional.

### Evaluación mayorista

Se puede representar con `Alert` o `Card` + texto. No necesita un componente semántico nuevo:
`alcanza` no equivale a `success` comercial ni dispara descuento.

### Editor de líneas

- filas editables;
- acciones `Subir` / `Bajar`;
- sin drag-and-drop;
- no añadir biblioteca.

## Posibles componentes compartidos a evaluar durante Paso 4

Solo si aparece segundo uso:
- fila apilada responsiva para reemplazar tablas en móvil;
- selector de `product_item` por contrato M01;
- fila de editor de líneas.

No se crean por anticipado.
