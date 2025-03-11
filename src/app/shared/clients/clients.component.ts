import { Component, OnInit, inject } from '@angular/core';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { Evaluation } from 'src/app/models/evaluation';
import { CalendarOptions, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';  
import interactionPlugin from '@fullcalendar/interaction';  

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];
  showFiltered: boolean = false;

  private evaluationService = inject(EvaluationService);

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    editable: true, 
    eventDrop: this.handleEventDrop.bind(this), 
    eventClick: this.handleEventClick.bind(this), 
    events: []  
  };

  ngOnInit(): void {
    this.getEvaluations();
  }

  getEvaluations() {
    this.evaluationService.getAllEvaluations().subscribe((data: Evaluation[]) => {
      this.evaluations = data.map(evaluation => ({
        ...evaluation,
        dateEvaluation: new Date(evaluation.dateEvaluation)
      }));
      this.updateCalendarEvents();
    });
  }

  updateCalendarEvents() {
    this.calendarOptions.events = this.evaluations.map(evaluation => ({
      title: evaluation.sujet,
      date: evaluation.dateEvaluation.toISOString().split('T')[0] 
    }));
  }

  handleEventDrop(eventDropInfo: EventDropArg) {
    const eventId = Number(eventDropInfo.event.id);
    const newDate = eventDropInfo.event.start;

    if (!newDate) return;

    const updatedEvaluation = this.evaluations.find(e => e.idEvaluation === eventId);
    if (updatedEvaluation) {
      updatedEvaluation.dateEvaluation = newDate;

      this.evaluationService.updateEvaluation(updatedEvaluation).subscribe({
        next: () => alert("Évaluation mise à jour avec succès !"),
        error: () => {
          alert("Erreur lors de la mise à jour de l’évaluation !");
          eventDropInfo.revert();
        }
      });
    }
  }

  handleEventClick(eventClickInfo: EventClickArg) {
    const eventId = Number(eventClickInfo.event.id);
    const evaluation = this.evaluations.find(e => e.idEvaluation === eventId);

    if (evaluation) {
      alert(`Détails de l’évaluation:\n\nSujet: ${evaluation.sujet}\nNote: ${evaluation.note}\nDate: ${evaluation.dateEvaluation.toLocaleDateString()}`);
    }
  }

  toggleFilter() {
    this.showFiltered = !this.showFiltered;
    this.filteredEvaluations = this.showFiltered 
      ? this.evaluations.filter(evaluation => evaluation.note > 10) 
      : [];
  }
}