import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private static readonly CountryCodeKey = 'country_code';

  private currencySubject = new BehaviorSubject<string>('');
  currency$ = this.currencySubject.asObservable();

  constructor(private http: HttpClient) {}

  getTwoLetterCountryCode() {
    const cachedCountryCode = this.getCachedCountryCode();

    if (cachedCountryCode) {
      return of(cachedCountryCode);
    }

    return this.getUserIP().pipe(
      catchError(() => {
        return of({ ip: 'EUROPE' });
      }),
      switchMap((response: any) => {
        return this.getLocation(response.ip).pipe(
          catchError(() => {
            return of({ country_code: 'SE' });
          })
        );
      }),
      tap(({ country_code }) => {
        this.setCachedCountryCode(country_code);
      }),
      map(({ country_code }) => country_code)
    );
  }

  getUserIP() {
    return this.http.get('https://api.ipify.org?format=json');
  }

  getLocation(ip: string): Observable<any> {
    return this.http.get(
      `https://api.ipapi.com/${ip}?access_key=${environment.ipapiKey}`
    );
  }

  private getCachedCountryCode(): string | null {
    const json = localStorage.getItem(LocationService.CountryCodeKey);

    if (!json) {
      return null;
    }

    const item = JSON.parse(json);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(LocationService.CountryCodeKey);
      return null;
    }

    return item.value;
  }

  private setCachedCountryCode(countryCode: string) {
    const now = new Date();
    const json = JSON.stringify({
      value: countryCode,
      expiry: now.getTime(),
    });

    localStorage.setItem(LocationService.CountryCodeKey, json);
  }
}
