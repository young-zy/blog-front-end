import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

declare const grecaptcha: {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
};

@Injectable({ providedIn: 'root' })
export class RecaptchaV3Service {
  private scriptLoaded?: Promise<void>;

  execute(action: string): Observable<string> {
    return from(this.loadScript().then(() => new Promise<string>((resolve, reject) => {
      grecaptcha.ready(() => grecaptcha.execute(environment.recaptchaSiteKey, { action }).then(resolve, reject));
    })));
  }

  private loadScript(): Promise<void> {
    if (!this.scriptLoaded) {
      this.scriptLoaded = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://recaptcha.net/recaptcha/api.js?render=${encodeURIComponent(environment.recaptchaSiteKey)}`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
        document.head.appendChild(script);
      });
    }
    return this.scriptLoaded;
  }
}
