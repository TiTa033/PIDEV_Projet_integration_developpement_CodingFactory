export interface Evaluation {
    idEvaluation?: number;
    sujet: string;
    note: number | null;
    dateEvaluation: Date; 
    location: string;
    latitude?: number;
    longitude?: number;
}