import { enableProdMode, importProvidersFrom, provideZoneChangeDetection, SecurityContext } from '@angular/core';

import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptorService } from './app/common/interceptor/token-interceptor.service';
import { MarkdownModule, SANITIZE } from 'ngx-markdown';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    importProvidersFrom(
      HttpClientModule,
      RouterModule.forRoot(routes),
      ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
      MatSnackBarModule,
      BrowserAnimationsModule,
      // using specific option with FactoryProvider
      MarkdownModule.forRoot({
        sanitize: { provide: SANITIZE, useValue: SecurityContext.NONE }
      })
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
  ]
})
  .catch(err => console.log(err));
