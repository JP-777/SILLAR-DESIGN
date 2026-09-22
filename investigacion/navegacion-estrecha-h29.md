# H-29 · navegación estrecha — propuesta cerrada y prototipo

**VEREDICTO: IMPLEMENTADO EN MATERIAL DE DISEÑO — se propone reutilizar el `Drawer` existente de SILLAR como mecánica modal y cambiar únicamente su presentación para navegación estrecha: anclado a la izquierda, topbar de tres zonas y cuenta separada. El prototipo incorpora una familia de dos movimientos CSS —entrada de superficie desde su borde y revelado anclado de la cuenta— más una microtransición de estado del control de menú; no añade dependencias, no introduce colores de componente y no retrasa ninguna acción. La adopción sigue siendo decisión de JP.**

Fecha de creación: **10 de septiembre de 2026 — America/Lima**  
Fecha de última verificación: **10 de septiembre de 2026 — America/Lima**  
Repositorio de producto verificado: `JP-777/SILLAR`  
Commit de producto verificado: **`6d7748e84f1964cdf5baf233fbbc452e80d959f6`**  
Repositorio de diseño usado como marco: `JP-777/SILLAR-DESIGN`  
Commit de diseño verificado: **`3e89d0973575f53fbc66209674ca2b8105ce8e84`**

## 1 · Correcciones cerradas contra `main`

La advertencia del líder se reabrió contra `main` antes de construir.

- `AdminShell.tsx` confirma que `Inicio` es una entrada adicional a las entradas de módulo; el caso completo suma **16 destinos**: `Inicio` + 15 entradas aportadas por CORE, Catálogo, Contenido y CRM.
- `navigation.ts` confirma `coreNavigation`, `catalogNavigation`, `cmsNavigation` y `crmNavigation`, y que `visibleNavigation()` filtra por módulo activo y por `minimumRole`.
- `SessionProvider.tsx` confirma la jerarquía `editor < admin < super_admin`.
- `core/routes.tsx` confirma `Sistema`: Módulos, Configuración, Archivos, Usuarios y Auditoría.
- `catalog/routes.tsx` confirma `Catálogo`: Productos, Categorías y Marcas.
- `cms/routes.tsx` confirma `Contenido`: Banners, Promociones, Productos destacados, Trabajos destacados y Redes sociales.
- `crm/routes.tsx` confirma `Clientes`: Clientes y Mensajes.
- `ModuleNavigation.group` es texto de agrupación; las rutas viven en `items`.

Con los cuatro módulos activos: `super_admin` ve **16** destinos contando Inicio; `editor` ve **10**; un `editor` con CORE + Catálogo activos ve **5**.

## 2 · El `Drawer` no se reemplaza

`frontend/src/shared/ui/patterns.tsx` mantiene `Drawer({ open, title, description, onClose, footer, children })`, con `role="dialog"`, `aria-modal="true"`, backdrop y `useFocusTrap`.

Por tanto, el prototipo **no propone otra primitiva modal**. La maqueta reproduce únicamente la presentación deseada y sus estados. En producto, la integración debe conservar la mecánica de foco ya resuelta.

El CSS actual de `.ui-drawer` lo fija a la **derecha** y no anima entrada/salida. Para H-29 se propone una presentación de navegación a la **izquierda**. Este informe no decide si la integración técnica usa un prop, una clase modificadora u otra forma; sí decide el resultado: **el mismo Drawer y la misma mecánica modal, presentado desde el borde izquierdo en ancho estrecho**.

## 3 · Regla de grupos derivada del prototipo

**PROPUESTO:** usar disclosure solo cuando hay **6 o más destinos visibles** contando `Inicio`.

A 390 px:

- con 5 destinos, CORE + Catálogo caben completos con sus encabezados; plegarlos añade una interacción para ahorrar poco;
- con 10 o 16 destinos, mostrarlos todos vuelve a convertir el cajón en una lista larga; ahí los grupos reducen la longitud inicial.

Con 6 o más destinos, el grupo de la ruta actual abre inicialmente y los demás comienzan cerrados. Con 5 o menos, los enlaces quedan visibles sin controles de expansión.

El umbral **5** es resultado del prototipo, no un token global.

## 4 · Familia de movimiento seleccionada

La familia se llama descriptivamente **«movimiento desde el origen»**: cada superficie se mueve desde el lugar del que procede; nada rebota, flota ni se reproduce solo.

### A · Superficie desde el borde — `PROPUESTO`

El cajón entra desde el borde izquierdo mediante `transform`, acompañado por fundido del velo.

- entrada: `--duracion-superficie` = 240 ms;
- curva: `--curva-entrada`;
- salida visual de referencia: `--duracion-salida-superficie` = 180 ms;
- la navegación funcional nunca espera la salida.

El prototipo conserva montado su shell para mostrar entrada y salida. Esto **no** propone reemplazar la estrategia interna del `Drawer` del producto.

Con `prefers-reduced-motion: reduce`, se elimina el desplazamiento y queda únicamente un cambio breve de opacidad con `--duracion-cambio-reducido`.

### B · Cuenta anclada al disparador — `PROPUESTO`

La superficie de cuenta aparece junto al control superior derecho mediante `opacity`, un desplazamiento vertical de 6 px y una escala mínima `.98 → 1`, todo durante `--duracion-mensaje` = 180 ms.

No hay spring, blur ni rebote. Con movimiento reducido desaparecen desplazamiento y escala; la misma información permanece disponible.

### C · Estado del control de menú — `PROPUESTO` como microtransición

Se tomó como referencia la familia de hamburguesas CSS de Uiverse y `Menu Toggle Icon` de Efferd en 21st.dev: tres trazos pasan a una X mediante transformaciones.

