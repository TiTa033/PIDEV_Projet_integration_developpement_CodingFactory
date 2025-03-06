import { Component, OnInit } from '@angular/core';
import { FreelanceService } from 'src/app/services/freelance.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Freelance {
  id: number;
  nom: string;
  email: string;
  tarifHoraire: number;
}

@Component({
  selector: 'app-freelance',
  standalone: true,
  templateUrl: './freelance.component.html',
  styleUrls: ['./freelance.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class FreelanceComponent implements OnInit {
  freelances: Freelance[] = []; // Liste des freelances
  newFreelance: Partial<Freelance> = { nom: '', email: '', tarifHoraire: 0 }; // Objet pour formulaire
  isFormVisible = false; // Gérer l'affichage du formulaire
  editingFreelance: Freelance | null = null; // Stocke le freelance en cours d'édition

  constructor(private freelanceService: FreelanceService) {}

  ngOnInit(): void {
    this.loadFreelances();
  }

  loadFreelances(): void {
    this.freelanceService.getFreelances().subscribe((data: Freelance[]) => {
      this.freelances = data;
    });
  }

  toggleForm(): void {
    // Toggle form visibility without scrolling to the top
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.newFreelance = { nom: '', email: '', tarifHoraire: 0 };
      this.editingFreelance = null;
    }
  }

  addOrUpdateFreelance(): void {
    if (this.editingFreelance) {
      // Mise à jour
      const updatedFreelance: Freelance = {
        id: this.editingFreelance.id,
        ...this.newFreelance
      } as Freelance;

      this.freelanceService.updateFreelance(updatedFreelance).subscribe(() => {
        this.loadFreelances();
        this.toggleForm();
      });

    } else {
      // Ajout
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

  editFreelance(freelance: Freelance): void {
    this.editingFreelance = { ...freelance }; // Cloner l'objet
    this.newFreelance = { nom: freelance.nom, email: freelance.email, tarifHoraire: freelance.tarifHoraire };
    this.isFormVisible = true;
  }

  deleteFreelance(id: number): void {
    this.freelanceService.deleteFreelance(id).subscribe(() => {
      this.loadFreelances();
    });
  }
}
