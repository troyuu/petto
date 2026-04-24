export type PetType = 'dog' | 'cat' | 'other';
export type Sex = 'male' | 'female' | 'unknown';
export type FoodType = 'wet' | 'dry' | 'raw' | 'homemade' | 'treats';
export type PortionUnit = 'grams' | 'cups' | 'pieces';
export type WeightUnit = 'kg' | 'lbs';
export type MedicationFrequency = 'daily' | 'twice_daily' | 'weekly' | 'monthly' | 'custom';
export type MedicationLogStatus = 'given' | 'skipped' | 'pending';
export type VetVisitPurpose = 'checkup' | 'vaccination' | 'emergency' | 'surgery' | 'grooming' | 'other';
export type ExpenseCategory = 'food' | 'vet_bills' | 'grooming' | 'accessories' | 'medication' | 'insurance' | 'other';
export type ReminderType = 'feeding' | 'medication' | 'vet_visit' | 'vaccination' | 'general';
export type RepeatPattern = 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Pet {
  id: string;
  name: string;
  petType: PetType;
  breed: string | null;
  birthday: string | null;
  sex: Sex;
  color: string | null;
  weight: number | null;
  weightUnit: WeightUnit;
  microchipNumber: string | null;
  photoUri: string | null;
  ownerName: string | null;
  ownerContact: string | null;
  allergies: string[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Feeding {
  id: string;
  petId: string;
  foodType: FoodType;
  foodBrand: string | null;
  portionSize: number | null;
  portionUnit: PortionUnit;
  notes: string | null;
  fedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface VetVisit {
  id: string;
  petId: string;
  purpose: VetVisitPurpose;
  clinicName: string | null;
  vetName: string | null;
  visitDate: string;
  notes: string | null;
  cost: number | null;
  currency: string;
  photoUris: string[];
  nextVisitDate: string | null;
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  vetVisitId: string | null;
  name: string;
  dateAdministered: string;
  batchNumber: string | null;
  nextDueDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string | null;
  frequency: MedicationFrequency;
  customFrequencyDays: number | null;
  timeOfDay: string[];
  startDate: string;
  endDate: string | null;
  isDeworming: boolean;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  petId: string;
  status: MedicationLogStatus;
  scheduledAt: string;
  loggedAt: string | null;
  notes: string | null;
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  petId: string;
  weight: number;
  unit: WeightUnit;
  measuredAt: string;
  notes: string | null;
  createdAt: string;
}

export interface Expense {
  id: string;
  petId: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  description: string | null;
  expenseDate: string;
  notes: string | null;
  receiptUri: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  petId: string;
  type: ReminderType;
  referenceId: string | null;
  title: string;
  body: string | null;
  scheduledAt: string;
  notifeeId: string | null;
  repeatPattern: RepeatPattern;
  customIntervalDays: number | null;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}
