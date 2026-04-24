type ValidationResult = {
  valid: boolean;
  error?: string;
};

export function validateRequired(value: string | null | undefined, fieldName: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
}

export function validateMinLength(value: string, min: number, fieldName: string): ValidationResult {
  if (value.trim().length < min) {
    return { valid: false, error: `${fieldName} must be at least ${min} characters` };
  }
  return { valid: true };
}

export function validateMaxLength(value: string, max: number, fieldName: string): ValidationResult {
  if (value.trim().length > max) {
    return { valid: false, error: `${fieldName} must be at most ${max} characters` };
  }
  return { valid: true };
}

export function validatePositiveNumber(value: number | null | undefined, fieldName: string): ValidationResult {
  if (value == null || isNaN(value) || value <= 0) {
    return { valid: false, error: `${fieldName} must be a positive number` };
  }
  return { valid: true };
}

export function validateNonNegativeNumber(value: number | null | undefined, fieldName: string): ValidationResult {
  if (value == null || isNaN(value) || value < 0) {
    return { valid: false, error: `${fieldName} must be zero or greater` };
  }
  return { valid: true };
}

export function validateDate(value: string | null | undefined, fieldName: string): ValidationResult {
  if (!value) {
    return { valid: false, error: `${fieldName} is required` };
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return { valid: false, error: `${fieldName} is not a valid date` };
  }
  return { valid: true };
}

export function validatePetForm(data: {
  name: string;
  petType: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  const nameResult = validateRequired(data.name, 'Name');
  if (!nameResult.valid) errors.name = nameResult.error!;

  const typeResult = validateRequired(data.petType, 'Pet type');
  if (!typeResult.valid) errors.petType = typeResult.error!;

  return errors;
}

export function validateFeedingForm(data: {
  petId: string;
  foodType: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  const petResult = validateRequired(data.petId, 'Pet');
  if (!petResult.valid) errors.petId = petResult.error!;

  const typeResult = validateRequired(data.foodType, 'Food type');
  if (!typeResult.valid) errors.foodType = typeResult.error!;

  return errors;
}

export function validateExpenseForm(data: {
  petId: string;
  category: string;
  amount: number | null;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  const petResult = validateRequired(data.petId, 'Pet');
  if (!petResult.valid) errors.petId = petResult.error!;

  const catResult = validateRequired(data.category, 'Category');
  if (!catResult.valid) errors.category = catResult.error!;

  const amtResult = validatePositiveNumber(data.amount, 'Amount');
  if (!amtResult.valid) errors.amount = amtResult.error!;

  return errors;
}
