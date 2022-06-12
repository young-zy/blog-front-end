import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, NgModule, SecurityContext } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { QuestionBoxModule } from './question-box/question-box.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MarkdownModule } from 'ngx-markdown';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TokenInterceptorService } from './common/interceptor/token-interceptor.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { RECAPTCHA_BASE_URL, RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { UploadAvatarComponent } from './upload-avatar/upload-avatar.component';
import { FooterComponent } from './footer/footer.component';
import { concat, first, interval } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginDialogComponent,
    NotFoundComponent,
    UploadAvatarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QuestionBoxModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatRadioModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaV3Module,
    // using specific option with FactoryProvider
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE
    }),
    FlexLayoutModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptchaSiteKey
    },
    {
      provide: RECAPTCHA_BASE_URL,
      useValue: 'https://recaptcha.net/recaptcha/api.js',
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private appRef: ApplicationRef,
    private updates: SwUpdate
  ) {
    updates.versionUpdates.subscribe(event => {
      switch (event.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${event.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${event.currentVersion.hash}`);
          console.log(`New app version ready for use: ${event.latestVersion.hash}`);
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${event.version.hash}': ${event.error}`);
          break;
      }
    });
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());
  }
}
