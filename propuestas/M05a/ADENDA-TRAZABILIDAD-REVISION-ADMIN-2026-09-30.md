# M05a Servicios — Paso 3.5 · Adenda de trazabilidad y revisión administrativa

**VEREDICTO: S3, S4 y S5-admin quedan REVISABLES como propuesta de diseño con la identidad SILLAR y los tokens/componentes reales verificados. S1, S2 y S5-public permanecen PENDIENTES exclusivamente de la recepción y validación del tema real de una instalación cliente. El paso 3.5 completo continúa PENDIENTE DE PUBLICACIÓN, REVISIÓN DE CHAT 2 Y APROBACIÓN.**

- **Creación:** 30 de septiembre de 2026 — America/Lima.
- **Última modificación:** 30 de septiembre de 2026 — America/Lima.
- **Última verificación:** 30 de septiembre de 2026 — America/Lima.
- **Producto `JP-777/SILLAR/main` usado para armazón, `shared/ui`, tokens y marca:** `e839989432283c755edf7d4ae47b2c37697215ec`.
- **M05a actualizado documentalmente:** `e657b7874fe7ed5def3125fdc2d12096a88728cc`.
- **Base histórica de la primera propuesta M05a:** `96111acd2ff02b38f10305039a432b26ceecd044`.
- **Adenda previa conservada sin cambios:** `ADENDA-DECISIONES-JP-2026-09-29.md`.
- **Destino previsto:** `JP-777/SILLAR-DESIGN`, rama `diseno/m05a-paso-3-5`, directorio `propuestas/M05a/`.

Esta adenda no modifica ninguno de los seis archivos originales ni la adenda del 29/09. Se lee después de ellos y prevalece únicamente en los puntos de trazabilidad y revisión administrativa aquí descritos.

---

## 1 · Trazabilidad de `e657b78`

Se abrió el commit completo `e657b7874fe7ed5def3125fdc2d12096a88728cc` y su diff.

**Resultado observado:** el commit `docs(services): elimina conflicto duplicado` modifica únicamente `docs/modules/services/SPEC.md`, con **0 adiciones y 1 eliminación**. No contiene cambios en backend ni frontend.

La única eliminación corresponde a una fila documental redundante de la tabla de errores/conflictos. Por tanto:

- no cambia el contrato de API utilizado para el diseño;
- no cambia `ServiceShowcaseService` ni sus guardas;
- no cambia el armazón administrativo;
- no cambia `shared/ui`;
- no cambia `tokens.css`;
- no cambia las decisiones visuales ya registradas en la adenda del 29/09;
- no vuelve vigente el supuesto conflicto de edición simultánea.

**Conclusión de trazabilidad:** la revisión administrativa sigue apoyándose visualmente en `main@e839989` y en el contrato M05a ya verificado; `e657b78` se añade como última referencia documental de M05a.

---

## 2 · Regla vigente sobre conflictos

La revisión actual **excluye completamente** cualquier simulación, mensaje, botón o estado que afirme detectar que «otra persona editó este servicio», «otra sesión cambió la versión» o equivalente.

El backend observado no recibe una versión de edición en `SaveServiceRequest` ni compara una versión anterior al ejecutar `UpdateAsync`. Por ello el diseño no puede presentar protección de concurrencia optimista como comportamiento disponible.

### Conflictos/rechazos que sí están respaldados por contrato real

1. **Slug duplicado** al crear o editar: conflicto 409 con mensaje de dirección ya utilizada.
2. **Transición editorial inválida**: conflicto 409; no se permite una transición fuera de la tabla de estados admitidos.
3. **Reordenación incompatible**: conflicto cuando el conjunto de IDs no contiene cada servicio exactamente una vez.
4. **Publicación o guardado con datos inválidos**: validación de nombre, descripción, precio y medio/texto alternativo según el contrato vigente.
5. **Medio inexistente o inactivo** al guardar: rechazo con mensaje específico.
6. **Servicio público inexistente, archivado o despublicado**: ausencia pública indistinguible; la ficha no promete detección automática en tiempo real.
7. **Fallo de red/servidor recuperable**: error de carga con acción de reintento cuando corresponda; no se convierte en conflicto de edición.

La edición concurrente sigue siendo un riesgo técnico posible, pero **no forma parte del comportamiento diseñado** hasta que arquitectura autorice una barrera real.

---

## 3 · S3 — Listado administrativo de Servicios

### 3.1 Estado revisable

**REVISABLE YA.** Usa identidad SILLAR, no tema cliente.

La superficie debe construirse conceptualmente con los patrones ya existentes:

- `PageContainer` para título, descripción y acción principal;
- `Button` para «Crear servicio» y acciones explícitas;
- `Table` para escritorio y su comportamiento de carga/vacío;
- `Badge` para `Borrador`, `Publicado` y `Archivado`, siempre acompañado por texto;
- `EmptyState` para instalación sin entradas;
- `Spinner` con etiqueta específica cuando exista espera real;
- `Alert` / `FailureAlert` para error recuperable;
- `ConfirmDialog` únicamente para una acción destructiva/irreversible que el contrato realmente exponga, como archivar si la implementación final exige confirmación;
- `Toasts` para confirmaciones breves posteriores a una escritura, sin bloquear el flujo.

