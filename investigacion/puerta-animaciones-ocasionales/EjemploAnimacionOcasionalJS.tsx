import { useEffect, useRef } from 'react';
import { useAnimacionesOcasionales } from './PuertaAnimacionesOcasionales';

type EjemploAnimacionOcasionalJSProps = {
  activa: boolean;
};

export function EjemploAnimacionOcasionalJS({
  activa,
}: EjemploAnimacionOcasionalJSProps) {
  const elementoRef = useRef<HTMLDivElement>(null);
  const { permitidas } = useAnimacionesOcasionales();

  useEffect(() => {
    const elemento = elementoRef.current;
    if (elemento === null) return;

    const dejarEnEstadoFinal = () => {
      elemento.getAnimations().forEach((animacion) => animacion.cancel());
      elemento.dataset.estadoAnimacion = 'final';
    };

    if (!activa || !permitidas) {
      dejarEnEstadoFinal();
      return;
    }

    elemento.dataset.estadoAnimacion = 'en-curso';
    const animacion = elemento.animate(
      [
        { opacity: 0, transform: 'translate3d(0, 4rem, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ],
      {
        duration: 10_000,
        easing: 'cubic-bezier(.2, 0, .4, 1)',
      },
    );
    animacion.addEventListener('finish', dejarEnEstadoFinal, { once: true });

    // Se ejecuta inmediatamente si cambia cualquiera de las dos puertas.
    return dejarEnEstadoFinal;
  }, [activa, permitidas]);

  return (
    <div
      ref={elementoRef}
      data-animacion-ocasional
      data-testid="animacion-js"
      data-estado-animacion="final"
    />
  );
}
