import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { Evaluation } from 'src/app/models/evaluation';
import { CalendarOptions, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';  
import interactionPlugin from '@fullcalendar/interaction';  
import { latLng, tileLayer, marker, Marker, Map, icon } from 'leaflet';  

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, AfterViewInit {

  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];
  showFiltered: boolean = false;
  selectedEvaluation: Evaluation | null = null;

  private evaluationService = inject(EvaluationService);

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    editable: true, 
    eventDrop: this.handleEventDrop.bind(this), 
    eventClick: this.handleEventClick.bind(this), 
    events: []  
  };

  mapOptions = {
    center: latLng(36.8065, 10.1815),  // Tunis, Tunisia
    zoom: 13,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    ]
  };

  markers: Marker[] = [];
  map: Map | null = null;  

  ngOnInit(): void {
    this.getEvaluations();
  }

  ngAfterViewInit(): void {
    this.map = new Map('map').setView([36.8065, 10.1815], 13); 
    this.mapOptions.layers[0].addTo(this.map);  
  }

  getEvaluations() {
    this.evaluationService.getAllEvaluations().subscribe((data: Evaluation[]) => {
      this.evaluations = data.map(evaluation => ({
        ...evaluation,
        dateEvaluation: new Date(evaluation.dateEvaluation),
        latitude: evaluation.latitude || 36.8065,  
        longitude: evaluation.longitude || 10.1815  
      }));
      this.updateCalendarEvents();
      this.updateMapMarkers();  
      console.log('Evaluations with Coordinates:', this.evaluations);
    });
  }

  updateCalendarEvents() {
    this.calendarOptions.events = this.evaluations.map(evaluation => ({
      id: String(evaluation.idEvaluation),
      title: evaluation.sujet,
      date: evaluation.dateEvaluation.toISOString().split('T')[0]
    }));

    console.log('Calendar Events:', this.calendarOptions.events); 
  }

  updateMapMarkers() {
    this.markers.forEach(m => m.remove()); 
    this.markers = this.evaluations.map(evaluation => {
      const markerObj = marker([evaluation.latitude, evaluation.longitude], {
        icon: icon({
          iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',  
          shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png', 
          iconSize: [25, 41], 
          iconAnchor: [12, 41], 
          popupAnchor: [1, -34], 
          shadowSize: [41, 41] 
        })
      })
        .bindPopup(`<strong>${evaluation.sujet}</strong><br>Note: ${evaluation.note}<br>Date: ${evaluation.dateEvaluation}`)
        .addTo(this.map!); 
      return markerObj;
    });

    if (this.evaluations.length > 0) {
      const firstEval = this.evaluations[0];
      this.map!.setView(latLng(firstEval.latitude, firstEval.longitude), 13);  
    }

    console.log('Markers:', this.markers);  
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
      this.selectedEvaluation = evaluation;
      console.log('Selected Evaluation:', this.selectedEvaluation);
    }
  }

  toggleFilter() {
    this.showFiltered = !this.showFiltered;
    this.filteredEvaluations = this.showFiltered 
      ? this.evaluations.filter(evaluation => evaluation.note > 10) 
      : [];
  }

  closeModal() {
    this.selectedEvaluation = null;
  }
}