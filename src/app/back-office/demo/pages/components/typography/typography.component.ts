import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/back-office/demo/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Router } from '@angular/router';
import { Stage, Statut, TypeStage, Technologie } from 'src/stage';
import { StageService } from 'src/stage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-typography',
  standalone:true,

  imports: [SharedModule,CommonModule],
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export default class TypographyComponent {

  stageForm: FormGroup;
  stages: Stage[] = [];
  isEditMode = false; // Ajout de cette variable

  statutList = Object.values(Statut);
  typeStageList = Object.values(TypeStage);
  technologieList = Object.values(Technologie);
  selectedStage: Stage | null = null;

  constructor(
    private stageService: StageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.stageForm = this.fb.group({
      sujet: ['', [Validators.required, Validators.minLength(5)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      statut: ['', Validators.required],
      typeStage: ['', Validators.required],
      nomEntreprise: ['', [Validators.required, Validators.minLength(3)]],
      encadrantNom: ['', Validators.required],
      etudiantNom: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.getStages();
  }

  private getStages() {
    this.stageService.getStagesList().subscribe({
      next: (data) => (this.stages = data),
      error: (err) => console.error('Erreur lors du chargement des stages :', err)
    });
  }

  addStage() {
    if (this.stageForm.invalid) {
      console.warn('Formulaire invalide !', this.stageForm.errors);
      return;
    }

    const newStage: Stage = this.stageForm.value;
    console.log('Envoi des données :', newStage);

    this.stageService.CreateStage(newStage).subscribe({
      next: (data) => {
        console.log('Stage ajouté :', data);
        this.stages.push(data);
        this.stageForm.reset();
        this.isEditMode = false; // Réinitialisation du mode édition
      },
      error: (err) => console.error('Erreur lors de l\'ajout du stage :', err)
    });
  }

  updateStage(): void {
    if (this.stageForm.valid && this.selectedStage) {
      const updatedStage: Stage = {
        id: this.selectedStage.id,
        ...this.stageForm.value
      };

      this.stageService.updateStage(updatedStage).subscribe({
        next: (data: Stage) => {
          console.log('Stage mis à jour:', data);
          const index = this.stages.findIndex((stage) => stage.id === updatedStage.id);
          if (index !== -1) {
            this.stages[index] = data;
          }
          this.isEditMode = false; // Sortie du mode édition après la mise à jour
          this.stageForm.reset();
          this.selectedStage = null;
        },
        error: (err) => console.error('Erreur lors de la mise à jour du stage :', err)
      });
    }
  }

  deleteStage(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID du stage est undefined');
      return;
    }

    this.stageService.deleteStage(id).subscribe(
      () => {
        console.log('Stage supprimé');
        this.getStages();
      },
      (error) => console.error('Erreur lors de la suppression du stage:', error)
    );
  }

  toggleTech(tech: Technologie) {
    const selectedTechs = this.stageForm.value.technologies || [];
    const updatedTechs = selectedTechs.includes(tech)
      ? selectedTechs.filter((t: Technologie) => t !== tech)
      : [...selectedTechs, tech];

    this.stageForm.patchValue({ technologies: updatedTechs });
  }

  selectStageForUpdate(stage: Stage) {
    this.selectedStage = stage;
    this.isEditMode = true; // Activation du mode édition
    this.stageForm.patchValue({
      sujet: stage.sujet,
      dateDebut: stage.dateDebut,
      dateFin: stage.dateFin,
      statut: stage.statut,
      nomEntreprise: stage.nomEntreprise,
      encadrantNom: stage.encadrantNom,
      etudiantNom: stage.etudiantNom,
      typeStage: stage.typeStage,
      technologies: stage.technologies,
      description: stage.description
    });
  }

  cancelEdit() {
    this.isEditMode = false;
    this.selectedStage = null;
    this.stageForm.reset();
  }
}
