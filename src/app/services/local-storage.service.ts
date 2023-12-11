import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  get<TValue>(key: string): TValue | null {
    const json = localStorage.getItem(key);

    if (!json) {
      return null;
    }

    const item = JSON.parse(json);
    const now = new Date();

    if (item.expiry && now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value as TValue;
  }

  set<TValue>(key: string, value: TValue, expiryMinutes?: number): void {
    const now = new Date();
    const expiry = expiryMinutes
      ? now.getTime() + expiryMinutes * 60_000
      : undefined;

    const json = JSON.stringify({
      value,
      expiry,
    });

    localStorage.setItem(key, json);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
