import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { Evaluation } from 'src/app/models/evaluation';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

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
}
