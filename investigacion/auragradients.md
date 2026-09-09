# Auragradients — investigación para SILLAR

Fecha de verificación: 18 de agosto de 2026.

## Identidad del objeto investigado

No se encontró un paquete npm llamado `auragradients`, ni un repositorio o sitio oficial inequívoco con ese nombre en las fuentes públicas consultadas. “Aura gradient” sí es un nombre genérico para un tratamiento visual: varias manchas de color suaves, normalmente construidas con degradados radiales superpuestos, a veces con desenfoque o grano.

Esta distinción impide afirmar una licencia, versión, peso o árbol de dependencias de una herramienta concreta sin inventar datos. Si “Auragradients” se refiere a un enlace, archivo, plugin de Figma o catálogo comercial específico, este informe debe ampliarse con esa URL. Mientras tanto se analiza la técnica que el nombre describe y se deja registrada la incertidumbre.

## Qué hace exactamente la técnica

Un aura gradient combina dos o más focos radiales o elípticos sobre una superficie base. Los detalles que suelen producir el aspecto buscado son:

- focos descentrados, no un degradado lineal uniforme;
- transiciones largas y de bajo contraste entre cada foco y la superficie;
- opcionalmente una textura de grano que evita bandas visibles.

No aporta semántica, interacción ni información. Es una decisión de fondo/color.

## Encaje en SILLAR

La investigación llega a la misma conclusión que el contexto inicial: choca con el panel administrativo.

- La paleta del panel ya está validada para contraste y daltonismo; introducir un generador o preset externo crea combinaciones fuera de ese sistema.
- Un fondo multicolor compite con tablas, formularios, estados y alertas durante sesiones largas.
- El degradado no mejora la velocidad de lectura ni la consistencia operativa.
- Si alguna vez existe un hueco, está en el sitio público o en una pantalla de instalación poco frecuente, como fondo no informativo y usando exclusivamente tokens aprobados.

Esto es una conclusión sobre ajuste al contexto, no una decisión de adopción.

## Licencia

- La técnica CSS (`radial-gradient`) forma parte de la plataforma web y no añade una licencia de biblioteca.
- El CSS escrito por SILLAR no trae obligaciones de terceros.
- Un preset copiado, una imagen, un SVG, una textura de grano o la salida de un generador puede tener licencia y términos propios.
- No debe asumirse que “descarga gratis” equivale a permiso comercial o redistribución.

Para el objeto llamado “Auragradients”, la licencia queda como **no verificable sin el artefacto exacto**.

## Peso, dependencias y build

Para una implementación nativa:

| Concepto | Coste |
| --- | --- |
| JavaScript | 0 B |
| Dependencias | 0 |
| CSS adicional | Habitualmente unas centenas de bytes |
| Peticiones de red | 0 |
| Build propio | No; Vite solo minifica el CSS normal |
| Trabajo en reposo | Pintura estática; no existe bucle de animación |

El navegador rasteriza los degradados cuando pinta la superficie. En una pantalla estática el coste suele concentrarse en el primer pintado y en cambios de tamaño. Animar posiciones de fondo, filtros o degradados grandes fuerza repintados repetidos y no aporta valor operativo al panel.

Si se incorpora grano como imagen, su peso y licencia pasan a formar parte del coste. Un WebP/AVIF optimizado puede pesar decenas o cientos de KB; una textura 4K puede subir mucho más. Es necesario medir el archivo final, no el original de diseño.

## Restricciones no negociables

### Colores

Un preset con HEX, RGB, HSL u OKLCH literales no se puede copiar directamente. Cada parada debe referenciar variables que ya formen parte de la paleta validada. Incluso una parada transparente debe provenir de un token existente si la regla se aplica literalmente a todos los colores.

También debe comprobarse el contraste del contenido en todos los puntos del fondo, no solo sobre un color promedio. La opción más segura es que el texto viva en una superficie sólida validada y el aura quede detrás, sin afectar su fondo inmediato.

### Movimiento

El efecto no necesita animación. Si un prototipo añade movimiento, tiene que detenerlo con `prefers-reduced-motion`, no retrasar la aparición de controles y no cambiar la ubicación o disponibilidad de una acción.

## ¿Se puede escribir a mano en unas pocas decenas de líneas?

Sí. La versión estática esencial cabe en menos de diez líneas y no necesita React:

```css
.fondo-instalacion {
  background:
    radial-gradient(circle at 18% 20%,
      var(--color-aura-primaria) 0%, var(--color-aura-limpia) 68%),
    radial-gradient(circle at 82% 28%,
      var(--color-aura-secundaria) 0%, var(--color-aura-limpia) 64%),
    var(--color-superficie-pagina);
}
```

Los nombres son marcadores semánticos: deben mapearse a variables ya definidas y validadas, no crear colores nuevos para imitar una captura. Los porcentajes y posiciones son geometría, no color.

Los dos o tres detalles que probablemente gustan —focos descentrados, mezcla suave y una base estable— están completos ahí. El resto de una biblioteca de shaders, un generador o un catálogo de presets no es necesario para reproducirlos.

## Alternativas y su coste

| Alternativa | Peso | Rendimiento | Licencia y mantenimiento |
| --- | ---: | --- | --- |
| CSS con `radial-gradient` | Centenas de bytes; 0 dependencias | Pintura nativa estática | Código propio; tokens centrales; mantenimiento mínimo |
| SVG estático propio | Normalmente 1–10 KB según filtros/complejidad | Una imagen vectorial; filtros grandes pueden ser caros | Código/asset propio; fácil de revisar y cachear |
| WebP/AVIF estático | Decenas a cientos de KB según tamaño/calidad | Decodificación + memoria de bitmap; después se cachea | Necesita variantes de resolución, compresión y licencia del asset |
| Canvas/WebGL o shader | Biblioteca y runtime potencialmente de decenas a cientos de KB | GPU activa, memoria y bucle de frames si se anima | Mayor coste de compatibilidad, pruebas y movimiento reducido; excesivo para un fondo estático |
| Generador externo que exporta CSS | 0 B en runtime si solo se copia la salida | Igual que CSS nativo | Hay que revisar términos de la salida y reemplazar todas las paradas por tokens SILLAR |

## Riesgos concretos en una pantalla pública o de instalación

- Contraste variable detrás de títulos, enlaces y estados de progreso.
- Banding en monitores de baja profundidad de color.
- Apariencia distinta entre espacios de color/navegadores si se usan funciones recientes sin fallback.
- Presets con demasiados focos que dificultan conservar la identidad de marca.
- Textura de grano demasiado pesada o con derechos no claros.
- Animación continua que consume batería y contradice movimiento reducido.

## Prueba mínima si aparece el hueco

- Usar solo dos focos y una superficie de la paleta validada.
- Mantener formularios y texto sobre una superficie sólida.
- Comparar captura normal, simulaciones de daltonismo y modo de alto contraste.
- Medir LCP y tamaño transferido si existe una textura.
- Confirmar que con JavaScript desactivado la pantalla conserva la misma funcionalidad.
- No animar por defecto; si se experimenta, probar explícitamente movimiento reducido.

## Fuentes verificables

- [Búsqueda exacta de `auragradients` en npm](https://www.npmjs.com/search?q=auragradients)
- [CSS Images Module: definición de degradados](https://drafts.csswg.org/css-images-3/#gradients)
- [Media Queries: `prefers-reduced-motion`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-motion)

La ausencia de un resultado inequívoco no demuestra que no exista un recurso privado o no indexado; solo establece que no hay base pública suficiente para atribuirle metadatos técnicos o legales.
