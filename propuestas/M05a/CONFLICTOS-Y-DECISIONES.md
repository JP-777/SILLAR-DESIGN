# M05a · Registro de conflictos, soluciones y escaladas

**Creación / modificación / verificación:** 28/09/2026, America/Lima. Producto `main` `e839989432283c755edf7d4ae47b2c37697215ec`; rama M05a `96111acd2ff02b38f10305039a432b26ceecd044`.

| ID | Disparador | Propuesta visual sin cambiar contrato | Estado / dueño |
|---|---|---|---|
| C1 | Servicio despublicado mientras se consulta su ficha | Ante nueva respuesta 404, sustituir contenido antiguo por la misma ausencia amigable que un slug inexistente: «Este servicio no está disponible» y «Volver a servicios» si la ruta sigue activa. No revelar «lo retiraron» ni ofrecer acciones administrativas al visitante. | **PROPUESTO**; API pública 404 leída en SPEC/código |
| C2 | Imagen falla al cargar | Mantener la geometría de la tarjeta/ficha mediante bloque informativo sin icono roto; nombre y descripción nunca dependen de imagen; alt al existir imagen real. | **PROPUESTO**; `NoPhoto` es referencia `shared` |
| C3 | CORE retira medio vinculado | Bloque de ausencia en lugar de imagen; editor anuncia que hay que volver a seleccionarla y poner alt. Sin prometer que binario anterior esté conservado. | **PROPUESTO** en pantalla; garantía histórica **PENDIENTE JP/líder** antes de M05b |
| C4 | Dos sesiones editan mismo servicio | Tras 409, mantener campos tal como están en la vista actual, alerta «Otra persona cambió este servicio», advertencia antes de recarga y acción explícita «Ver versión actual». Ni último guardado gana a ciegas ni merge ficticio. | **PROPUESTO**; resolver semántica exacta de concurrencia con API actual **PENDIENTE técnico** |
| C5 | Nombre, slug, precio o descripción inválidos | `Field.error` junto al campo, `aria-invalid` y resumen `Alert` cuando sea global; no limpiar lo escrito; guiar a corrección; validaciones respaldadas por `ServiceRules.Validate`. | **PROPUESTO** con condiciones reales de rama |
| C6 | Slug repetido | Mensaje contextual «Esa dirección ya se utiliza. Escribe otra.»; no cambiar automáticamente el slug al cambiar nombre. | **PROPUESTO**; 409 según SPEC |
| C7 | M05a desactivado | No dibujar aviso dentro de un enlace roto: composición retira ruta y contribuciones completas; acceso con URL antigua debe pasar por ruta general segura sin crear error específico M05a. | **DECIDIDO** por SPEC/PROTOCOLO; implementación/verificación futura con host |
| C8 | M05a activo sin publicados | `/servicios` abre su vacío explícito; portada no invita a listado vacío; admin conserva entrada y muestra también borradores/archivados. | **PROPUESTO** para composición; orden de portada **PENDIENTE de JP** |
| C9 | Capacidades aún cargando | No renderizar enlaces optimistas ni concluir «sin contenido» prematuramente; utilizar `homeState` y componente de estado de plataforma. | **PROPUESTO**, conforme a código `surfaceRegistry` |
| C10 | Error al leer capacidades | Mensaje y reintento de plataforma; no interpretar error como desactivación ni inventar home M05a. | **PROPUESTO**, sujeto a armazón existente |
| C11 | Teclado móvil tapa guardado del editor | Guardado en flujo vertical, zona inferior desplazable y reserva para safe area; sin CTA `position:fixed` que requiera detectar teclado con JS. | **PROPUESTO**, prueba futura en dispositivos reales |
| C12 | Modal de archivo o retirada | Reutilizar `ConfirmDialog`/`useFocusTrap`, consecuencias concretas; no sustituirlo por `<dialog>` nuevo ni depender de animación para ejecutar acción. | **PROPUESTO**, compatible con `shared` |

## Escaladas que NO resuelve diseño

**E1 · Producto:** posición/orden exactos de invitación «Servicios» en la portada, especialmente con CORE, CMS, Catálogo y CRM activos; no crear una navegación pública global sin aprobación.

**E2 · Producto:** tema público del negocio para verificar ambas apariencias reales; marca SILLAR restringida al panel.

**E3 · Producto:** opciones de servicio y restauración desde Archivado continúan excluidas. El diseño no las introduce.

**E4 · Arquitectura / producto:** política de supervivencia del binario fotográfico en snapshots de M05b queda en `CONTRATO-FOTOGRAFIA.md` / `ESCALADAS.md`; el fallback de M05a no decide política de almacenamiento.

**E5 · Técnico:** confirmar mecanismo real de concurrencia/versión y qué cuerpo de 409 permite un diálogo de revisión; el diseño no añade campos a DTO ni cambia contrato.

**E6 · Técnico:** costura con host, rutas, navegación y pruebas efectivas de montaje/desmontaje están pendientes según `BITACORA-M05a.md`. Las maqueta no prueban el producto.

## Pruebas negativas exigidas en futura revisión

Provocar cada conflicto contra su barrera y también el caso que debe pasar; alternar `no-preference → reduce → no-preference`; provocar error de imagen independiente de error de consulta; provocar despublicación en navegación en curso; abrir teclado en editor a 390 CSS px; desactivar M05a con todas las combinaciones de módulos para comprobar ausencia completa de rutas/enlaces/huecos. Esta entrega no usa infraestructura QA.
