export enum UserRole {
  MASTER = 'MASTER',
  THERAPIST = 'THERAPIST',
  ADMIN = 'ADMIN',
}

export enum Permission {
  FINANCIAL_CONTROL = 'FINANCIAL_CONTROL',
  MANAGE_THERAPISTS = 'MANAGE_THERAPISTS',
  MANAGE_SCHEDULE = 'MANAGE_SCHEDULE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  dateOfBirth: string;
  role: UserRole;
  permissions?: Permission[];
  avatarUrl: string | null;
  councilType?: string;
  councilNumber?: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  dateOfBirth: string;
  guardianName: string;
  contact: string;
  avatarUrl: string | null;
  type: 'infantil' | 'adulto';
  address?: string;
  email?: string;
  guardianCpf?: string;
}

export enum AppointmentRecurrence {
  NONE = 'NONE',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum BillingType {
  PER_SESSION = 'PER_SESSION',
  MONTHLY = 'MONTHLY',
}

export interface Appointment {
  id: string;
  patientId: string;
  therapistId: string;
  start: Date;
  end: Date;
  title: string;
  recurrence: AppointmentRecurrence;
  billing: {
    type: BillingType;
    amount: number;
    paid: boolean;
  };
}

export interface Evolution {
  id: string;
  patientId: string;
  therapistId: string;
  date: Date;
  isInternal: boolean;
  content: string;
}

export interface ChatMessage {
  id: string;
  patientId: string;
  senderId: string; // Can be a user ID or 'patient'
  receiverId: string; // Can be a user ID or 'patient'
  timestamp: Date;
  content: string;
  isInternal: boolean;
}

export interface FinancialRecord {
    id: string;
    patientId: string;
    appointmentId?: string;
    description: string;
    amount: number;
    date: Date;
    type: 'income' | 'expense';
}

export interface Document {
  id: string;
  patientId: string;
  uploadedBy: string; // therapistId
  fileName: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'other';
  uploadDate: Date;
  url: string; // In a real app, this would be a URL to the stored file
}

export interface ClinicSettings {
    name: string;
    logoUrl: string | null;
    therapistQuota: number;
    adminQuota: number;
}