import { useState } from 'react';
import { EjemploAnimacionOcasionalJS } from './EjemploAnimacionOcasionalJS';
import {
  PuertaAnimacionesOcasionales,
  useAnimacionesOcasionales,
} from './PuertaAnimacionesOcasionales';
import './animaciones-ocasionales.css';
import './ejemplo-animacion-css.css';

function EstadoPuerta() {
  const estado = useAnimacionesOcasionales();
  return (
    <>
      <output data-testid="permiso-ocasional">
        {estado.permitidas ? 'permitidas' : `bloqueadas:${estado.motivoBloqueo}`}
      </output>
      <div
        className="ejemplo-animacion-css"
        data-animacion-ocasional
        data-activa="true"
        data-testid="animacion-css"
      />
      <EjemploAnimacionOcasionalJS activa />
    </>
  );
}

export function PuertaAnimacionesOcasionalesHarness() {
  const parametro = new URLSearchParams(window.location.search).get('instalacion');
  const inicial = parametro === 'si' ? true : parametro === 'no' ? false : null;
  const [habilitadas, setHabilitadas] = useState<boolean | null>(inicial);

  return (
    <PuertaAnimacionesOcasionales habilitadasEnInstalacion={habilitadas}>
      <button type="button" onClick={() => setHabilitadas(true)}>
        Permitir en instalación
      </button>
      <button type="button" onClick={() => setHabilitadas(false)}>
        Bloquear en instalación
      </button>
      <EstadoPuerta />
    </PuertaAnimacionesOcasionales>
  );
}
