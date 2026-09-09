import { expect, test } from '@playwright/test';

const rutaPrueba = '/__pruebas/pared-sillares';

test('el panel no espera a que termine la salida de la pared', async ({ page }) => {
  await page.goto(`${rutaPrueba}?duracion=1800`);

  const pared = page.getByTestId('pared-espera');
  await expect(page.getByRole('status')).toHaveText(
    'Esperando que el sistema vuelva a estar disponible',
  );

  // Alarga solo la salida para demostrar que la acción no depende de animationend.
  await pared.evaluate((elemento) => {
    elemento.style.setProperty('--pared-duracion-salida', '4000ms');
  });

  await expect(pared).toHaveAttribute('data-estado', 'saliendo');
  await expect(page.getByTestId('panel-listo')).toBeVisible();

  const estiloDuranteSalida = await pared.evaluate((elemento) => {
    const estilo = getComputedStyle(elemento);
    return { opacity: Number(estilo.opacity), visibility: estilo.visibility };
  });
  expect(estiloDuranteSalida.visibility).toBe('visible');
  expect(estiloDuranteSalida.opacity).toBeGreaterThan(0);

  await page.getByRole('button', { name: 'Nueva venta' }).click();
  await expect(page.getByLabel('Acciones ejecutadas')).toHaveText('1');
});

test('movimiento reducido conserva el mensaje y muestra una pared estática', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${rutaPrueba}?duracion=5000`);

  await expect(page.getByRole('status')).toHaveText(
    'Esperando que el sistema vuelva a estar disponible',
  );
  await expect(page.locator('.pared-espera__mensaje')).toBeVisible();

  const estiloSillar = await page.getByTestId('sillar').first().evaluate((elemento) => {
    const estilo = getComputedStyle(elemento);
    return {
      animationName: estilo.animationName,
      opacity: estilo.opacity,
      transform: estilo.transform,
    };
  });
  expect(estiloSillar).toEqual({
    animationName: 'none',
    opacity: '1',
    transform: 'none',
  });
  await expect(page.locator('.pared-espera__polvo').first()).toBeHidden();
});

test('el movimiento continuo se puede detener sin perder el estado', async ({ page }) => {
  await page.goto(`${rutaPrueba}?duracion=5000`);
  await expect(page.getByRole('status')).toBeVisible();

  await page.getByRole('button', { name: 'Detener movimiento' }).click();

  await expect(page.getByRole('status')).toHaveText(
    'Esperando que el sistema vuelva a estar disponible',
  );
  await expect(page.getByRole('button', { name: 'Movimiento detenido' })).toBeDisabled();
  await expect.poll(async () => page.getByTestId('sillar').first().evaluate(
    (elemento) => getComputedStyle(elemento).animationName,
  )).toBe('none');
});

test('un cambio en caliente detiene la caída sin perder el estado', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${rutaPrueba}?duracion=5000`);
  await expect(page.getByRole('status')).toBeVisible();

  await page.emulateMedia({ reducedMotion: 'reduce' });

  await expect(page.getByRole('status')).toHaveText(
    'Esperando que el sistema vuelva a estar disponible',
  );
  await expect.poll(async () => page.getByTestId('sillar').first().evaluate(
    (elemento) => getComputedStyle(elemento).animationName,
  )).toBe('none');
});

test('por debajo de un segundo no aparece ningún indicador', async ({ page }) => {
  await page.goto(`${rutaPrueba}?duracion=400`);

  await expect(page.getByTestId('panel-listo')).toBeVisible();
  await expect(page.getByTestId('pared-espera')).toHaveAttribute('data-estado', 'oculta');
  await expect(page.getByRole('status')).toHaveCount(0);
});
