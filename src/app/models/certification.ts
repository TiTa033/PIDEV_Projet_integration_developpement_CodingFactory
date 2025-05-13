export interface Certification {
  idCertification?: number;
  nom: string;
  organisme: string;
  dateObtention: string;
  qrCodeBase64?: string;
  expiresIn?: number;  // Nombre de jours avant expiration
  status?: 'valid' | 'expiring' | 'expired';  // Statut de la certification
}