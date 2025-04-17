// src/app/services/chatbot.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  sendMessage(message: string): Observable<string> {
    const lower = message.toLowerCase();
    let response = "Je n'ai pas compris, peux-tu reformuler ?";

    if (lower.includes('bonjour') || lower.includes('salut')) {
      response = 'Bonjour ! Comment puis-je t’aider aujourd’hui ? 😊';
    } else if (lower.includes('freelance')) {
      response = 'Tu peux ajouter, modifier ou supprimer un freelance. Que veux-tu faire ?';
    } else if (lower.includes('ajouter')) {
      response = 'Clique sur "+ Add New Freelance" pour ajouter un freelance.';
    } else if (lower.includes('aide')) {
      response = 'Bien sûr, je peux t’aider à filtrer, trier ou gérer les freelances.';
    } else if (lower.includes('merci')) {
      response = 'Avec plaisir ! 😄';
    }

    return of(response).pipe(delay(1000)); // Simule un délai de réponse
  }
}
