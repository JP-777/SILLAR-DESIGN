import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type MotivoBloqueoAnimacionOcasional =
  | 'sistema'
  | 'instalacion'
  | 'configuracion-pendiente';

export type EstadoAnimacionesOcasionales = {
  permitidas: boolean;
  motivoBloqueo: MotivoBloqueoAnimacionOcasional | null;
};

const PuertaContexto = createContext<EstadoAnimacionesOcasionales | null>(null);

function sistemaPideReducirMovimiento() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type PuertaAnimacionesOcasionalesProps = {
  /** `null` mientras la configuración de la instalación todavía no llegó. */
  habilitadasEnInstalacion: boolean | null;
  children: ReactNode;
};

export function PuertaAnimacionesOcasionales({
  habilitadasEnInstalacion,
  children,
}: PuertaAnimacionesOcasionalesProps) {
  const [reduccionPedidaPorSistema, setReduccionPedidaPorSistema] = useState(
    sistemaPideReducirMovimiento,
  );

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const actualizar = (evento: MediaQueryListEvent) => {
      setReduccionPedidaPorSistema(evento.matches);
    };

    setReduccionPedidaPorSistema(consulta.matches);
    consulta.addEventListener('change', actualizar);
    return () => consulta.removeEventListener('change', actualizar);
  }, []);

  const estado = useMemo<EstadoAnimacionesOcasionales>(() => {
    // La preferencia del sistema se evalúa primero de forma deliberada.
    if (reduccionPedidaPorSistema) {
      return { permitidas: false, motivoBloqueo: 'sistema' };
    }
    if (habilitadasEnInstalacion === null) {
      return { permitidas: false, motivoBloqueo: 'configuracion-pendiente' };
    }
    if (!habilitadasEnInstalacion) {
      return { permitidas: false, motivoBloqueo: 'instalacion' };
    }
    return { permitidas: true, motivoBloqueo: null };
  }, [habilitadasEnInstalacion, reduccionPedidaPorSistema]);

  useLayoutEffect(() => {
    const raiz = document.documentElement;
    raiz.dataset.animacionesOcasionales = estado.permitidas
      ? 'permitidas'
      : 'bloqueadas';
    raiz.dataset.motivoAnimacionesBloqueadas = estado.motivoBloqueo ?? 'ninguno';
  }, [estado]);

  return (
    <PuertaContexto.Provider value={estado}>
      {children}
    </PuertaContexto.Provider>
  );
}

export function useAnimacionesOcasionales() {
  const estado = useContext(PuertaContexto);
  if (estado === null) {
    throw new Error(
      'useAnimacionesOcasionales debe usarse dentro de PuertaAnimacionesOcasionales',
    );
  }
  return estado;
}
