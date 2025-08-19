import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import '@fortawesome/fontawesome-free/css/all.min.css';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideEnvironmentNgxMask(), provideAnimationsAsync(),
    provideToastr(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
