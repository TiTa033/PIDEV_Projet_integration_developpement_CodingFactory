import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private stripeInstance: Stripe | null = null;

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe(environment.stripePublicKey);
    this.initializeStripe();
  }

  private async initializeStripe() {
    this.stripeInstance = await this.stripePromise;
  }

  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<string> {
    const response = await this.http.post<{ clientSecret: string }>(
      `${environment.apiUrl}/api/payments/create-payment-intent`,
      { amount, currency }
    ).toPromise();
    
    return response?.clientSecret || '';
  }

  async processPayment(amount: number, cardElement: any): Promise<{ success: boolean; error?: string }> {
    try {
      const stripe = await this.getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const clientSecret = await this.createPaymentIntent(amount);
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (paymentIntent.status === 'succeeded') {
        return { success: true };
      }

      return { success: false, error: 'Payment failed' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
    }
  }
} 