### 3.2 Jerarquía propuesta

**Escritorio:**

1. Encabezado «Servicios».
2. Descripción «Organiza y publica la vitrina de servicios».
3. Acción primaria «Crear servicio».
4. Tabla/lista de entradas con: Servicio · Estado · Precio visible · Orden · Acciones.
5. Acciones de fila secundarias; «Editar» es la acción de entrada más frecuente.

**Móvil:**

- se mantiene el `AdminShell` estrecho ya resuelto por plataforma;
- el contenido se presenta como lista apilada si una tabla obliga a desplazamiento horizontal para las acciones esenciales;
- estado, nombre y acción «Editar» permanecen visibles sin desplazamiento lateral;
- precio y orden pueden pasar a metadatos de segunda línea;
- objetivos táctiles de las acciones principales respetan el patrón estrecho de 44 px ya utilizado por el armazón.

No se propone un componente de drag-and-drop. El contrato expone reordenación, pero **arrastrar no es requisito** y no existe hoy un patrón compartido aprobado para ello. Una interfaz de reordenación debe poder utilizarse con teclado y no depender de precisión de puntero.

### 3.3 Estados

**Vacío:** `EmptyState` con «Todavía no hay servicios» y una única acción «Crear servicio».

**Con datos:** entradas ordenadas editorialmente; estado textual; precio `nulo → Consultar precio`, `0 → Gratuito`, valor positivo → importe formateado por la implementación.

**Cargando:** conservar el área de resultados y utilizar el patrón de `Table`/`Spinner`; no inventar skeleton compartido si no existe en `shared/ui`.

**Error:** mensaje específico de carga fallida y reintento; sin SQL, stack trace ni identificadores técnicos.

**Conflicto real:** solo cuando una operación realizada desde esta superficie recibe un conflicto respaldado. Para reordenación: «La lista cambió y el orden enviado ya no corresponde a todos los servicios. Actualiza la lista antes de volver a ordenar.» Esto describe el contrato existente sin afirmar quién produjo el cambio ni que exista versionado de edición.

**Expresamente retirado:** «Otra sesión modificó el estado o el orden» como detector automático.

---

## 4 · S4 — Editor administrativo

### 4.1 Estado revisable

**REVISABLE YA.** El panel conserva los tokens e identidad SILLAR.

Patrones/componentes existentes que gobiernan el diseño:

- `PageContainer`;
- `Field` para etiqueta, ayuda, `aria-describedby` y error;
- `Input` para nombre, slug, precio, unidad y texto alternativo cuando corresponda;
- controles HTML equivalentes para texto multilínea, manteniendo el mismo contrato de `Field`;
- `Button` para guardar/publicar/retirar;
- `Alert` para errores generales recuperables;
- selector/flujo de medios de CORE: referencia al patrón real, sin diseñar un gestor de archivos paralelo;
- `ConfirmDialog` para archivar si se confirma la necesidad de confirmación;
- `Toasts` para guardado correcto.

### 4.2 Organización

Orden del formulario:

1. Identidad editorial: nombre y dirección pública.
2. Contenido: descripción breve y completa.
3. Presentación: precio y unidad descriptiva.
4. Medio opcional y texto alternativo.
5. Estado editorial y acciones permitidas.

No se introducen opciones/presentaciones de servicio porque continúan fuera del contrato vigente.

### 4.3 Errores reales

Los errores se muestran junto al control correspondiente y se anuncian mediante el patrón `Field` cuando aplican:

- nombre obligatorio;
- al menos una descripción;
- precio negativo;
- slug inválido;
- slug duplicado;
- imagen seleccionada inexistente/inactiva;
- imagen sin texto alternativo.

Una publicación incompleta o transición no permitida se explica en contexto, nombrando qué impide la acción y qué debe hacer la persona.

### 4.4 Conflicto real y retirada de concurrencia ficticia

**No existe estado «edición simultánea» en la revisión vigente.**

Si guardar devuelve slug duplicado, el formulario conserva los datos escritos y focaliza/explica la dirección pública en conflicto. No aparece «Ver versión actual», «Recargar cambios de otra persona» ni una comparación entre versiones porque el backend no proporciona esa información.

Si una transición editorial devuelve 409, la pantalla conserva el formulario y explica la transición permitida; no atribuye la causa a otra sesión.

### 4.5 Móvil y teclado

- una sola columna;
- ningún footer de acciones `position: fixed` que pueda quedar encima del último campo al abrirse el teclado;
- acciones en el flujo del documento;
- al producirse un error de envío, el foco se dirige al resumen/control inválido según el patrón que se implemente, sin perder el contenido escrito;
- el foco visible es el global de plataforma;
- cualquier diálogo conserva `useFocusTrap`, Escape y retorno al invocador mediante los patrones compartidos.

---

## 5 · S5-admin — contribución a navegación administrativa

### 5.1 Estado revisable

**REVISABLE YA.** Es una contribución al armazón SILLAR.

Cuando M05a esté activo y el rol alcance la administración del módulo:

