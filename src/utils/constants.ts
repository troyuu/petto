import type { PetType, ExpenseCategory, FoodType, MedicationFrequency, VetVisitPurpose } from './types';

export const DB_NAME = 'petto.db';

export const DEFAULT_CURRENCY = 'PHP';
export const DEFAULT_CURRENCY_SYMBOL = '₱';
export const DEFAULT_WEIGHT_UNIT = 'kg' as const;

export const PET_TYPES: { label: string; value: PetType }[] = [
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
  { label: 'Other', value: 'other' },
];

export const DOG_BREEDS = [
  'Askal (Philippine Native)',
  'Labrador Retriever',
  'Golden Retriever',
  'German Shepherd',
  'Bulldog',
  'Poodle',
  'Beagle',
  'Chihuahua',
  'Dachshund',
  'Siberian Husky',
  'Pomeranian',
  'Shih Tzu',
  'Corgi',
  'Rottweiler',
  'Doberman',
  'Other',
];

export const CAT_BREEDS = [
  'Puspin (Philippine Native)',
  'Persian',
  'Siamese',
  'Maine Coon',
  'British Shorthair',
  'Ragdoll',
  'Bengal',
  'Abyssinian',
  'Scottish Fold',
  'Sphynx',
  'Russian Blue',
  'American Shorthair',
  'Other',
];

export const FOOD_TYPES: { label: string; value: FoodType }[] = [
  { label: 'Dry', value: 'dry' },
  { label: 'Wet', value: 'wet' },
  { label: 'Raw', value: 'raw' },
  { label: 'Homemade', value: 'homemade' },
  { label: 'Treats', value: 'treats' },
];

export const MEDICATION_FREQUENCIES: { label: string; value: MedicationFrequency }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Twice Daily', value: 'twice_daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Custom', value: 'custom' },
];

export const VET_VISIT_PURPOSES: { label: string; value: VetVisitPurpose }[] = [
  { label: 'Checkup', value: 'checkup' },
  { label: 'Vaccination', value: 'vaccination' },
  { label: 'Emergency', value: 'emergency' },
  { label: 'Surgery', value: 'surgery' },
  { label: 'Grooming', value: 'grooming' },
  { label: 'Other', value: 'other' },
];

export const EXPENSE_CATEGORIES: { label: string; value: ExpenseCategory; icon: string }[] = [
  { label: 'Food', value: 'food', icon: 'UtensilsCrossed' },
  { label: 'Vet Bills', value: 'vet_bills', icon: 'Stethoscope' },
  { label: 'Grooming', value: 'grooming', icon: 'Scissors' },
  { label: 'Accessories', value: 'accessories', icon: 'ShoppingBag' },
  { label: 'Medication', value: 'medication', icon: 'Pill' },
  { label: 'Insurance', value: 'insurance', icon: 'Shield' },
  { label: 'Other', value: 'other', icon: 'MoreHorizontal' },
];

export const PORTION_UNITS = [
  { label: 'grams', value: 'grams' as const },
  { label: 'cups', value: 'cups' as const },
  { label: 'pieces', value: 'pieces' as const },
];

export const WEIGHT_UNITS = [
  { label: 'kg', value: 'kg' as const },
  { label: 'lbs', value: 'lbs' as const },
];
