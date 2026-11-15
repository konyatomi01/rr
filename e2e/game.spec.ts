import { Browser, expect, Page, test } from '@playwright/test';

async function newPlayer(browser: Browser, name: string, path = '/'): Promise<Page> {
  const page = await (await browser.newContext()).newPage();
  await page.goto(path);
  await page.locator('#name').fill(name);
  await page.getByRole('button', { name: 'PLAY' }).click();
  await expect(page.getByText('JOIN GAME!')).toBeVisible();
  return page;
}

async function hostParty(browser: Browser): Promise<{ host: Page; code: string }> {
  const host = await newPlayer(browser, 'Host');
  await host.getByRole('button', { name: 'CREATE PARTY' }).click();
  await host.waitForURL(/\/party\/\d{6}$/);
  return { host, code: host.url().match(/party\/(\d{6})/)![1] };
}

async function joinWithLink(browser: Browser, code: string, name = 'Guest'): Promise<Page> {
  const guest = await newPlayer(browser, name, `/join/${code}`);
  await expect(guest.locator('#code')).toHaveValue(code);
  await guest.getByRole('button', { name: 'JOIN', exact: true }).click();
  await guest.waitForURL(`**/party/${code}`);
  return guest;
}

/** Proposes the first chart playlist with fast rounds. */
async function proposeGame(host: Page, rounds: number): Promise<void> {
  await host.locator('.pl-button').first().click();
  await expect(host.getByText('GAME SETTINGS')).toBeVisible();
  for (let i = 3; i > rounds; i--) await host.getByLabel('Fewer rounds').click();
  await host.locator('mat-button-toggle', { hasText: 'Fast' }).click();
  await host.locator('mat-dialog-actions').getByRole('button', { name: 'Start' }).click();
}

test('a full game: invite link, server-checked answers, results and play again', async ({ browser }) => {
  const { host, code } = await hostParty(browser);
  const guest = await joinWithLink(browser, code);

  await proposeGame(host, 1);
  await expect(guest.getByText('Host wants to play:')).toBeVisible();
  await guest.getByRole('button', { name: 'Accept' }).click();

  for (const page of [host, guest]) {
    await page.waitForURL('**/game');
    await expect(page.locator('.rr-answer')).toHaveCount(4, { timeout: 30_000 });
  }
  await host.locator('.rr-answer').first().click();
  await expect(host.locator('.feedback')).toHaveText(/Correct!|Wrong answer!/);
  await expect(host.locator('.rr-answer.right')).toHaveCount(1);
  await expect(host.locator('.rr-answer.picked')).toHaveCount(1);

  // The guest doesn't answer: the round times out for them.
  await expect(guest.locator('.feedback')).toHaveText(/Time is up!/, { timeout: 15_000 });
  await expect(guest.locator('rr-round-over')).toBeVisible();

  await host.waitForURL('**/results', { timeout: 30_000 });
  await expect(host.locator('h1')).toHaveText(/wins!|tie!/);
  await expect(host.getByText('All rounds have been played.')).toBeVisible();
  await host.getByRole('button', { name: 'Play again!' }).click();
  await host.waitForURL(`**/party/${code}`);
});

test('reloading during a round restores the game', async ({ browser }) => {
  const { host, code } = await hostParty(browser);
  const guest = await joinWithLink(browser, code);
  await proposeGame(host, 2);
  await guest.getByRole('button', { name: 'Accept' }).click();
  await expect(guest.locator('.rr-answer')).toHaveCount(4, { timeout: 30_000 });

  await guest.reload();
  await expect(guest).toHaveURL(new RegExp(`/party/${code}/game$`));
  await expect(guest.getByText(/Rounds: \d\/2/)).toBeVisible();
  await expect(guest.locator('.rr-answer, rr-round-over').first()).toBeVisible();
});

test('the back button asks before leaving the party', async ({ browser }) => {
  const { host, code } = await hostParty(browser);

  await host.goBack();
  await expect(host.getByText('Leave the party?')).toBeVisible();
  await host.getByRole('button', { name: 'Stay' }).click();
  await expect(host).toHaveURL(new RegExp(`/party/${code}$`));

  await host.goBack();
  await host.getByRole('button', { name: 'Leave' }).click();
  await expect(host).toHaveURL(/\/$/);
  await expect(host.getByText('SELECT YOUR AVATAR:')).toBeVisible();
});

test('nobody can join a game that is already running', async ({ browser }) => {
  const { host, code } = await hostParty(browser);
  await proposeGame(host, 3); // alone: starts right away
  await host.waitForURL('**/game');

  const late = await newPlayer(browser, 'Late', `/join/${code}`);
  await late.getByRole('button', { name: 'JOIN', exact: true }).click();
  await expect(late.getByText(/game is in progress/)).toBeVisible();
  await expect(late).toHaveURL(new RegExp(`/join/${code}$`));
});

test('a kicked player is sent back to the start', async ({ browser }) => {
  const { host, code } = await hostParty(browser);
  const guest = await joinWithLink(browser, code);

  await host.getByLabel('Show the players').click();
  await host.getByLabel('Kick Guest').click();
  await host.getByRole('button', { name: 'Kick', exact: true }).click();

  await expect(guest.getByText('You were removed from the party.')).toBeVisible();
  await expect(guest).toHaveURL(/\/$/);
  await expect(host.locator('.player')).toHaveCount(1);
});
