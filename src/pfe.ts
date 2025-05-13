// src/app/models/pfe.model.ts

export enum Etat {
  EnAttente = 'EnAttente',
  Approuve = 'Approuve',
  Rejete = 'Rejete',
  Finalized = 'Finalized'
}

export interface PfeTask {
  description: string;
  deadline: Date;
  completed: boolean;
}

export interface PfeEvent {
  type: string;
  description: string;
  date: Date;
}

export interface PFE {
  id?: number;
  titre: string;
  description: string;
  dateSoumission?: Date;
  deadline?: Date;
  etat: Etat;
  rapportNom?: string;
  rapportPath?: string;
  imageHashes?: string[];
  overallPlagiarismScore?: number;
  imagePlagiarismScore?: number;
  textPlagiarismScore?: number;
  studentId: number;
  studentName: string;
  tutorId: number;
  tutorName: string;
  tasks: PfeTask[];
  events: PfeEvent[];
}