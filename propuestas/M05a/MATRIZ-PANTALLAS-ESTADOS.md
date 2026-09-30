# M05a · Matriz de pantallas, estados, temas y dispositivos

**Estado:** PROPUESTO. **Creación / modificación / verificación:** 28-09-2026, America/Lima. **Producto `main`:** `e839989432283c755edf7d4ae47b2c37697215ec`; **rama M05a:** `96111acd2ff02b38f10305039a432b26ceecd044`.

**Clave de cobertura:** CL-M = claro/móvil 390 CSS px; OS-M = oscuro/móvil; CL-E = claro/escritorio 1280; OS-E = oscuro/escritorio. Los cuatro pares son variantes de presentación, no cuatro contratos. La pantalla móvil pública **no adopta** el tema SILLAR: el simulador usa sus variables de rol validadas como soporte hasta que exista tema real de instalación del cliente. Ningún ejemplo del prototipo es dato de producción.

| Superficie / estado | Resultado visible y acción | CL-M | OS-M | CL-E | OS-E |
|---|---|:---:|:---:|:---:|:---:|
| S1 Listado público — vacío | «Todavía no hay servicios publicados», sin rejilla ni CTA de compra | ✓ | ✓ | ✓ | ✓ |
| S1 — datos | tarjetas ordenadas, título, precio nullable, breve y medio opcional; abre ficha | ✓ | ✓ | ✓ | ✓ |
| S1 — cargando | estructura estable / indicador nombrado solo tras espera real | ✓ | ✓ | ✓ | ✓ |
| S1 — error | fallo de consulta + «Volver a intentar» | ✓ | ✓ | ✓ | ✓ |
| S1 — conflicto | clic a servicio retirado termina en 404 amigable de S2 | ✓ | ✓ | ✓ | ✓ |
| S2 Ficha pública — vacío | no corresponde: slug inexistente se trata con 404 amigable | ✓ | ✓ | ✓ | ✓ |
| S2 — datos | título, medio/fallback, descripción y precio/unidad; volver a listado | ✓ | ✓ | ✓ | ✓ |
| S2 — cargando | «Cargando el servicio» y armazón, sin promesa falsa | ✓ | ✓ | ✓ | ✓ |
| S2 — error | error de red diferenciable de 404, acción de reintento | ✓ | ✓ | ✓ | ✓ |
| S2 — conflicto | despublicado → mismo 404 que inexistente; imagen fallida → fallback independiente | ✓ | ✓ | ✓ | ✓ |
| S3 Admin listado — vacío | `EmptyState` con acción única «Crear servicio» | ✓ | ✓ | ✓ | ✓ |
| S3 — datos | 390: filas apiladas; 1280: tabla; estados textuales y acciones | ✓ | ✓ | ✓ | ✓ |
| S3 — cargando | tabla/filas estables, etiqueta de carga específica | ✓ | ✓ | ✓ | ✓ |
| S3 — error | alerta explícita + reintento | ✓ | ✓ | ✓ | ✓ |
| S3 — conflicto | orden/estado cambió en otra sesión → actualizar sin sobrescribir | ✓ | ✓ | ✓ | ✓ |
| S4 Admin editor — vacío | alta de borrador, campos vacíos y guías | ✓ | ✓ | ✓ | ✓ |
| S4 — datos | contenido persistido, estado editorial, campos y acciones | ✓ | ✓ | ✓ | ✓ |
| S4 — cargando | indicador específico y controles temporalmente deshabilitados | ✓ | ✓ | ✓ | ✓ |
| S4 — error | validación por campo + alerta de fallo de red recuperable | ✓ | ✓ | ✓ | ✓ |
| S4 — conflicto | 409 simultáneo, advertencia sobre pérdida al recargar, cero sobrescritura silenciosa | ✓ | ✓ | ✓ | ✓ |
| S5 Composición — activo/datos | admin muestra entrada; portada pública invita solo con servicios publicados | ✓ | ✓ | ✓ | ✓ |
| S5 — activo/vacío | admin enlaza; `/servicios` activo vacío; portada sin invitación engañosa | ✓ | ✓ | ✓ | ✓ |
| S5 — capacidades cargando | no adivina ausencia ni genera enlace a ruta no confirmada | ✓ | ✓ | ✓ | ✓ |
| S5 — capacidades error | fallo recuperable a nivel plataforma, no pantalla M05a | ✓ | ✓ | ✓ | ✓ |
| S5 — desactivado/conflicto | **rutas, enlaces y huecos M05a inexistentes**, no “pantalla de desactivado” | ✓ | ✓ | ✓ | ✓ |

## Controles de verificación visual por combinación

**Móvil (390, ambos temas):** sin desbordamiento horizontal; topbar admin H-29 con menú estrecho ya resuelto; primer contenido visible sin menú ocupando toda la pantalla; editor sin acción fija oculta por teclado; áreas de toque de referencia 44×44 CSS px; no depender solo de color.

**Escritorio (1280, ambos temas):** admin con sidebar real y `PageContainer`; tabla escaneable sin colapsar cabecera; contenido público con medida de lectura controlada y cuadrícula proporcional; diálogos compartidos cuando se confirmen acciones.

**Todos los estados:** títulos y enlaces en español, foco discernible, spinner con objeto concreto, fallbacks de imagen accesibles, `aria-current` en navegación activa, sin SKU/ID interno visible, sin componente de pago/orden/reserva.

**Cobertura real de este material:** `prototipo-m05a.html` permite seleccionar las cinco superficies, todos los estados representables, tema claro/oscuro y móvil/escritorio, además de conflictos secundarios de imagen y guardado simultáneo. La matriz define aceptación para una **revisión visual futura**; no se declara que se hayan ejecutado e2e, axe ni pruebas sobre la infraestructura reservada para B.
