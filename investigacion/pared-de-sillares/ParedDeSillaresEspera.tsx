import { useState, type CSSProperties } from 'react';
import './pared-de-sillares-espera.css';

export type EstadoParedDeSillares = 'oculta' | 'esperando' | 'saliendo';

type ParedDeSillaresEsperaProps = {
  estado: EstadoParedDeSillares;
  mensaje: string;
};

const sillaresPorFila = [5, 4, 5, 4, 5] as const;

export function ParedDeSillaresEspera({
  estado,
  mensaje,
}: ParedDeSillaresEsperaProps) {
  const [movimientoDetenido, setMovimientoDetenido] = useState(false);

  return (
    <>
      <div
        className="pared-espera"
        data-estado={estado}
        data-movimiento={movimientoDetenido ? 'detenido' : 'activo'}
        data-testid="pared-espera"
        aria-hidden={estado === 'esperando' ? undefined : true}
      >
        <div className="pared-espera__contenido">
          <div className="pared-espera__muro" aria-hidden="true">
            {sillaresPorFila.map((cantidad, fila) => (
              <div className="pared-espera__fila" key={fila}>
                {Array.from({ length: cantidad }, (_, columna) => {
                  const retraso =
                    (sillaresPorFila.length - 1 - fila) * 280 + columna * 36;

                  return (
                    <span
                      className="pared-espera__sillar"
                      data-testid="sillar"
                      key={columna}
                      style={{ '--retraso-sillar': retraso } as CSSProperties}
                    />
                  );
                })}
              </div>
            ))}
            <span className="pared-espera__polvo pared-espera__polvo--uno" />
            <span className="pared-espera__polvo pared-espera__polvo--dos" />
          </div>

          <p className="pared-espera__mensaje" aria-hidden="true">
            {mensaje}
          </p>
          <button
            className="pared-espera__detener"
            type="button"
            disabled={movimientoDetenido}
            onClick={() => setMovimientoDetenido(true)}
          >
            {movimientoDetenido ? 'Movimiento detenido' : 'Detener movimiento'}
          </button>
        </div>
      </div>

      {estado === 'oculta' ? null : (
        <p
          className="pared-espera__estado-asistivo"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {estado === 'saliendo' ? 'Sistema disponible' : mensaje}
        </p>
      )}
    </>
  );
}
