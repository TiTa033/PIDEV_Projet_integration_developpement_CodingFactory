import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { Evaluation } from 'src/app/models/evaluation';
import { CalendarOptions, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { latLng, tileLayer, marker, Marker, Map, icon, LatLngBounds } from 'leaflet';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, AfterViewInit {
  evaluations: Evaluation[] = [];
  upcomingEvaluations: Evaluation[] = [];
  completedEvaluations: Evaluation[] = [];
  selectedEvaluation: Evaluation | null = null;
  reviewSchedule: any[] = [];

  private evaluationService = inject(EvaluationService);
  private router = inject(Router);

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    editable: true,
    eventDrop: this.handleEventDrop.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: [],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    eventClassNames: this.getEventClassNames.bind(this)
  };

  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    ],
    zoom: 10
  };

  markers: Marker[] = [];
  map: Map | null = null;

  ngOnInit() {
    this.loadEvaluations();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = new Map('map').setView([36.8065, 10.1815], 10);
    this.mapOptions.layers[0].addTo(this.map);
  }

  loadEvaluations(): void {
    // Load each type separately
    forkJoin([
      this.evaluationService.getAllEvaluations(),
      this.evaluationService.getUpcomingEvaluations(),
      this.evaluationService.getCompletedEvaluations()
    ]).subscribe(([allEvals, upcomingEvals, completedEvals]) => {
      this.evaluations = allEvals.map(evaluation => ({
        ...evaluation,
        dateEvaluation: evaluation.dateEvaluation instanceof Date ? evaluation.dateEvaluation : new Date(evaluation.dateEvaluation),
        latitude: evaluation.latitude ?? 36.8065 + (Math.random() * 0.1 - 0.05),
        longitude: evaluation.longitude ?? 10.1815 + (Math.random() * 0.1 - 0.05),
        location: evaluation.location || 'Non spécifié',
        note: evaluation.note ?? null
      }));

      this.upcomingEvaluations = upcomingEvals.map(e => ({
        ...e,
        dateEvaluation: e.dateEvaluation instanceof Date ? e.dateEvaluation : new Date(e.dateEvaluation)
      }));

      this.completedEvaluations = completedEvals.map(e => ({
        ...e,
        dateEvaluation: e.dateEvaluation instanceof Date ? e.dateEvaluation : new Date(e.dateEvaluation)
      }));

      this.updateCalendarEvents();
      this.updateMapMarkers();
    });
  }

  getSafeDate(date: Date | string): Date {
    return date instanceof Date ? date : new Date(date);
  }

  updateUpcomingEvaluations(): void {
    const today = new Date();
    this.upcomingEvaluations = this.evaluations
      .filter(e => {
        const evalDate = this.getSafeDate(e.dateEvaluation);
        return evalDate >= today && e.note === null;
      })
      .sort((a, b) => a.dateEvaluation.getTime() - b.dateEvaluation.getTime());
  }

  updateCompletedEvaluations(): void {
    const today = new Date();
    this.completedEvaluations = this.evaluations
      .filter(e => {
        const evalDate = this.getSafeDate(e.dateEvaluation);
        return (evalDate < today || e.note !== null);
      })
      .sort((a, b) => b.dateEvaluation.getTime() - a.dateEvaluation.getTime());
  }

  getEventClassNames(arg: any): string[] {
    const evaluation = this.evaluations.find(e => e.idEvaluation === Number(arg.event.id));
    if (!evaluation) return [];

    const classes = [];
    if (evaluation.note !== null) {
      if (evaluation.note >= 15) classes.push('high-score-event');
      else if (evaluation.note >= 10) classes.push('medium-score-event');
      else classes.push('low-score-event');
    } else {
      classes.push('upcoming-event');
    }

    return classes;
  }

  updateCalendarEvents(): void {
    this.calendarOptions.events = this.evaluations.map(evaluation => ({
      id: String(evaluation.idEvaluation),
      title: `${evaluation.sujet}`,
      date: evaluation.dateEvaluation.toISOString().split('T')[0],
      extendedProps: {
        note: evaluation.note,
        location: evaluation.location
      }
    }));
  }

  updateMapMarkers(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const defaultIcon = icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Only show upcoming evaluations on the map
    this.upcomingEvaluations.forEach(evaluation => {
      if (evaluation.latitude && evaluation.longitude) {
        const newMarker = marker([evaluation.latitude, evaluation.longitude], {
          icon: defaultIcon
        })
          .bindPopup(`
          <strong>${evaluation.sujet}</strong><br>
          Lieu: ${evaluation.location}<br>
          Date: ${this.getSafeDate(evaluation.dateEvaluation).toLocaleDateString()}
        `)
          .addTo(this.map!);

        this.markers.push(newMarker);
      }
    });

    if (this.markers.length > 0) {
      const bounds = new LatLngBounds(
        this.markers.map(m => m.getLatLng())
      );
      this.map!.fitBounds(bounds, { padding: [50, 50] });
    } else if (this.map) {
      this.map.setView([36.8065, 10.1815], 10);
    }
  }

  handleEventDrop(eventDropInfo: EventDropArg): void {
    const eventId = Number(eventDropInfo.event.id);
    const newDate = eventDropInfo.event.start;

    if (!newDate) return;

    const updatedEvaluation = this.evaluations.find(e => e.idEvaluation === eventId);
    if (updatedEvaluation) {
      updatedEvaluation.dateEvaluation = newDate;
      this.evaluationService.updateEvaluation(updatedEvaluation).subscribe({
        next: () => {
          this.updateUpcomingEvaluations();
          this.updateCompletedEvaluations();
          this.updateMapMarkers();
        },
        error: () => {
          alert("Erreur lors de la mise à jour de l'évaluation !");
          eventDropInfo.revert();
        }
      });
    }
  }

  handleEventClick(eventClickInfo: EventClickArg): void {
    const eventId = Number(eventClickInfo.event.id);
    const evaluation = this.evaluations.find(e => e.idEvaluation === eventId);

    if (evaluation) {
      eventClickInfo.jsEvent.preventDefault();
      this.selectedEvaluation = evaluation;
    }
  }

  closeModal(): void {
    this.selectedEvaluation = null;
  }
}