- aparece el grupo/entrada administrativa de Servicios siguiendo `ModuleNavigation`;
- conduce a `/admin/servicios`;
- utiliza el armazón existente en escritorio;
- en ancho estrecho entra dentro del `Drawer` de navegación ya implementado por plataforma;
- no se crea una barra, sidebar ni drawer propio de M05a.

Cuando el módulo esté desactivado:

- desaparece la entrada;
- desaparece la ruta;
- no queda grupo vacío, placeholder ni mensaje «módulo no instalado».

### 5.2 Estados de composición

**Capacidad activa:** entrada disponible según rol.

**Capacidad inactiva:** ausencia total.

**Capacidades cargando:** no se reserva un hueco provisional específico para M05a.

**Fallo de capacidades:** corresponde al tratamiento transversal del armazón; M05a no inventa una navegación degradada propia.

### 5.3 Relación con S5-public

La contribución administrativa queda validable de forma independiente. La decisión de JP de colocar la invitación pública a Servicios **después de Catálogo y antes de CRM**, solo si existen servicios publicados, pertenece a S5-public y permanece estructuralmente decidida pero visualmente no validada hasta disponer del tema cliente.

---

## 6 · Tokens SILLAR usados en la revisión administrativa

La revisión no introduce colores, sombras, radios, espaciados ni movimiento nuevos. Usa únicamente los roles ya presentes en `frontend/src/shared/styles/tokens.css` del producto verificado.

Roles aplicables:

- superficies: `--bg`, `--bg-raised`, `--bg-sunken`;
- texto: `--text`, `--text-muted`, `--text-subtle`;
- límites/controles: `--border`, `--border-strong`;
- acciones: `--primary`, `--primary-hover`, `--on-primary`, `--link`;
- selección: `--selected`, `--selected-bg`;
- semánticos: `--success`, `--success-bg`, `--warning`, `--warning-bg`, `--danger`, `--danger-bg`, `--on-danger`;
- controles: `--alto-control-sm`, `--alto-control-md`, `--alto-control-lg`;
- geometría: `--r-sm`, `--r-md`, `--r-lg`;
- espaciado: `--s1` a `--s8`;
- movimiento: `--duracion-control`, `--duracion-mensaje`, `--duracion-superficie`, sus salidas y `--duracion-cambio-reducido`;
- sombras: `--shadow`, `--shadow-lg`.

El modo oscuro ya redefine esos roles. Ninguna maqueta administrativa necesita una paleta paralela.

La reducción de movimiento permanece gobernada por la regla global de `base.css`; esta adenda no añade excepciones.

---

## 7 · Resultado de la revisión vigente

| Superficie | Estado de revisión 3.5 | Motivo |
|---|---|---|
| S1 · Listado público | **BLOQUEADA SOLO EN APARIENCIA** | Estructura/estados definidos; faltan tokens/tema real del cliente para validar visual y contraste. |
| S2 · Ficha pública | **BLOQUEADA SOLO EN APARIENCIA** | Flujo y conflictos contractuales definidos; falta tema real cliente. |
| S3 · Listado admin | **REVISABLE YA** | Usa identidad, tokens y componentes SILLAR reales; concurrencia ficticia retirada. |
| S4 · Editor admin | **REVISABLE YA** | Campos/guardas respaldados por contrato; identidad SILLAR disponible. |
| S5-admin · Navegación | **REVISABLE YA** | Se integra al armazón administrativo existente y desaparece con la capacidad. |
| S5-public · Invitación de portada | **DECISIÓN ESTRUCTURAL TOMADA / APARIENCIA BLOQUEADA** | Orden decidido por JP; falta tema cliente para validación visual final. |

**Parte revisable ahora:** todo el diseño administrativo S3/S4/S5-admin, además de la estructura y comportamiento no visual de S1/S2/S5-public.

**Parte bloqueada exclusivamente por tema cliente:** validación de identidad visual, contraste real, tipografía/activos y capturas finales de S1/S2/S5-public en los temas efectivamente soportados por una instalación cliente.

---

## 8 · Material aún solicitado para cerrar lo público

Antes de considerar validada la apariencia pública deben entregarse, de una misma instalación cliente:

1. CSS o exportación de las variables de tema realmente cargadas;
2. variante clara y oscura únicamente si ambas existen realmente;
3. tipografía/fuentes configuradas;
4. activos de marca que se permitan usar en la revisión;
5. de ser posible, captura o referencia autorizada de portada y una ficha pública.

No se requiere acceso, credenciales ni secretos.

Hasta recibirlo, cualquier representación pública de los originales sigue siendo **estructura provisional**, no validación de marca.

---

## 9 · Estado de publicación y aprobación

- Los seis archivos históricos continúan intactos.
- La adenda del 29/09 continúa intacta.
- Este es el único archivo de diseño nuevo de contenido en esta revisión.
- El manifiesto SHA-256 se genera aparte y no modifica los artefactos anteriores.
- No se modificó `JP-777/SILLAR`.
- No se ejecutó QA reservado para B.
- No se declara publicación remota ni aprobación del paso 3.5 sin SHA de `origin` y veredicto posterior de Chat 2/líder.
