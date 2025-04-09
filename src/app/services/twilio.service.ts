import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  private apiUrl = 'http://localhost:8089/PIDEV/api/twilio/send-sms';

  constructor(private http: HttpClient) {}

  sendSms(toPhoneNumber: string, messageBody: string) {
    const params = new HttpParams()
      .set('toPhoneNumber', toPhoneNumber)
      .set('messageBody', messageBody);
  
    return this.http.post(this.apiUrl, null, { params, responseType: 'text' });
  }
  
}
