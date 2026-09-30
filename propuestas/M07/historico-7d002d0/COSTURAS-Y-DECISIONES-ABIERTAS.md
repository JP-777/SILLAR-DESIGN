# Costuras de plataforma y decisiones abiertas — M07

**Fecha:** 30/09/2026  
**Producto:** `e839989432283c755edf7d4ae47b2c37697215ec`  
**M07:** `7d002d040e844e4751a3b845d13982116523b0d9`

## C1 · Navegación administrativa

Hace falta incorporar la contribución `b2bNavigation` y sus rutas al mecanismo de navegación
modular. Esto es una costura de integración, no motivo para escribir enlaces en `AdminShell`.

Efecto esperado:
- grupo «Solicitudes» activo solo si `b2b` está activo;
- tres destinos;
- desaparición completa al desactivar M07.

## C2 · Identidad humana del cliente en panel

Los DTO administrativos actuales exponen `CustomerId` pero no nombre, correo ni otro dato humano.

Diseño:
- no enseña UUID;
- no inventa nombre;
- A1/A2/A6/A7 omiten identidad humana mientras el contrato no la aporte.

Pregunta de producto/contrato:
¿el personal necesita identificar/contactar al cliente directamente desde M07? Si sí, la respuesta
debe llegar por contrato de M04 o snapshot autorizado, no por lectura de `crm` desde frontend.

## C3 · A7/A8/ciclo de A9 todavía sin HTTP

En `7d002d040e844e4751a3b845d13982116523b0d9`, cotizaciones administrativas son solo lectura.

Por tanto:
- A7 «Crear cotización» es referencia de la SPEC;
- A8 «Editor borrador» es referencia de la SPEC;
- acciones de enviar/aprobar/pagar/anular en A9 no se consideran implementables hasta existir API.

El Paso 4 no debe inferir endpoints desde el prototipo.

## C4 · Número de cotización

Abierto:
- letra de serie;
- mecanismo de unicidad entre nodos.

Diseño usa:
- encabezado «Número de cotización»;
- antes de guardar: «Se asignará al guardar».

No aparece ninguna letra inventada.

## C5 · E3b

Sigue abierta:
«presentación a consultar» → posteriormente recibe precio.

La pantalla conserva la diferencia:
- con `ItemId` y precio de catálogo nulo = «a consultar»;
- sin `ItemId` = línea libre.

No se afirma que el primer caso caduque cuando aparezca precio.

## C6 · Umbral mayorista

La SPEC decide que es un importe en `core.site_settings`, pero no están cerrados:
- el importe;
- la clave técnica.

Diseño puede decir «Precio mayorista/acordado» y explicar que el precio cobrado puede diferir del
precio de catálogo. No muestra cifra de umbral ni setting.

## C7 · Preparar para enviar

La SPEC deja abierta la forma exacta (texto, imagen o PDF).

A9 aporta una acción neutral:
**Preparar para enviar**

Ayuda:
«Prepara la cotización y envíala desde tu propio WhatsApp.»

No se diseña integración externa.

## C8 · Orden de líneas

No hay patrón compartido accesible de drag-and-drop. A8 usa botones «Subir» / «Bajar».
Si el producto exige una interacción distinta, debe aprobar un patrón transversal antes de cambiarla.

## C9 · Módulo desactivado

La navegación, rutas y contribuciones desaparecen. No se diseña una página «Módulo no disponible»
dentro de una ruta que no debe estar compuesta.

## Decisiones que esta propuesta no cierra

- E1/E9 de las superficies públicas, fuera de A1–A9.
- E3b.
- letra definitiva del número de cotización.
- unicidad multinodo del código visible.
- importe/clave del umbral mayorista.
- formato preparado para WhatsApp.
- eventual identidad humana adicional de cliente en DTO.
