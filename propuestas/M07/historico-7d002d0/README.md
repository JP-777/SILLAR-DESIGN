# M07 B2B — propuesta de diseño · Paso 3.5

**Estado:** PROPUESTA · pendiente de revisión de Chat 2 y aprobación posterior  
**Creación / última modificación / última verificación:** 30/09/2026 · America/Lima  
**Producto main verificado:** `e839989432283c755edf7d4ae47b2c37697215ec`  
**Rama M07 verificada:** `m07-b2b-sobre-main`  
**Commit M07 verificado:** `7d002d040e844e4751a3b845d13982116523b0d9`

Este directorio contiene la propuesta de diseño de las superficies administrativas A1–A9 de M07.
No contiene código para copiar al producto y no modifica `JP-777/SILLAR`.

## Archivos

- `INFORME-TECNICO.md` — propuesta detallada A1–A9, armazón, permisos y accesibilidad.
- `prototipo-m07.html` — referencia visual interactiva, sin llamadas al producto.
- `MATRIZ-PANTALLAS-ESTADOS.md` — pantalla × estado × escritorio/móvil.
- `CONFLICTOS-REALES.md` — conflictos que sí están respaldados por SPEC o código actual.
- `INVENTARIO-COMPONENTES.md` — componentes/tokens existentes a reutilizar.
- `COSTURAS-Y-DECISIONES-ABIERTAS.md` — costuras y decisiones que el diseño no resuelve.
- `SHA256SUMS.txt` — manifiesto de integridad.

## Lectura obligatoria

1. El número final de cotización no se fija visualmente: se usa **«Número de cotización»** o
   **«Se asignará al guardar»**.
2. E3b sigue abierta: una presentación que era «a consultar» y luego recibe precio no adquiere
   una política nueva de caducidad en estas maquetas.
3. El umbral mayorista se representa como concepto, sin importe ni clave técnica inventados.
4. «Preparar para enviar» no equivale a una integración con WhatsApp.
5. No hay drag-and-drop. El orden se representa con acciones explícitas «Subir» / «Bajar».
6. El cliente nunca ve notas internas.
7. Las acciones administrativas reservadas a `admin` no se muestran al rol `editor`.
8. En el commit verificado, las cotizaciones del panel son de **solo lectura**. A7–A9 anticipan
   el contrato de la SPEC, pero ninguna acción inexistente debe implementarse desde la maqueta.

## Estado de revisión

La propuesta no declara cerrado ni aprobado el paso 3.5. Espera revisión de Chat 2.
