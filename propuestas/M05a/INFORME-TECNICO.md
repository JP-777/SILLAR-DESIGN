# M05a Servicios — Vitrina | Paso 3.5 · Informe técnico

**VEREDICTO: PROPUESTO · REQUIERE REVISIÓN DE CHAT 2 Y ELEVACIÓN AL LÍDER TÉCNICO.** Esta entrega es referencia visual, nunca código para incorporar al producto. La adopción y las decisiones de identidad o contenido pertenecen a sus autoridades.

- **Creación:** 28 de septiembre de 2026 · America/Lima
- **Última modificación:** 28 de septiembre de 2026 · America/Lima
- **Última verificación de fuentes:** 28 de septiembre de 2026 · America/Lima
- **Producto `main` efectivamente leído:** `e839989432283c755edf7d4ae47b2c37697215ec`
- **Producto `m05a-vitrina-dev` efectivamente leído:** `96111acd2ff02b38f10305039a432b26ceecd044`
- **Repositorio de diseño `main` verificado:** `7b2b728a299d775f4eb0b045e8dd19bcb1e07e2a`
- **SPEC de M05a:** solo en `m05a-vitrina-dev` en los refs verificados; blob `fe42fe0ed1a30bb37fddfde4db7a412be2ecc0fd`.
- **Bitácora M05a:** rama `m05a-vitrina-dev`; blob `0bd652d50128851d5a22e304776bd044f32427bd`.
- **Tokens `main`:** blob `a0db5e937a9cca20a1d081950ed5b9f622d5c12d`.
- **Marca `main`:** blob `331822f1fbb49fa70c737e4f1eb889c3f5ea0dce`.
- **Protocolo de diseño `main`:** blob `7fbc476f88f0bf646141803d04c36e8d408d4a2a`.

## 1. Diagnóstico y límites de autoridad

**LEÍDO EN DOCUMENTACIÓN:** la SPEC ratifica contenido editorial **propio**, CORE como única dependencia dura, sin vínculo a M01, sin órdenes/cobros/reservas/inventario, sin opciones hasta ratificación y sin garantía de conservación de imágenes tras baja de medios en CORE. La bitácora señala pasos DATOS y API implementados, pero la costura con host y las pruebas reales de montaje/desmontaje siguen pendientes. No se declaran superadas por este diseño.

**LEÍDO EN CÓDIGO:** el API de la rama devuelve `ServicePublicResponse` con nombre, slug, descripciones, precio nullable, unidad nullable y URL/alt de imagen opcionales; `ServiceAdminResponse` agrega estado editorial, orden e `ImageId`. Las operaciones disponibles son listado y detalle público; CRUD editorial, publicación, retirada, archivo y reordenación administrativa. No existe DTO de opciones. La API administra desde rol `editor`. La lógica rechaza publicar contenido inválido y transiciones editoriales indebidas.

**DECIDIDO EN MATERIAL DE DISEÑO:** cinco superficies del §9, cuatro estados base por superficie cuando aplican y conflicto separado cuando tenga sentido, dos temas como variables de rol y dos tamaños representativos (390 y 1280 CSS px). Los números son tamaños de **referencia**, no nuevos breakpoints de producto. Los nombres ilustrativos «Anillado espiral» e «Impresión láser» proceden de los ejemplos de la SPEC y no son seed ni contenido aprobado para una instalación.

**PENDIENTE:** fuente, paleta y composición específicas de la **marca del cliente** para las dos pantallas públicas. El prototipo aislado usa una instantánea exacta de roles de SILLAR solamente para demostrar estructura/legibilidad; eso **no aprueba** reutilizar identidad SILLAR en una web pública. Todo contenido definitivo de esa web lo decide quien corresponda a través del líder técnico hacia JP.

## 2. Patrón visual común

