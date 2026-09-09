import { useEffect, useState, type ReactNode } from 'react';
import {
  ParedDeSillaresEspera,
  type EstadoParedDeSillares,
} from './ParedDeSillaresEspera';

type FaseReinicio =
  | 'guardando'
  | 'reiniciando'
  | 'reconectando'
  | 'actualizando';

const mensajes: Record<FaseReinicio, string> = {
  guardando: 'Guardando la activación del módulo',
  reiniciando: 'Reiniciando los servicios',
  reconectando: 'Esperando que el sistema vuelva a estar disponible',
  actualizando: 'Actualizando los módulos habilitados',
};

type IntegracionReinicioModuloProps = {
  activarModulo: () => Promise<void>;
  esperarInicioReinicio: () => Promise<void>;
  esperarReconexion: () => Promise<void>;
  actualizarCapacidades: () => Promise<void>;
  informarError: (error: unknown) => void;
  panel: ReactNode;
};

export function IntegracionReinicioModulo({
  activarModulo,
  esperarInicioReinicio,
  esperarReconexion,
  actualizarCapacidades,
  informarError,
  panel,
}: IntegracionReinicioModuloProps) {
  const [fase, setFase] = useState<FaseReinicio>('guardando');
  const [estadoPared, setEstadoPared] = useState<EstadoParedDeSillares>('oculta');
  const [panelListo, setPanelListo] = useState(false);

  useEffect(() => {
    let termino = false;
    const mostrarSiSigueEsperando = window.setTimeout(() => {
      if (!termino) setEstadoPared('esperando');
    }, 1000);

    void (async () => {
      try {
        setFase('guardando');
        await activarModulo();

        setFase('reiniciando');
        await esperarInicioReinicio();

        setFase('reconectando');
        await esperarReconexion();

        setFase('actualizando');
        await actualizarCapacidades();

        termino = true;
        window.clearTimeout(mostrarSiSigueEsperando);

        // Mismo commit: el panel queda operativo y el velo deja de capturar eventos.
        // No se espera animationend ni se introduce una duración mínima.
        setPanelListo(true);
        setEstadoPared((actual) =>
          actual === 'esperando' ? 'saliendo' : 'oculta',
        );
      } catch (error) {
        termino = true;
        window.clearTimeout(mostrarSiSigueEsperando);
        setEstadoPared('oculta');
        informarError(error);
      }
    })();

    return () => {
      termino = true;
      window.clearTimeout(mostrarSiSigueEsperando);
    };
  }, [
    activarModulo,
    actualizarCapacidades,
    esperarInicioReinicio,
    esperarReconexion,
    informarError,
  ]);

  return (
    <>
      {panelListo ? <main data-testid="panel-listo">{panel}</main> : null}
      <ParedDeSillaresEspera
        estado={estadoPared}
        mensaje={mensajes[fase]}
      />
    </>
  );
}
