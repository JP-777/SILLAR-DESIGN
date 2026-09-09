# SILLAR · Diseño

Material de diseño de **SILLAR**, la plataforma modular de retail y servicios. Investigación, propuestas visuales, componentes de referencia y animaciones.

Creado: 9 de septiembre de 2026.

---

## Qué es esto, y qué no es

**Es** el archivo de diseño: informes de investigación, prototipos, código de referencia y pruebas que sostienen decisiones visuales y de interacción.

**No es** el producto. El producto vive en otro repositorio y **nada de aquí se copia allí directamente**. Lo que cruza lo integra otro agente, deliberadamente y con revisión.

> **La regla que gobierna esta carpeta:**
> **Investigar es libre. Decidir tiene dueño.**
> Ningún proveedor escribe en el repositorio del producto.

Un modelo o una persona que trabaje aquí **prepara material y propone**. No adopta, no instala dependencias sin preguntar, y no convierte una propuesta numérica en una decisión.

---

## ⚠️ Antes de leer `traspaso/`

`traspaso/` contiene los quince documentos del traspaso del **29 de agosto de 2026**, **sin editar**.

**Varias de sus afirmaciones quedaron desmentidas el 9 de septiembre.** En concreto:

- `02_ESTADO_ACTUAL.md` y `12_DATOS_NO_RECUPERABLES.md` dan por perdidos **diez informes que sí existen** en `investigacion/`.
- Los dos afirman que no hay tokens de movimiento ni de velo en el producto. **Sí los hay, construidos.**
- El trabajo de accesibilidad del Spinner se marca como pendiente de reconstruir. **Ya está en el producto.**
- La **regla 9** de `10_PROMPT_CONTINUACION.md` da una escala de movimiento que no coincide ni con el informe ni con el producto.

**El estado vigente es [`ESTADO.md`](ESTADO.md). Donde discrepe con `traspaso/`, gana `ESTADO.md`.**

Se conservan sin corregir a propósito: son un registro fechado, y editarlos por dentro borraría la prueba de cómo se produjo el error.

---

## Estructura

```
ESTADO.md          El estado real, verificado. Manda sobre traspaso/
traspaso/          Los 15 documentos del 29 de agosto, sin editar
investigacion/     23 informes. Los dos árboles originales, fundidos en uno
  pared-de-sillares/                 componente, CSS, harness, pruebas, benchmark
  puerta-animaciones-ocasionales/    provider, hook, defensa CSS, pruebas
propuestas/M01/    Las tres pantallas del catálogo y el bundle exportado
```

**Los dos árboles se fundieron a propósito.** Estar separados es exactamente lo que hizo invisibles diez informes durante once días.

---

## Doce reglas no negociables

1. Todos los colores salen de variables CSS validadas. Ningún valor literal.
2. Toda animación respeta `prefers-reduced-motion`, **también si cambia en caliente**.
3. El CSS global cubre CSS, no JS. Cada animación en JS cancela y aplica su estado final por su cuenta.
4. Una animación **nunca** retrasa una acción.
5. Por debajo de **un segundo** no se muestra indicador de espera.
6. Lo que comunica sobrevive sin movimiento. El movimiento solo refuerza.
7. La preferencia del sistema siempre gana al ajuste de instalación.
8. El interruptor de instalación apaga el movimiento **ocasional**, no las microtransiciones cotidianas.
9. **Escala de movimiento** — los valores reales están en `ESTADO.md` §2. No uses los de `traspaso/`.
10. No crear abstracciones hasta que exista un **segundo caso real**.
11. Todo contenido de interfaz en **español**, y todo progreso debe ser verdadero.
12. Una dependencia comercial debe incluir el texto de su licencia en el artefacto publicado.

---

## Cómo se escribe un informe aquí

**El veredicto va al principio.** Si falta evidencia, se escribe `INCIERTO / REQUIERE CONFIRMACIÓN` y ahí termina.

Taxonomía obligatoria, la misma en todo el archivo:

`DECIDIDO` · `IMPLEMENTADO EN MATERIAL DE DISEÑO` · `PROPUESTO` · `DESCARTADO` · `PENDIENTE` · `INCIERTO`

Para evaluar una dependencia: qué resuelve que no sea razonable a mano, tamaño real en el bundle, coste continuo, transitivas, licencia dentro del publish, `prefers-reduced-motion` por defecto, y coste de vivir sin ella. **Si se escribe en unas pocas decenas de líneas, no es una dependencia.**

Todo documento lleva **fecha de creación, fecha de última verificación y el commit contra el que se verificó**. Los datos temporales —licencias, soporte de navegador, cuotas, APIs— se revalidan contra fuente primaria antes de adoptarse.

---

## Dependencias ya descartadas

Morphicons · Sileo · Auragradients · react-loading-skeleton · Motion · AutoAnimate · GSAP · Liquid Gooey · Three.js · NetVips.

**Sus informes están en `investigacion/`. Léelos antes de reabrir ninguna.**

La conclusión que los ordena, y que vale más que la lista: **el movimiento se hace con la plataforma** —View Transitions, `@starting-style`, transiciones de `display`, esqueletos CSS—, y `prefers-reduced-motion` se impone una sola vez en la hoja base.

**Y la grieta que hay que tener presente:** esa protección es CSS, así que **no alcanza a lo que anima por JavaScript**. Una biblioteca que mueva cosas desde JS tiene que respetar la preferencia por su cuenta *y* reaccionar a sus cambios; si no lo hace, no hay forma de arreglarlo desde fuera. Es lo que descartó a AutoAnimate teniendo lo único que de verdad costaba a mano.
