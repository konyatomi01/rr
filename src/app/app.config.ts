import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideSocketIo } from 'ngx-socket-io';
import { ServerService } from './services/server.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideSocketIo({ url: 'https://rhythm-royale.onrender.com', options: {} }),
    // Connect to the game server (and attempt session reconnect) as soon as the app starts,
    // regardless of which screen is restored.
    provideAppInitializer(() => {
      inject(ServerService);
    }),
  ],
};
