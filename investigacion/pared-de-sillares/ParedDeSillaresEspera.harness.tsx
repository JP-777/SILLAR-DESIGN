import { useEffect, useState } from 'react';
import {
  ParedDeSillaresEspera,
  type EstadoParedDeSillares,
} from './ParedDeSillaresEspera';

export function ParedDeSillaresEsperaHarness() {
  const parametros = new URLSearchParams(window.location.search);
  const duracion = Number(parametros.get('duracion') ?? 1800);
  const [estado, setEstado] = useState<EstadoParedDeSillares>('oculta');
  const [panelListo, setPanelListo] = useState(false);
  const [acciones, setAcciones] = useState(0);

  useEffect(() => {
    let termino = false;
    const mostrar = window.setTimeout(() => {
      if (!termino) setEstado('esperando');
    }, 1000);
    const completar = window.setTimeout(() => {
      termino = true;
      window.clearTimeout(mostrar);
      setPanelListo(true);
      setEstado((actual) => actual === 'esperando' ? 'saliendo' : 'oculta');
    }, duracion);

    return () => {
      termino = true;
      window.clearTimeout(mostrar);
      window.clearTimeout(completar);
    };
  }, [duracion]);

  return (
    <>
      {panelListo ? (
        <main data-testid="panel-listo">
          <button type="button" onClick={() => setAcciones((valor) => valor + 1)}>
            Nueva venta
          </button>
          <output aria-label="Acciones ejecutadas">{acciones}</output>
        </main>
      ) : null}
      <ParedDeSillaresEspera
        estado={estado}
        mensaje="Esperando que el sistema vuelva a estar disponible"
      />
    </>
  );
}
