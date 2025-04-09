import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { Evaluation } from 'src/app/models/evaluation';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {
  evaluations: Evaluation[] = [];
  editingEvaluation: Evaluation | null = null;
  newEvaluation: Evaluation = {
    sujet: '',
    note: 0,
    dateEvaluation: new Date()
  };

  private evaluationService = inject(EvaluationService);

  ngOnInit(): void {
    this.getEvaluations();
  }

  getEvaluations() {
    this.evaluationService.getAllEvaluations().subscribe((data) => {
      this.evaluations = data;
    });
  }

  addEvaluation() {
    if (!this.newEvaluation.sujet || this.newEvaluation.note < 0) {
      alert("Sujet is required and note must be positive.");
      return;
    }

    this.evaluationService.addEvaluation(this.newEvaluation).subscribe(() => {
      this.getEvaluations();
      this.newEvaluation = { sujet: '', note: 0, dateEvaluation: new Date() };
    });
  }

  deleteEvaluation(idEvaluation?: number) {
    if (!idEvaluation) return;

    this.evaluationService.deleteEvaluation(idEvaluation).subscribe(() => {
      this.getEvaluations();
    });
  }

  editEvaluation(evaluation: Evaluation) {
    this.editingEvaluation = { ...evaluation }; // Copy object for editing
  }

  updateEvaluation() {
    if (!this.editingEvaluation) return;

    this.evaluationService.updateEvaluation(this.editingEvaluation).subscribe(() => {
      this.getEvaluations();
      this.editingEvaluation = null;
    });
  }

  cancelEdit() {
    this.editingEvaluation = null;
  }
}
