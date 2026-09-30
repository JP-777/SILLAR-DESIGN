# M05a Servicios — Paso 3.5 · Adenda de decisiones de JP y corrección de concurrencia

**VEREDICTO: PROPUESTA ACTUALIZADA MEDIANTE ADENDA; PENDIENTE DE REVISIÓN DE CHAT 2, PUBLICACIÓN REMOTA Y APROBACIÓN.** La ubicación de la invitación pública está **DECIDIDA** por JP. La apariencia pública continúa **PENDIENTE** hasta revisarse con el tema real de una instalación cliente. El supuesto conflicto de edición simultánea queda **RETIRADO del diseño vigente**, por decisión del colíder y por no estar detectado en el backend revisado. No se ha modificado ninguno de los seis archivos originales.

- **Creación:** 29 de septiembre de 2026, 14:38 (America/Lima).
- **Última modificación:** 29 de septiembre de 2026, 14:38 (America/Lima).
- **Última verificación:** 29 de septiembre de 2026, 14:38 (America/Lima).
- **Fuente de decisiones:** JP, comunicadas por Chat 2; retirada del conflicto de simultaneidad instruida por el colíder.
- **Producto `JP-777/SILLAR/main` efectivamente verificado:** `e839989432283c755edf7d4ae47b2c37697215ec`.
- **Producto `JP-777/SILLAR/m05a-vitrina-dev` efectivamente verificado:** `96111acd2ff02b38f10305039a432b26ceecd044`.
- **Diseño `JP-777/SILLAR-DESIGN/main` de referencia:** `7b2b728a299d775f4eb0b045e8dd19bcb1e07e2a` (no es SHA de publicación de esta adenda).
- **Fuentes comprobadas del producto:** `frontend/src/platform/homeSections.ts` (blob `0ed1300d829a6edf2b039b32e9c7e48c42fbd8d7`), `frontend/src/platform/PublicSite.tsx`, `docs/MARCA.md`, `frontend/src/shared/styles/tokens.css` (blob `a0db5e937a9cca20a1d081950ed5b9f622d5c12d`); en rama M05a: `docs/modules/services/SPEC.md` (blob `fe42fe0ed1a30bb37fddfde4db7a412be2ecc0fd`), `backend/Sillar.Modules.Services/Dtos/ServiceDtos.cs` (blob `e2cc9ce76448e729f476592df8997d7d211`), `backend/Sillar.Modules.Services/Services/ServiceShowcaseService.cs` (blob `f4f4abbcd450490b9e544e14b34d38c747310d94`).
- **Destino de publicación propuesto:** `JP-777/SILLAR-DESIGN`, rama `diseno/m05a-paso-3-5`, directorio `propuestas/M05a/`.
- **Regla de precedencia:** leer esta adenda **junto a**, no en lugar de, los seis archivos originales; si difieren en los tres asuntos de aquí, prevalece esta adenda. El prototipo original queda como artefacto histórico para esos estados, no como versión pública aprobada.

## 1. DECIDIDO por JP — invitación de Servicios en la portada

**Ubicación exacta:** después de **Catálogo** y antes de **CRM**. No desplaza ni redefine otros aportes existentes. La composición de referencia que hoy se lee en `homeSections.ts` es `[cmsHome, catalogHome, crmHome]`; por tanto, la posición **propuesta para la integración futura**, sin modificar código ahora, es `[cmsHome, catalogHome, servicesHome, crmHome]`.

**Condición obligatoria de presencia:** mostrar la invitación pública a «Servicios» **si y solo si** M05a está activo **y** se ha confirmado que tiene al menos un servicio publicado. No basta que el módulo esté instalado, que existan borradores/archivados o que haya una respuesta de capacidades incompleta.

| Situación de composición | Resultado propuesto |
|---|---|
| M05a activo; uno o más servicios publicados confirmados | Invitación «Servicios» después de Catálogo y antes de CRM, **entre los aportes presentes**; enlace a `/servicios`. |
| M05a activo; cero publicados confirmados | Sin invitación pública en portada. `/servicios` sigue existiendo y muestra su estado vacío si se entra directamente; el menú administrativo autorizado sigue existiendo. |
| M05a inactivo/desinstalado | Sin invitación, entrada administrativa, rutas M05a, contenedor ni hueco residual. |
| Capacidades o cantidad de publicados todavía cargando | No presentar una invitación sin confirmar ni afirmar precipitadamente que el sitio está vacío; respetar la coordinación de `homeState` ya existente. |
| Fallo al comprobar publicados o capacidades | No presentar como verificada una condición desconocida. El tratamiento del error pertenece a la superficie que lo puede explicar y recuperar; no convertir automáticamente error en «módulo vacío» o «módulo ausente». |
| Servicio despublicado después de pintar la invitación | Si se abre una ficha despublicada, la API responde como una ficha inexistente; usar el estado público amable aprobado. Al refrescar el estado de portada, quitar la invitación si ya no quedan publicaciones. |

