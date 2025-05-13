import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeteoService {
  private apiKey: string = 'a1a3228144677aa3eafa968a72a891e2'; // Replace with your OpenWeather API key
  private apiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const params = new HttpParams().set('q', city).set('appid', this.apiKey).set('units', 'metric');
    return this.http.get<any>(this.apiUrl, { params });
  }
}