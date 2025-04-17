import { Component, OnInit } from '@angular/core';
import { FreelanceService, Freelance } from 'src/app/services/freelance.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-freelance',
  standalone: true,
  templateUrl: './freelance.component.html',
  styleUrls: ['./freelance.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class FreelanceComponent implements OnInit {
  freelances: Freelance[] = [];
  filteredFreelances: Freelance[] = [];
  newFreelance: Partial<Freelance> = { nom: '', email: '', tarifHoraire: 0 };
  isFormVisible = false;
  editingFreelance: Freelance | null = null;
// Propriétés du chatbot
messages: { sender: 'user' | 'bot'; text: string }[] = [];
userMessage: string = '';
isTyping: boolean = false;
suggestions: string[] = [];

  filterMin = 0;
  filterMax = 0;
  sortOrder: 'asc' | 'desc' | '' = '';



  constructor(private freelanceService: FreelanceService) {}

  ngOnInit(): void {
    this.loadFreelances();
  }

  loadFreelances(): void {
    this.freelanceService.getFreelances().subscribe(data => {
      this.freelances = data;
      this.filteredFreelances = data;
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.newFreelance = { nom: '', email: '', tarifHoraire: 0 };
      this.editingFreelance = null;
    }
  }

  addOrUpdateFreelance(): void {
    if (this.editingFreelance) {
      const updatedFreelance: Freelance = {
        id: this.editingFreelance.id,
        ...this.newFreelance
      } as Freelance;
      this.freelanceService.updateFreelance(updatedFreelance).subscribe(() => {
        this.loadFreelances();
        this.toggleForm();
      });
    } else {
      const freelanceToAdd: Freelance = {
        id: 0,
        ...this.newFreelance
      } as Freelance;
      this.freelanceService.addFreelance(freelanceToAdd).subscribe(() => {
        this.loadFreelances();
        this.toggleForm();
      });
    }
  }

  editFreelance(f: Freelance): void {
    this.editingFreelance = { ...f };
    this.newFreelance = {
      nom: f.nom,
      email: f.email,
      tarifHoraire: f.tarifHoraire
    };
    this.isFormVisible = true;
  }

  deleteFreelance(id: number): void {
    this.freelanceService.deleteFreelance(id).subscribe(() => {
      this.loadFreelances();
    });
  }

  applyFilter(): void {
    if (this.filterMin && this.filterMax) {
      this.freelanceService.getFreelancesByTarif(this.filterMin, this.filterMax).subscribe(data => {
        this.filteredFreelances = data;
      });
    }
  }

  clearFilter(): void {
    this.filterMin = 0;
    this.filterMax = 0;
    this.filteredFreelances = this.freelances;
  }

  sortByTarif(order: 'asc' | 'desc'): void {
    this.sortOrder = order;
    this.freelanceService.getFreelancesSortedByTarif(order).subscribe(data => {
      this.filteredFreelances = data;
    });
  }

  sendMessage(): void {
    if (this.userMessage.trim()) {
      const msg = this.userMessage;
      this.messages.push({ sender: 'user', text: msg });
      this.userMessage = '';
      this.suggestions = [];
      this.isTyping = true;
  
      setTimeout(() => {
        const botReply = this.generateBotReply(msg);
        this.messages.push({ sender: 'bot', text: botReply.text });
        this.suggestions = botReply.suggestions || [];
        this.isTyping = false;
      }, 1000);
    }
  }
  

  generateBotReply(userInput: string): { text: string, suggestions?: string[] } {
    const lower = userInput.toLowerCase();
  
    if (lower.includes('bonjour') || lower.includes('salut')) {
      return {
        text: "Bonjour ! Que souhaitez-vous faire ?",
        suggestions: ['Afficher freelances', 'Ajouter un freelance', 'Trier par tarif']
      };
    } else if (lower.includes('ajouter') || lower.includes('freelance')) {
      return {
        text: "Cliquez sur '+ Add New Freelance' pour ajouter un nouveau freelance.",
        suggestions: ['Trier par tarif', 'Filtrer les freelances']
      };
    } else if (lower.includes('aide')) {
      return {
        text: "Je peux vous aider à gérer les freelances (ajout, édition, suppression, tri, filtre).",
        suggestions: ['Ajouter freelance', 'Afficher tous', 'Filtrer']
      };
    } else if (lower.includes('trier')) {
      return {
        text: "Souhaitez-vous trier par tarif croissant ou décroissant ?",
        suggestions: ['Trier ↑', 'Trier ↓']
      };
    } else {
      return {
        text: "Désolé, je n’ai pas compris. Essayez par exemple : « afficher freelances ».",
        suggestions: ['Afficher freelances', 'Ajouter freelance', 'Aide']
      };
    }
  }
handleSuggestion(suggestion: string): void {
  this.userMessage = suggestion;
  this.sendMessage();
}
  
}
