import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private currencySubject = new BehaviorSubject<string>('');
  currency$ = this.currencySubject.asObservable();

  constructor(private http: HttpClient) { }

  getUserIP() {
    return this.http.get('https://api.ipify.org?format=json');
  }

  getLocation(ip: string): Observable<any> {
    return this.http.get(`https://api.ipapi.com/${ip}?access_key=${environment.ipapiKey}`)
  }
}
