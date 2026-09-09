const puerto = Number(process.argv[2] ?? 9338);
const modo = process.argv[3] ?? 'normal';
const archivo = process.argv[4];
const factorCpu = Number(process.argv[5] ?? 4);

if (!archivo) throw new Error('Falta la URL file:/// del benchmark');

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));
let objetivos;
for (let intento = 0; intento < 40; intento += 1) {
  try {
    objetivos = await fetch(`http://127.0.0.1:${puerto}/json/list`).then((respuesta) => respuesta.json());
    break;
  } catch {
    await esperar(100);
  }
}
if (!objetivos) throw new Error('Chrome no expuso el puerto de depuración');

const pagina = objetivos.find((objetivo) => objetivo.type === 'page');
const socket = new WebSocket(pagina.webSocketDebuggerUrl);
await new Promise((resolver, rechazar) => {
  socket.addEventListener('open', resolver, { once: true });
  socket.addEventListener('error', rechazar, { once: true });
});

let secuencia = 0;
const pendientes = new Map();
socket.addEventListener('message', (evento) => {
  const mensaje = JSON.parse(evento.data);
  if (!mensaje.id || !pendientes.has(mensaje.id)) return;
  const { resolver, rechazar } = pendientes.get(mensaje.id);
  pendientes.delete(mensaje.id);
  if (mensaje.error) rechazar(new Error(JSON.stringify(mensaje.error)));
  else resolver(mensaje.result);
});

function enviar(method, params = {}) {
  const id = ++secuencia;
  const respuesta = new Promise((resolver, rechazar) => pendientes.set(id, { resolver, rechazar }));
  socket.send(JSON.stringify({ id, method, params }));
  return respuesta;
}

await enviar('Page.enable');
await enviar('Runtime.enable');
await enviar('Performance.enable');
await enviar('Emulation.setCPUThrottlingRate', { rate: factorCpu });
await enviar('Emulation.setEmulatedMedia', {
  media: '',
  features: [{
    name: 'prefers-reduced-motion',
    value: modo === 'reducido' ? 'reduce' : 'no-preference',
  }],
});
await enviar('Page.navigate', { url: `${archivo}?modo=${modo}` });

let resultado;
for (let intento = 0; intento < 90; intento += 1) {
  await esperar(100);
  const evaluacion = await enviar('Runtime.evaluate', {
    expression: 'window.__resultado ?? null',
    returnByValue: true,
  });
  if (evaluacion.result.value) {
    resultado = evaluacion.result.value;
    break;
  }
}

const metricas = await enviar('Performance.getMetrics');
socket.close();

if (!resultado) throw new Error('El benchmark no produjo resultados');
const nombres = new Set(['LayoutCount', 'RecalcStyleCount', 'ScriptDuration', 'TaskDuration', 'JSHeapUsedSize']);
resultado.metricasCdp = Object.fromEntries(
  metricas.metrics.filter((metrica) => nombres.has(metrica.name)).map((metrica) => [metrica.name, metrica.value]),
);
resultado.factorCpu = factorCpu;
console.log(JSON.stringify(resultado));
