export interface PetRow {
  id: string;
  name: string;
  pet_type: string;
  breed: string | null;
  birthday: string | null;
  sex: string;
  color: string | null;
  weight: number | null;
  weight_unit: string;
  microchip_number: string | null;
  photo_uri: string | null;
  owner_name: string | null;
  owner_contact: string | null;
  allergies: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeedingRow {
  id: string;
  pet_id: string;
  food_type: string;
  food_brand: string | null;
  portion_size: number | null;
  portion_unit: string;
  notes: string | null;
  fed_at: string;
  created_at: string;
  updated_at: string;
}

export interface VetVisitRow {
  id: string;
  pet_id: string;
  purpose: string;
  clinic_name: string | null;
  vet_name: string | null;
  visit_date: string;
  notes: string | null;
  cost: number | null;
  currency: string;
  photo_uris: string;
  next_visit_date: string | null;
  reminder_enabled: number;
  created_at: string;
  updated_at: string;
}

export interface VaccinationRow {
  id: string;
  pet_id: string;
  vet_visit_id: string | null;
  name: string;
  date_administered: string;
  batch_number: string | null;
  next_due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicationRow {
  id: string;
  pet_id: string;
  name: string;
  dosage: string | null;
  frequency: string;
  custom_frequency_days: number | null;
  time_of_day: string;
  start_date: string;
  end_date: string | null;
  is_deworming: number;
  is_active: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicationLogRow {
  id: string;
  medication_id: string;
  pet_id: string;
  status: string;
  scheduled_at: string;
  logged_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface WeightEntryRow {
  id: string;
  pet_id: string;
  weight: number;
  unit: string;
  measured_at: string;
  notes: string | null;
  created_at: string;
}

export interface ExpenseRow {
  id: string;
  pet_id: string;
  category: string;
  amount: number;
  currency: string;
  description: string | null;
  expense_date: string;
  notes: string | null;
  receipt_uri: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReminderRow {
  id: string;
  pet_id: string;
  type: string;
  reference_id: string | null;
  title: string;
  body: string | null;
  scheduled_at: string;
  notifee_id: string | null;
  repeat_pattern: string;
  custom_interval_days: number | null;
  is_complete: number;
  created_at: string;
  updated_at: string;
}
