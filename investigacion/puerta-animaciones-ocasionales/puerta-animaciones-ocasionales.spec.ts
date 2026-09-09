import { expect, test } from '@playwright/test';

const rutaPrueba = '/__pruebas/puerta-animaciones-ocasionales';

test('la preferencia del sistema gana aunque la instalación permita animaciones', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${rutaPrueba}?instalacion=si`);

  await expect(page.getByTestId('permiso-ocasional')).toHaveText(
    'bloqueadas:sistema',
  );
  await expect(page.locator('html')).toHaveAttribute(
    'data-animaciones-ocasionales',
    'bloqueadas',
  );
  await expect(page.locator('html')).toHaveAttribute(
    'data-motivo-animaciones-bloqueadas',
    'sistema',
  );
});

test('la instalación puede bloquearlas aunque el sistema no pida reducción', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${rutaPrueba}?instalacion=no`);

  await expect(page.getByTestId('permiso-ocasional')).toHaveText(
    'bloqueadas:instalacion',
  );
});

test('solo se permiten cuando ambas puertas lo permiten', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${rutaPrueba}?instalacion=si`);

  await expect(page.getByTestId('permiso-ocasional')).toHaveText('permitidas');
  await expect(page.locator('html')).toHaveAttribute(
    'data-animaciones-ocasionales',
    'permitidas',
  );
});

test('sin configuración cargada falla cerrada', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(rutaPrueba);

  await expect(page.getByTestId('permiso-ocasional')).toHaveText(
    'bloqueadas:configuracion-pendiente',
  );
});

test('un cambio en caliente cancela CSS y JavaScript y deja el estado final', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${rutaPrueba}?instalacion=si`);
  await expect(page.getByTestId('permiso-ocasional')).toHaveText('permitidas');

  await expect.poll(() => page.getByTestId('animacion-js').evaluate(
    (elemento) => elemento.getAnimations().length,
  )).toBe(1);

  await page.emulateMedia({ reducedMotion: 'reduce' });

  await expect(page.getByTestId('permiso-ocasional')).toHaveText(
    'bloqueadas:sistema',
  );
  await expect(page.getByTestId('animacion-js')).toHaveAttribute(
    'data-estado-animacion',
    'final',
  );
  await expect.poll(() => page.getByTestId('animacion-js').evaluate(
    (elemento) => elemento.getAnimations().length,
  )).toBe(0);

  const estiloCss = await page.getByTestId('animacion-css').evaluate((elemento) => {
    const estilo = getComputedStyle(elemento);
    return { animationName: estilo.animationName, transform: estilo.transform };
  });
  expect(estiloCss).toEqual({ animationName: 'none', transform: 'none' });
});
