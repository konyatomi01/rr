import { isDevMode } from '@angular/core';

/**
 * Game server (socket.io). `ng serve` (dev mode) talks to a local server started with `npm run dev`.
 */
export const SERVER_URL = isDevMode() ? 'http://localhost:3000' : 'https://rhythm-royale.onrender.com';
