# M05a · Inventario de reutilización y diferencias

**PROPUESTO.** Creación, modificación y verificación: 28/09/2026, America/Lima. Producto `main`: `e839989432283c755edf7d4ae47b2c37697215ec`; rama M05a: `96111acd2ff02b38f10305039a432b26ceecd044`.

| Recurso real comprobado | Uso de diseño | Límite y origen |
|---|---|---|
| `shared/ui/Button` | abrir ficha, crear, editar, reintentar, guardar y acciones administrativas | variantes `primary`, `secondary`, `ghost`, `danger`; tipo por defecto `button`, submit explícito |
| `shared/ui/Input` y `Field` | nombre, slug, precio, unidad; error contextual | `Field.error` anuncia al lector; texto largo necesita patrón verificado antes de adoptar textarea |
| `shared/ui/Alert` | fallo de red, imagen no disponible, conflicto | tones `info/success/warning/danger`; nunca error genérico |
| `shared/ui/Card` | referencia de contenedor informativo; listado público solo tras comprobar ajuste a composición | no copiar `ProductCard` de M01 |
| `shared/ui/Badge` | Borrador/Publicado/Archivado + texto | no hay tono «archivado» aprobado; usar `neutral` y texto |
| `shared/ui/EmptyState` | administración sin entradas; público activo sin publicaciones | una sola acción; en vacío público no ofrecer «Crear» a visitante |
| `shared/ui/Spinner` | lista/ficha/editor ante carga real | etiquetas concretas y umbral de demora; evitar dos regiones vivas |
| `shared/ui/patterns.Table` | listado administrativo escritorio | móvil cambia presentación, sin forzar tabla de muchas columnas |
| `shared/ui/patterns.FailureAlert` | fallo de red según formato central | no simular `Failure` si no lo devuelve el contrato |
| `shared/ui/patterns.ConfirmDialog` | archivar / retirar con consecuencia real | foco y cierre resueltos; botón nombra la operación |
| `shared/ui/patterns.Drawer` | navegación estrecha del panel, `side=left`; eventual patrón compartido si realmente necesario | no crear un `<dialog>` nuevo; conservar `useFocusTrap` |
| `shared/ui/patterns.useToasts` / `Toasts` | confirmación no intrusiva de guardado | no retrasar acción por animación |
| `shared/ui/Gallery` | solo selector/grilla **administrativa de archivos CORE** si el flujo existente lo permite | NO es galería fotográfica pública del servicio |
| `shared/ui/NoPhoto` | referencia para fallback cuando no hay imagen, contexto «Servicio» tras revisión | no prometer recuperación de medios retirados |
| `layout/PageContainer` | título/descripcion y ritmo del panel | en móvil debe permitir acciones en flujo, no recortar controles |
| `layout/AdminShell` y `layout/navigation` | navbar/sideBar existentes; menú por capacidad y rol | no introducir enlace «Servicios» global sin ruta/capacidad real |
| `platform/homeSections`, `homeState`, `surfaceRegistry` | invitación condicionada en portada; distinción vacío vs carga/error | orden lo decide plataforma/JP; nuevo aporte solo con autorización |
| `platform/PublicLayout` y `footerContributions` | conservar pie público compartido en ruta de servicio | no clonar footer o inventar contribución de M05a |
| `styles/tokens.css` y `base.css` | roles de color, geometría, espaciado, contraste, movimiento reducido | tema público definitivo es **del cliente**, no SILLAR |

## Diferencias sujetas a revisión

1. **NUEVO PROPUESTO, no aprobado:** composición de tarjeta editorial de servicio. No importar tarjeta de M01; si se confirma segundo caso transversal, evaluar mover patrón a `shared` con contrato.
2. **PENDIENTE:** patrón de `textarea` para descripción larga y tratamiento con `Field`; verificar componentes reales antes de introducir un nuevo componente compartido.
3. **PENDIENTE DE PRODUCTO:** lugar/orden de enlace público de servicios en portada, y si es deseable un menú público persistente; no construirlo por cuenta propia.
4. **PENDIENTE DE PRODUCTO:** tema real del cliente en las superficies públicas; el prototipo neutral con roles SILLAR no lo decide.
5. **DESCARTADO:** selector de opciones, calendario, carrito, inventario, pagos, órdenes y seguimiento; ninguna pieza sin contrato.
6. **PENDIENTE TÉCNICO:** estrategia exacta para evitar sobrescritura concurrente y mostrar 409 conforme al contrato existente; el diseño solo especifica la experiencia de conflicto.
7. **PENDIENTE:** política de retención del binario en futuros snapshots M05b. El fallback aquí NO implica conservación.
8. **PROPUESTO:** representación móvil del listado administrativo en filas/tarjetas en vez de tabla horizontal; la estructura específica necesita aprobación del líder técnico.

Ninguna diferencia habilita cambios al repositorio del producto desde el equipo de diseño.