La demo de 21st permite una duración de 500 ms; **ese tiempo se descarta** para el panel. El prototipo usa el escalón `--duracion-control` = **120 ms**.

Referencias:

- 21st.dev · `Menu Toggle Icon` — Efferd: `https://21st.dev/@efferd/components/menu-toggle-icon`
- Uiverse · `Checkbox`/hamburger — Cevorob: `https://uiverse.io/Cevorob/good-wolverine-51`

Uiverse declara el elemento revisado como HTML/CSS y MIT, pero la ficha muestra un color literal; la propuesta no lo copia. Los componentes del prototipo consumen roles SILLAR.

## 5 · Por qué forman una familia

1. el cajón viene del borde izquierdo porque allí vive la navegación;
2. la cuenta aparece junto a su disparador porque de allí nace;
3. el icono cambia de forma porque el mismo control cambia de estado.

Si se apaga el movimiento, permanecen exactamente los mismos enlaces, superficies, textos y estados.

## 6 · Descartes del barrido

| Efecto / referencia | Estado | Motivo |
|---|---|---|
| React Bits · Animated List | **DESCARTADO** | `motion/react`, `useInView(... once:false)` y colores literales. |
| Uiverse · 3D Cube Loader | **DESCARTADO** | H-29 no contiene una espera que comunicar. |
| 21st · Drawer / `vaul` | **DESCARTADO** | Duplica el Drawer ya construido y añade dependencia. |
| 21st · Shifting Dropdown | **DESCARTADO** | Declara `motion`. |
| 21st · Navbar with Animated Mega Dropdown | **DESCARTADO** | Declara `framer-motion` y resuelve navegación de marketing. |
| 21st · Profile Dropdown (Arihant) | **DESCARTADO** | Framer Motion + `next-themes`; reabre tema sin necesidad. |
| 21st · Basic Dropdown | **DESCARTADO** | Declara `motion`; la cuenta cabe en CSS local. |
| 21st · User Profile Dropdown | **DESCARTADO** | Framer Motion y demasiada superficie para tres acciones. |
| 21st · Toggle Theme | **DESCARTADO** | `next-themes` + Framer Motion; el tema actual es requisito de no regresión. |
| shaders / WebGL / globos / partículas | **DESCARTADO** | Movimiento continuo sin información y coste impropio del panel. |
| stagger de enlaces | **DESCARTADO** | Hace aparecer destinos conocidos por turnos y retrasa su percepción. |
| bounce / springs | **DESCARTADO** | Ruido repetitivo en una herramienta de ocho horas. |
| animación al hacer scroll | **DESCARTADO** | La navegación no debe volver a presentarse al recorrerla. |
| transición de página completa | **DESCARTADO** | Mueve/captura más superficie de la necesaria. |
| glow / gradientes animados | **DESCARTADO** | Estética sin semántica y riesgo de una segunda identidad. |

## 7 · Tema: requisito de no regresión

Mover `Tema oscuro` a la cuenta cambia ubicación, no comportamiento.

El prototipo permite alternar tema para revisar la propuesta, pero no propone almacenamiento ni un mecanismo de tema nuevo. En producto se conserva la implementación actual y su persistencia.

## 8 · Estados construidos

`propuestas/H29/navegacion-estrecha.html` incluye:

1. topbar cerrada a 390 px;
2. cajón abierto;
3. cuenta abierta;
4. grupos expandidos y contraídos;
5. `super_admin` con 16 destinos;
6. `editor` con 10 destinos;
7. `editor` + CORE/Catálogo con 5 destinos;
8. claro/oscuro;
9. simulador visual de movimiento reducido;
10. `aria-current="page"` independiente del movimiento.

El simulador sirve para revisión manual del artefacto. **No reemplaza** una prueba real de `prefers-reduced-motion` del navegador.

## 9 · Criterios de revisión

- a 390 px el contenido aparece desde el primer viewport con navegación cerrada;
- abrir navegación no desplaza el documento;
- seleccionar destino cambia el contenido inmediatamente;
- el estado activo se entiende sin movimiento;
- en reducción no hay desplazamiento del cajón ni de la cuenta;
- probar `no-preference → reduce` y `reduce → no-preference` con la preferencia real;
- claro y oscuro conservan la jerarquía;
- el caso de 5 destinos no añade disclosures;
- 10 y 16 sí reducen la longitud inicial con grupos;
- cero dependencia nueva;
- cero color literal en reglas de componentes.

## 10 · Fuentes de producto reabiertas

Commit `6d7748e84f1964cdf5baf233fbbc452e80d959f6`:

- `frontend/src/layout/AdminShell.tsx`
- `frontend/src/layout/navigation.ts`
- `frontend/src/session/SessionProvider.tsx`
- `frontend/src/modules/core/routes.tsx`
- `frontend/src/modules/catalog/routes.tsx`
- `frontend/src/modules/cms/routes.tsx`
- `frontend/src/modules/crm/routes.tsx`
- `frontend/src/shared/ui/patterns.tsx`
- `frontend/src/shared/ui/useFocusTrap.ts`
- `frontend/src/shared/ui/patterns.css`
- `frontend/src/shared/styles/tokens.css`

## 11 · Estado de entrega

- `propuestas/H29/navegacion-estrecha.html` — **IMPLEMENTADO EN MATERIAL DE DISEÑO**.
- `investigacion/navegacion-estrecha-h29.md` — **IMPLEMENTADO EN MATERIAL DE DISEÑO**.
- adopción en producto — **PENDIENTE** de JP.

**Estos archivos están producidos fuera de los repositorios; no están entregados al proyecto hasta que JP los revise y los commitee en `origin`.**
