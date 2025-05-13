export enum Statut {
  AVAILABLE = 'AVAILABLE', // Correspond à l'énumération Java
  CLOSED = 'CLOSED'
}

export enum TypeStage {
  COMPANY_IMMERSION_INTERNSHIP = 'COMPANY_IMMERSION_INTERNSHIP', // Correspond à l'énumération Java
  FINAL_YEAR_PROJECT = 'FINAL_YEAR_PROJECT'
}

export enum Technologie {
  JAVA = 'JAVA',
  PYTHON = 'PYTHON',
  JAVASCRIPT = 'JAVASCRIPT',
  SPRING = 'SPRING',
  ANGULAR = 'ANGULAR',
  DOTNET = 'DOTNET'
}

export class Stage {
  id?: number; // Optionnel pour éviter les erreurs d'initialisation
  sujet: string = '';
  dateDebut: string = ''; // Stocké en format `YYYY-MM-DD`
  dateFin: string = '';
  statut: Statut = Statut.AVAILABLE; // Valeur par défaut
  etudiantNom: string = ''; // Récupéré via User-Service
  encadrantNom: string = ''; // Récupéré via User-Service
  nomEntreprise: string = '';
  typeStage: TypeStage = TypeStage.COMPANY_IMMERSION_INTERNSHIP; // Valeur par défaut
  technologies: Technologie[] = []; // Liste des technologies, correspond à l'ElementCollection dans Spring Boot
  description: string = '';
}