- **Público:** identidad del negocio configurado (nunca mostrar «SILLAR»), título del destino, descripción breve y tarjetas de servicios en orden editorial; **no** imitar checkout ni selector de opciones que todavía no existe. Móvil en una columna, sin media que tape la descripción o el precio; escritorio en cuadrícula proporcional, sin filtros inexistentes.
- **Administración:** tema SILLAR y armazón real H-29: topbar con negocio de contexto, escritorio con navegación lateral y móvil con botón que abre el `Drawer` **existente**, no diálogo nuevo. Proponer una sola entrada «Servicios» dentro de un grupo «Servicios», filtrada por módulo y rol; etiqueta/grupo no deben colocarse globalmente sin la costura técnica pertinente.
- **Medios:** cuando el medio no existe, es nulo o falla, usar un bloque informativo del tamaño de la imagen sin ícono roto. `NoPhoto` de `shared/ui` constituye referencia útil para el patrón, pero debe validarse su microcopy/contexto para servicios; **`Gallery.tsx` es rejilla administrativa de archivos de CORE, no galería de la ficha del servicio**.
- **Precio:** `null` «Consultar precio», `0` «Gratuito», positivo como importe formateado por la convención monetaria existente. No se inventan tarifas, descuentos ni duración. **«Consultar precio» no dispara una solicitud de orden**; si se aprueba una ruta hacia contacto existente, debe verificarse antes de incluir enlace.
- **Estado editorial:** Borrador / Publicado / Archivado; no se dibuja «Restaurar archivado». Estado siempre incluye texto y no solo color. Un módulo activo sin publicaciones permite la ruta `/servicios` con su EmptyState, pero no una invitación falsa en la portada.
- **Movimiento:** solo microfeedback CSS nativo dentro de la escala de tokens ya existente (`--duracion-control`, `--duracion-mensaje`, `--duracion-superficie`); nunca retrasa navegación/guardado ni es portador único de estado; `prefers-reduced-motion` en caliente usa fundido corto global. Ningún paquete nuevo ni spinner si el trabajo real termina antes del umbral de la plataforma.

## 3. Las cinco superficies

### S1 — Listado público `/servicios`

**Vacío:** «Todavía no hay servicios publicados» y explicación no comercial, sin cuadrícula de tarjetas vacías ni datos ficticios. **Datos:** tarjetas de nombre, breve, precio semántico, unidad si existe y media opcional; toda tarjeta enlaza a la ficha. **Cargando:** estructura estable, mostrar indicador específico solo si se cumple umbral de espera; nunca marcar «sin servicios» antes de recibir respuesta. **Error:** alerta que explica imposibilidad de cargar y botón «Volver a intentar». **Conflicto:** una tarjeta podía existir en listado pero su servicio acaba de despublicarse; el clic abre el 404 amable de S2 sin revelar estado interno. **Móvil:** 1 columna; **escritorio:** rejilla automática que no recorta nombres ni textos.

### S2 — Ficha pública `/servicios/:slug`

**Vacío:** no corresponde a una entidad válida: si no hay entidad publicable, usar 404 público amable. **Datos:** nombre, medio adaptable opcional, descripción completa si existe (o breve), precio y unidad si existen, enlace para volver. Sin opciones no ratificadas y sin acción de compra. **Cargando:** rótulo «Cargando el servicio» solo tras umbral. **Error:** ante red caída, separar «No pudimos cargar esta ficha» + «Volver a intentar» de 404 de ausencia pública. **Conflicto de despublicación:** tratar como 404 indistinguible de slug inexistente; «Este servicio no está disponible» + volver a `/servicios` **solo si M05a está activo**. **Imagen retirada/fallida:** reemplazo neutro; nunca prometer archivo histórico.

### S3 — Listado administrativo `/admin/servicios`

**Vacío:** `EmptyState` «Todavía no hay servicios» con acción única «Crear servicio». **Datos:** escritorio `Table` con nombre, estado, precio, orden y acciones; móvil filas apiladas con 44 CSS px por destino, acción principal «Editar» y secundarias agrupadas si existen. **Cargando:** estructura estable y etiqueta específica, de acuerdo con `Table`/`Spinner` existentes. **Error:** `FailureAlert`/`Alert` con reintento recuperable. **Conflicto:** acción contra estado anterior o reordenación simultánea: «La lista cambió mientras la revisabas» y «Actualizar lista»; no sobrescribir. **Archivo:** etiqueta «Archivado» distinguible sin color; no se dibuja restauración.

### S4 — Editor administrativo `/admin/servicios/nuevo` y `/admin/servicios/:id`

**Vacío:** alta como borrador, campos sin datos comerciales precargados. **Datos:** `Field` + `Input` para nombre y slug; campos de texto largo deben reutilizar estilo/campo compartido verificado o marcar diferencia; precio permite blanco (consultar) y cero (gratuito), unidad opcional, medio CORE opcional con alt obligatorio cuando hay imagen. **Cargando:** operaciones bloqueadas funcionalmente y etiqueta «Cargando el servicio»/«Guardando borrador»; no ocultar texto del usuario. **Error:** errores específicos junto al campo; aviso recuperable para red; `Field.error` hace anuncio accesible. **Conflicto:** edición desde dos sesiones → 409: texto explícito «Otra persona cambió este servicio», acción «Ver versión actual»; no conservar cambios automáticamente ni afirmar que el servidor ofrece merge; **antes de recargar, advertir que se perderán los cambios escritos en este formulario**. **Baja de medio:** mostrar «La imagen ya no está disponible» y permitir seleccionar de nuevo sin suponer que el binario antiguo vive.