**No se propone una nueva barra pública persistente** ni una entrada global del encabezado público: la decisión recibida fija una **invitación de portada**, no un sistema de navegación adicional. La contribución debe convivir con CMS, Catálogo y CRM sin que el armazón tenga lógica comercial de M05a incrustada.

**Pruebas documentales para la revisión posterior:** portada con CORE/CMS/Catálogo/M05a/CRM; con CORE y M05a solamente; con M05a activo vacío; con M05a desactivado; con capacidades cargando y fallo de consulta. Verificar secuencia, ausencia de enlaces o huecos residuales y no confundir el estado de los aportes con la activación del módulo.

## 2. DECIDIDO por JP / PENDIENTE de material — identidad real del cliente en las pantallas públicas

La web pública **no utiliza** la identidad visual del panel SILLAR. La revisión definitiva de `S1 Listado público`, `S2 Ficha pública` y `S5 Contribución de portada` se efectuará con el **tema real de una instalación cliente**. El panel administrativo (`S3`, `S4` y la parte administrativa de `S5`) conserva la identidad de SILLAR fijada en `MARCA.md` y los tokens existentes del panel.

Los seis archivos originales se mantienen inalterados, pero **su maqueta pública actual no acredita la apariencia del cliente**: usa una instantánea de roles de SILLAR exclusivamente como soporte estructural. Cualquier captura o modo claro/oscuro de esas superficies debe rotularse «estructura provisional — tema cliente no aplicado» y **no sirve como evidencia de validación de marca ni contraste público**.

**SOLICITUD A CHAT 2, VÍA JP — aportar antes de validar:**

1. El archivo CSS real de tema público de **una instalación cliente concreta**, o la exportación de variables CSS de rol efectivamente cargadas por esa instalación; incluir variantes clara y oscura **si están realmente habilitadas**.
2. La tipografía/fuentes efectivamente configuradas y, si forman parte de la web pública, los activos de marca permitidos para revisión (por ejemplo, logotipo o imagen de cabecera). No se piden credenciales, secretos ni acceso a la instalación.
3. Una referencia verificable de la web pública real de esa misma instalación (capturas de portada y una ficha, o un entorno accesible expresamente autorizado) para comprobar conjuntamente armazón, contenidos y aplicación de tokens. Si no es posible compartirla, basta inicialmente con los archivos reales y dejar la comparación visual pendiente.
4. Indicación de si la instalación admite tema oscuro para visitantes o si opera con un único tema. **No se inventará** una segunda variante pública sin política y tokens correspondientes.

Al recibirlos, una **revisión posterior diferenciada** adaptará solo la representación pública de M05a a esos tokens y verificará texto/fondos/controles/estados en la peor combinación de contraste aplicable (texto mínimo AA y bordes interactivos), móvil y escritorio. No se trasladarán colores o logotipos del negocio al panel administrativo. **Hasta entonces:** validación pública `PENDIENTE`; estructura/flujo `PROPUESTO`.

## 3. RETIRADO del diseño vigente — supuesto conflicto de edición simultánea

**Instrucción del colíder aplicada:** no prometer ni presentar un detector de edición simultánea que M05a todavía no tiene. La comprobación de código respalda esta retirada: el `SaveServiceRequest` actual no transporta una versión de edición; `UpdateAsync` actualiza el registro sin comparar una versión previa, aunque sí comprueba validaciones y slug duplicado. `ReorderAsync` detecta listas de identificadores no coincidentes, **no** una versión concurrente de la ordenación. No se ejecutaron pruebas del producto ni se deduce una garantía de protección frente a pérdida de cambios.

**Anulaciones explícitas al leer los seis originales (sin modificarlos):**

