
export type AppView = 'home' | 'login' | 'signup' | 'dashboard' | 'scanner' | 'result';

export interface User {
  fullName: string;
  email: string;
}

export enum DetectionStatus {
  SAFE = 'SAFE',
  PHISHING = 'PHISHING',
  SUSPICIOUS = 'SUSPICIOUS'
}

export interface ScanResult {
  url: string;
  status: DetectionStatus;
  explanation: string;
}
