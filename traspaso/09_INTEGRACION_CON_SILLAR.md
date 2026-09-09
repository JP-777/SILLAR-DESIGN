# Integración con el proyecto funcional SILLAR

> Este documento describe contratos y posibles correspondencias. No se inspeccionó ni modificó `C:\SILLAR`; toda afirmación sobre su implementación actual que no provenga del historial queda como incierta.

## Separación de responsabilidades

### Solo diseño/investigación

- informes Markdown de `C:\SILLAR-DISENO\investigacion`;
- prototipos `.dc.html`, tablero y thumbnail de M01;
- bundle SillarUI generado para representar la propuesta;
- benchmarks aislados;
- harnesses y parches ilustrativos no aplicados.

### Listo para que otro agente evalúe/aplique

- componente y CSS de pared;
- integración de reinicio de módulo como ejemplo;
- puerta de animaciones y ejemplos;
- pruebas Playwright de ambos;
- contratos de imágenes, OG/SEO y navegadores;
- layouts/copies/estados M01.

### No verificado como integrado

Nada de este respaldo debe marcarse como ya pasado a producción. El usuario prohibió inspeccionar y tocar el producto en esta línea. La conversación menciona componentes funcionales preexistentes `useToasts/Toasts`, un `Spinner`, una hoja base de reduced motion y una superposición/barra de reconexión, pero su ubicación actual no se conoce.

## Stack y rutas que deben respetarse

- Frontend: React + TypeScript + Vite, pnpm.
- Backend de imágenes: ASP.NET Core sobre .NET 10.
- Rutas públicas: `/catalogo`, `/catalogo/:categoria`, `/producto/:slug`.
- Un producto siempre usa `/producto/:slug`, aunque aparezca en varias categorías.
- Slug no cambia automáticamente al editar nombre por enlaces compartidos.

## Equivalencias probables, no comprobadas

| Material de diseño | Equivalente funcional mencionado | Estado |
|---|---|---|
| `SillarUI.Toasts/useToasts` del bundle | `useToasts/Toasts` existente | Existe según usuario; API exacta no comprobada. |
| `SillarUI.Spinner` | Spinner único del sistema | Existe según usuario; defecto reduced motion confirmado. |
| `ConfirmDialog`/`Drawer` | Modales del producto | INCIERTO. |
| Listado/detalle M01 | Módulo catálogo M01 | Rutas/dominio conocidos; integración visual no comprobada. |
| `IntegracionReinicioModulo.tsx` | activación de módulo y overlay de reconexión | Flujo real existe; código solo ilustrativo. |
| `PuertaAnimacionesOcasionales` | configuración de instalación | Ajuste requerido conceptualmente; almacenamiento/API no decididos. |

## Contratos que el producto funcional debe respetar

### UI

- Consumir tokens, no colores literales.
- Aplicar escala cotidiana y reduced motion global.
- Para JS animado, escuchar cambios de preferencia y cancelar.
- Nunca esperar `animationend` para habilitar navegación/acción.
- Progreso y errores en español y vinculados a estado real.

### Catálogo M01

- Soportar vacío/datos/carga/conflicto como estados de primera clase.
- Conservar dados de baja visibles cuando se soliciten.
- No inventar datos mientras cargan.
- Mostrar consecuencias de desactivar categoría y reglas de última variante.
- Resolver duplicación de barras con mensaje específico.

### Medios

- Mantener nombre generado UUID v7 como identidad DB/disco.
- Validar contenido real y rechazar SVG.
- 5 MB no reemplaza límites de decodificación.
- Replicación debe conocer cada derivado o regenerarlo explícitamente.
- Orientar/convertir/limpiar derivados.
- Social absoluto HTTPS, sin sesión, JPEG compatible y <600 KB.

### Render público

- HTML inicial por producto debe contener head específico si se espera tarjeta.
- Recurso inexistente debe producir 404/410 real, no shell 200 genérico.
- Canonical estable y datos estructurados solo con datos visibles/verdaderos.
- Cada instalación pública necesita origen y sitemap propios si aplica.

### Licencias

- Proceso de publish debe copiar textos/avisos de dependencias elegidas.
- Una dependencia no se adopta basándose solo en metadata SPDX o URL.

## Posibles conflictos al integrar

1. La regla base actual de reduced motion puede congelar el Spinner. Cualquier integración de tokens debe resolver semántica, no exceptuar ciegamente el giro.
2. Los tokens de pared tienen fallbacks, pero la escala no está en el tokens M01 actual; riesgo de tiempos divergentes.
3. `harness.css` duplica roles para previews anidados y no debe copiarse como producción.
4. `_ds_bundle.*` es generado y puede no coincidir con componentes reales; no reemplazar source funcional con el bundle.
5. IDs fijos de diálogo/drawer en el bundle son adecuados para demo única, no necesariamente múltiples instancias.
6. El ajuste de instalación para animaciones puede llegar asíncrono; `null` debe bloquear, no permitir.
7. Una optimización de imágenes que almacene varios tamaños puede multiplicar la réplica sin que frontend lo note.
8. Elegir SSR para nube sin resolver accesibilidad pública local produciría superficies divergentes.

## Secuencia segura de transferencia

1. Otro agente lee informe/prototipo y localiza equivalente real en SILLAR.
2. Compara contratos, no copia bundle generado a ciegas.
3. Propone diff pequeño preservando tokens y accesibilidad.
4. Ejecuta pruebas funcionales y las pruebas semánticas entregadas.
5. Verifica publish/licencias y ambos modos nube/local.
6. Documenta qué parte dejó de ser propuesta y pasó a implementada/adoptada.
