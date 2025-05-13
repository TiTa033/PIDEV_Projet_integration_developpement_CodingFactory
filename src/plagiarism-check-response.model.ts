// src/app/models/plagiarism-check-response.model.ts

export interface PlagiarismCheckResponse {
    overallScore: number; 
    imageScore: number;   
    textScore: number;    
    message: string;      
  }