- `INFORME-TECNICO.md`, **S3**: no presentar «otra sesión cambió el orden/estado» como conflicto reconocido automáticamente. Conservar únicamente los rechazos que realmente devuelve el contrato y errores recuperables; una lista de reordenación incompatible sí puede provocar 409, sin atribuirle detección de ediciones simultáneas.
- `INFORME-TECNICO.md`, **S4**: retirar el escenario «otra persona cambió este servicio» con 409, la acción «Ver versión actual» y la advertencia de recarga condicionada a ese detector inexistente.
- `MATRIZ-PANTALLAS-ESTADOS.md`, filas **S3 conflicto** y **S4 conflicto**: quedan superadas en cuanto describen detección simultánea. Sustituir para la revisión por conflicto **real** de slug repetido (409), transición editorial inválida (409) y, en S3, rechazo de un conjunto de IDs de reordenación que ya no corresponde a la lista (409). Errores de formulario siguen perteneciendo al estado **error/validación**.
- `CONFLICTOS-Y-DECISIONES.md`, **C4** y **E5**: retirar C4 como caso visual vigente y E5 como si hubiese hoy un 409 de versión listo para integrar. Si se desea protección de concurrencia, remitirla separadamente al líder técnico; este diseño no cambia DTO ni backend para simularla.
- `INVENTARIO-COMPONENTES.md`, pendiente técnico de concurrencia: no justificar un diálogo/patrón compartido nuevo sobre una garantía que no existe.
- `prototipo-m05a.html`: la variante **«Edición simultánea»**, su aviso «Otra persona cambió este servicio» y cualquier estado equivalente de S3/S4 **se excluyen de la demostración vigente**. El fichero HTML se conserva, pero tales controles y capturas se consideran **OBSOLETOS** y no deben presentarse a JP como comportamiento válido. Un sucesor solo podrá representar los conflictos confirmados arriba.
- `README.md`: se lee junto con esta adenda; su lista histórica de escaladas no prevalece frente a la retirada anterior.

**Se conservan sin cambio:** los errores de campos obligatorios, precio negativo, imagen con alt faltante, slug duplicado, publicación incompleta, transición inválida, pérdida de medio, 404 público indistinguible ante despublicación y error de red recuperable. Un 409 de slug/transición **no es** evidencia de detección de edición simultánea.

**Registro técnico separado; no entra como arreglo en esta entrega:** no existe aquí barrera acreditada de edición simultánea; decidir si debe añadirse versionado/ETag/optimistic concurrency corresponde al líder técnico y a la unidad de implementación autorizada. No se introduce un campo visual que presuponga esa decisión.

## 4. Matriz de validez de las cinco superficies tras la adenda

| Superficie | Vigente para revisión | Cambio de esta adenda | Qué falta |
|---|---|---|---|
| S1 · Listado público | Estados y estructura de §9, sin compra/reserva | Tema cliente real; invitación externa solo con publicaciones | Material de tema cliente y validación visual |
| S2 · Ficha pública | 404 indistinguible ante retirada; fallback de imagen | Tema cliente real; no prometer supervivencia del binario | Material de tema cliente y validación visual |
| S3 · Listado admin | Estructura, roles, vacío, datos, carga, errores | Eliminar afirmación de detección simultánea; conservar conflicto verificable de IDs de reordenación y transición inválida | Revisión visual con tokens SILLAR existentes |
| S4 · Editor admin | Campos, validación, estados editoriales, manejo de medios | Retirar flujo de aviso/409 por edición simultánea; conservar validación y slug duplicado | Revisión visual con tokens SILLAR existentes |
| S5 · Contribuciones | Capacidad, orden, estados de aportes y ausencia total al desactivar | Invitación pública **después de Catálogo y antes de CRM**, solo si activo y con publicados; tema público real | Material cliente para tramo público; verificación posterior de composición |

El alcance por estado continúa siendo **vacío, datos, cargando, error y conflictos efectivamente detectables cuando correspondan**, tanto en móvil como escritorio. Modo claro/oscuro del panel usa el sistema SILLAR; los temas públicos únicamente se validan con los efectivamente utilizados por la instalación real. El diseño no implanta código ni declara aprobadas pruebas de QA.

## 5. Estado, entrega y barreras

- **DECIDIDO:** posición y condición de la invitación pública; uso de tema real cliente para revisar web pública.
- **RETIRADO / DESCARTADO del diseño vigente:** conflicto visual de edición simultánea sin respaldo del backend actual.
- **IMPLEMENTADO EN MATERIAL DE DISEÑO:** esta adenda documental; los seis originales siguen siendo referencias históricas **sin cambios**.
- **PROPUESTO:** composición y condiciones de estados descritos aquí, hasta revisión de Chat 2.
- **PENDIENTE:** recibir archivos/tokens reales del cliente, producir y validar representación pública definitiva, revisión de Chat 2 y aprobación por las autoridades correspondientes.
- **INCIERTO:** política futura de conservación del archivo fotográfico de M05b y cualquier futura solución de concurrencia. No se resuelven en esta adenda.

**Publicación:** la conexión disponible a `JP-777/SILLAR-DESIGN` posee lectura pero no permiso `push`; el operador autorizado debe incorporar **los seis originales sin modificar + esta adenda** en `diseno/m05a-paso-3-5`, dentro de `propuestas/M05a/`, y devolver a Chat 2 el **SHA remoto**. No se declara entregado en `origin` ni aprobado el paso 3.5 antes de esa confirmación y de las aprobaciones.

**No se modificó `JP-777/SILLAR` ni se utilizó infraestructura QA reservada para B.**