### S5 — Aportes a navegación y portada

No es una pantalla aislada: son estados de **composición** del armazón. **Activo y con publicaciones:** entrada administrativa cuando rol ≥ editor y propuesta de invitación pública «Servicios» condicionada por contenido real. **Activo sin publicaciones:** entrada administrativa presente y `/servicios` válido pero vacío; ocultar invitación pública engañosa. **Desactivado:** sin rutas, ni enlaces, ni contenedores o huecos. **Cargando capacidades:** no anunciar falsamente una ruta ni mostrar «sitio vacío» mientras se espera una contribución; aprovechar `homeState`/registro existente. **Fallo de capacidades:** estado de plataforma recuperable, no tratar error como «no instalado»; el enlace no debe apuntar a ruta no confirmada. **Conflicto:** enlace capturado o navegación antigua al desactivar módulo → ruta general segura, no pantalla rota M05a.

**PENDIENTE DE JP:** ubicación exacta en el orden de `HOME_SECTIONS` y si existe una nueva navegación pública persistente. `PublicSite.tsx` ofrece identidad de negocio y aportes de portada, **no una barra pública global de módulos**. Esta propuesta usa invitación condicionada análoga al catálogo, sin apropiarse de la decisión de orden de plataforma.

## 4. Armazón y accesibilidad

- **390 CSS px:** contenido desde el primer viewport, sin que el menú admin empuje el contenido; H-29 usa Drawer existente `side="left"`. Cabecera pública no imita el armazón SILLAR.
- **1280 CSS px:** región de lectura máxima y blancos razonables; no llenar todo el ancho con líneas de texto; admin usa `PageContainer`, tablero/tabla y sidebar existente.
- **Zonas seguras:** no pegar botones ni avisos fijos al borde del dispositivo; respetar `env(safe-area-inset-bottom)` si se decide una acción pegajosa. **No** se propone inicialmente un pie de edición fijo: que el teclado móvil reduzca la altura no debe cubrir campos o impedir llegar al guardado.
- **Teclado móvil:** editor con flujo vertical, etiquetas encima y guardado en el flujo del documento; ningún panel anidado con scroll propio salvo el Drawer existente cuando esté abierto; evitar autofoco que abra teclado al cargar la página.
- **Anchura:** truncar solo identidad secundaria que pueda consultarse completa, nunca estado principal, precio o descripción; para texto de usuario utilizar `overflow-wrap:anywhere` donde proceda; listas/tables que no entren pasan a tarjetas en lugar de desplazamiento horizontal del documento.
- **Táctil y teclado:** objetivo del prototipo 44×44 CSS px, foco visible existente; acciones destructivas mediante `ConfirmDialog` existente y textos que nombren el efecto, sin botón «Aceptar». En la pantalla administrativa, archivado es destructivo en el sentido operativo y requiere confirmación explícita antes de actuar; esta propuesta no cambia los endpoints.
- **Lectores de pantalla:** una sola región de carga por operación, `aria-current="page"` para ruta activa, título de página distintivo y `Field`/`Alert` compartidos para errores; estado semántico legible sin depender de movimiento o color.
- **Temas:** la maqueta usa roles exactos de `tokens.css`; no se introducen literales en reglas de componente, sombras o estados. Oscuro/claro se prueban como pares; **el tema público del cliente aún necesita su configuración real antes de aprobación**.

## 5. Entrega a Codex C, después de las aprobaciones

**Solo como criterios de implementación futura:** reutilizar componentes existentes (inventario adjunto), componer rutas únicamente si M05a está activo y permisos adecuados, no añadir un header global público sin decisión de JP, no importar interfaz de M01, no inventar galerías ni opciones, no acoplar M05a a M05b y preservar los mensajes y estados del §9. La API/DTO y los errores 400/404/409 pertenecen al contrato de la rama; esta referencia visual no los edita.

**Estado:** propuesta local producida para revisión; la cuenta conectada tiene `pull:true`, `push:false` en `JP-777/SILLAR-DESIGN`. No publicada. El operador autorizado debe publicar bajo `diseno/m05a-paso-3-5`, devolver SHA remoto y recibir veredicto de Chat 2 antes de elevar a JP.
