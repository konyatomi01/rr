import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideSocketIo } from 'ngx-socket-io';
import { SERVER_URL } from './server-url';
import { ServerService } from './services/server.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideSocketIo({ url: SERVER_URL, options: {} }),
    // Connect to the game server (and attempt session reconnect) as soon as the app starts,
    // regardless of which screen is restored.
    provideAppInitializer(() => {
      inject(ServerService);
    }),
  ],
};
