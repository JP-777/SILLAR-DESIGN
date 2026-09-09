# Morphicons — investigación para SILLAR

Fecha de verificación: 18 de agosto de 2026. Versión observada: `morphicons@1.7.0`.

## Resumen factual

Morphicons transforma un icono SVG de trazos en otro. No reproduce una animación preparada por icono: normaliza las geometrías, busca correspondencias, alinea las formas y genera en tiempo de ejecución los valores intermedios del atributo `d`. La transición usa un resorte interrumpible y todas las instancias comparten un único `requestAnimationFrame`.

Su capacidad distintiva es el *morph* arbitrario entre iconos compatibles. Para una pareja conocida —por ejemplo, expandido/contraído o activo/inactivo— una superposición, un giro o un fundido escrito a mano suele comunicar el mismo cambio con mucho menos mecanismo.

En SILLAR el uso plausible es una transición causada por una acción y asociada a un cambio real de estado. No encaja como movimiento autónomo, decorativo o repetitivo en un panel utilizado durante horas.

## Qué hace exactamente

- Acepta iconos dibujados con trazos: un `d` o datos con forma `IconNode` de Lucide.
- Incluye adaptadores para React, Vue, Svelte, React Native, Astro, Web Components y DOM directo.
- Ofrece modo declarativo, progreso controlado e interfaz imperativa.
- Calcula rotaciones congruentes sin configurar manualmente cada pareja.
- Conserva el estado final como SVG normal y actualiza el `d` fuera del ciclo de render de React.
- No sirve bien para iconos rellenos, geometrías con `transform`, grupos arbitrarios ni parejas que no compartan sistema de coordenadas sin normalización previa.

Uso mínimo compatible con las reglas de SILLAR:

```tsx
import { MorphIcon } from "morphicons/react";
import { Circle, CircleCheck } from "lucide";

<button onClick={confirmar} aria-pressed={confirmado}>
  <MorphIcon
    icon={confirmado ? CircleCheck : Circle}
    color="var(--color-icono-estado)"
    reducedMotion="user"
    aria-hidden="true"
  />
  {confirmado ? "Confirmado" : "Confirmar"}
</button>
```

`reducedMotion="user"` es obligatorio para SILLAR. El valor predeterminado de la biblioteca es `"never"`, es decir, ignora `prefers-reduced-motion`. Con `"user"` el cambio se vuelve instantáneo cuando el sistema solicita movimiento reducido.

El evento y el cambio de estado ocurren primero; la animación es una consecuencia visual y no debe envolver, esperar ni bloquear `confirmar`.

## Licencia

- Código de Morphicons: MIT. El repositorio y el tarball publicado sí incluyen el texto `LICENSE`.
- Los iconos no quedan relicenciados por Morphicons. La demostración usa, entre otros, Lucide (ISC), Heroicons (MIT) y Tabler (MIT).
- Si se copian rutas SVG de otra colección, se conserva la obligación de revisar y atribuir esa colección por separado.

## Peso y dependencias

| Concepto | Coste observado |
| --- | ---: |
| Tarball npm de `morphicons@1.7.0` | 49,054 B |
| Paquete descomprimido | 156,271 B / 30 archivos |
| Bundle React + `Menu` y `X`, React externo | 18,402 B minificados; 8,191 B gzip |
| Dependencias de ejecución declaradas | 0 |
| Peer para esta integración | `react >=18` |
| Paquete de datos Lucide, si se elige | `lucide@1.28.0`, ISC, 21,220,465 B descomprimido |

La medición de bundle se hizo con esbuild 0.25.10, ESM y objetivo ES2022, dejando React/ReactDOM fuera porque Vite ya los incorpora. La cifra incluye dos iconos Lucide. El proyecto publica un límite propio de 8.5 KB gzip para la entrada React, por lo que la medición local es coherente con su control de tamaño.

“Cero dependencias” describe a Morphicons, no necesariamente a la integración completa. Si SILLAR solo tuviera `lucide-react`, Morphicons no puede consumir esos componentes: necesita el paquete de datos `lucide`, rutas `d` propias u otro formato compatible. El paquete Lucide pesa mucho en `node_modules`, aunque el bundle final elimina los iconos no importados.

## Build y operación

- No necesita un build propio ni generación previa. Publica ESM y tipos; Vite lo procesa en el build normal.
- Es ESM-only.
- El import desde el gran índice de `lucide` obliga al bundler a inspeccionar un catálogo amplio. No aumenta de igual manera el bundle final, pero sí puede aumentar el trabajo de resolución durante desarrollo/build.
- El plan de una pareja se calcula en el hilo principal. El autor declara menos de 1 ms para planificar una pareja; sigue siendo una afirmación del proyecto, no una medición dentro de SILLAR.
- Cada frame serializa y escribe geometría SVG. Para uno o pocos indicadores activados por el usuario el coste es acotado; una tabla con decenas de iconos animándose a la vez convierte ese trabajo en coste continuo del hilo principal.
- La animación es interrumpible: clics consecutivos no tienen que esperar el final del resorte.

