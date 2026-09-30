# Inventario de componentes y tokens reutilizados — M07

**Fecha:** 30/09/2026 · America/Lima  
**Origen:** `JP-777/SILLAR`

## Componentes existentes

| Componente/patrón | Uso M07 |
|---|---|
| `AdminShell` | armazón de todas A1–A9 |
| `PageContainer` | encabezado y ritmo de páginas |
| `Table` | A1, A4, A6 en escritorio |
| `Badge` | estados de solicitud/cotización |
| `Button` | acciones |
| `Input` | búsqueda de reenlace y campos simples |
| `Field` | etiqueta, ayuda y error de formularios |
| `Alert` / `FailureAlert` | errores y conflictos |
| `EmptyState` | bandeja realmente vacía |
| `NoResults` | filtro/búsqueda sin coincidencias |
| `Spinner` | carga accesible |
| `Drawer` | A2, A3 y A5 |
| `ConfirmDialog` | baja lógica `admin` |
| `Toasts` | confirmación no bloqueante de escrituras |
| `ThemeToggle` | ya pertenece a `AdminShell` |

## Tokens existentes

Se usan por rol, nunca por literal visual inventado:

- superficies: `--bg`, `--bg-raised`, `--bg-sunken`;
- texto: `--text`, `--text-muted`, `--text-subtle`;
- bordes: `--border`, `--border-strong`;
- acción: `--primary`, `--primary-hover`, `--on-primary`, `--link`;
- selección: `--selected`, `--selected-bg`;
- semánticos: `--success`, `--warning`, `--danger` y fondos asociados;
- espaciado: `--s1` … `--s8`;
- radios: `--r-sm`, `--r-md`, `--r-lg`;
- controles: `--alto-control-sm/md/lg`;
- movimiento: `--duracion-*`, `--curva-*`, con `prefers-reduced-motion`.

## Lo que NO se crea dentro de M07

- segunda tabla genérica;
- segundo Drawer;
- nuevo sistema de Badge;
- selector visual con drag-and-drop;
- modal genérico de error;
- colores B2B propios;
- tipografía propia;
- navegación propia.

## Posibles piezas nuevas, todavía no aprobadas

### Fila responsiva de bandeja

En móvil `Table` no debe ser la única representación si obliga a scroll horizontal. Puede surgir un
patrón transversal de «fila apilada», pero solo debe entrar a `shared` si un segundo módulo confirma
el mismo contrato.

### Selector de producto por contrato

A3 necesita buscar productos activos. No se encontró un `ProductPicker` frontend compartido. La
necesidad es real, pero la generalización a `shared` requiere revisar el contrato de M01 y un segundo
uso antes de crear una abstracción.

### Editor de líneas

A8 necesita filas editables y reordenables. No existe patrón compartido accesible de drag-and-drop,
por lo que esta propuesta usa acciones «Subir» / «Bajar». No se añade biblioteca.