## Mantenimiento

El coste de integración es bajo si se estandarizan tres decisiones: parejas admitidas, política global `reducedMotion="user"` y fuente/licencia de los iconos. El coste aumenta si se permiten SVG arbitrarios: habrá que validar trazos, cuadrícula, `viewBox`, número de segmentos y legibilidad de cada transición.

La biblioteca apareció en 2026 y la versión analizada ya es `1.7.0`; conviene tratar su API y sus resultados visuales como tecnología joven y fijar versión durante una evaluación.

## ¿Se puede escribir a mano en unas pocas decenas de líneas?

Sí, si lo que gusta es comunicar una pareja de estados conocida. No, si el requisito real es convertir cualquier icono de trazos en cualquier otro con correspondencia automática e interrupción física correcta.

La alternativa siguiente conserva tres detalles útiles —estado inmediato, transición breve y movimiento reducido— sin intentar un *morph* geométrico:

```tsx
type IconoEstadoProps = {
  activo: boolean;
  apagado: React.ReactNode;
  encendido: React.ReactNode;
};

export function IconoEstado({
  activo,
  apagado,
  encendido,
}: IconoEstadoProps) {
  return (
    <span className="icono-estado" data-activo={activo} aria-hidden="true">
      <span data-capa="apagado">{apagado}</span>
      <span data-capa="encendido">{encendido}</span>
    </span>
  );
}
```

```css
.icono-estado {
  display: inline-grid;
  color: var(--color-icono-estado);
}

.icono-estado > span {
  grid-area: 1 / 1;
  transition: opacity 140ms ease, transform 140ms ease;
}

.icono-estado[data-activo="false"] [data-capa="encendido"],
.icono-estado[data-activo="true"] [data-capa="apagado"] {
  opacity: 0;
  transform: scale(0.9);
}

@media (prefers-reduced-motion: reduce) {
  .icono-estado > span {
    transition: none;
  }
}
```

No hay retardo: el estado accesible del control cambia en el mismo evento. El efecto usa el color heredado desde una variable validada.

## Alternativas y su coste

| Alternativa | Peso y dependencias | Rendimiento | Mantenimiento / límite |
| --- | --- | --- | --- |
| Superposición o giro con CSS | Sin paquete; normalmente menos de 1 KB | Opacidad/transformación breve; compositor; cero trabajo cuando está quieto | Una regla por patrón. No es un *morph* real, pero suele bastar para parejas conocidas |
| Interpolar `d` con Motion | Motion declara MIT; su componente `motion` ronda 34 KB gzip según su documentación | Animación JS/WAAPI según propiedad; debe configurarse movimiento reducido | Las rutas deben tener estructura compatible o prepararse a mano; coste alto para dos estados |
| `@animateicons/react@0.4.3` | MIT; 2,692,508 B descomprimido; Motion viene empaquetado | Animaciones semánticas preparadas por icono | Catálogo útil para efectos por icono, no para transformar estados arbitrarios. También permite copiar fuente, pero esa fuente conserva su motor/contrato |
| SVG estático sin transición | Solo el icono que ya use SILLAR | Coste mínimo | Máxima consistencia. El texto, `aria-pressed` o estado visible sigue siendo la fuente de verdad |

## Datos que conviene validar si aparece el hueco

- Una lista cerrada de dos o tres transiciones de estado, no una adopción general del catálogo.
- Legibilidad de cada frame final a 16, 20 y 24 px; los frames intermedios no deben parecer otro estado válido.
- Cero movimiento al activar `prefers-reduced-motion`.
- Acción y foco disponibles de inmediato durante y después de clics rápidos.
- Coste con la tabla o formulario real donde se usaría, no con una galería aislada.

## Fuentes primarias

- [Sitio y métricas declaradas de Morphicons](https://www.morphicons.com/)
- [README y documentación de Morphicons](https://github.com/guillermolg00/morphicons/blob/main/README.md)
- [Manifiesto de `morphicons@1.7.0`](https://github.com/guillermolg00/morphicons/blob/main/package.json)
- [Licencia de Morphicons](https://github.com/guillermolg00/morphicons/blob/main/LICENSE)
- [Motion: configuración de movimiento reducido](https://www.motion.dev/docs/react-motion-config)
- [Repositorio de AnimateIcons](https://github.com/Avijit07x/animateicons)

