import type { Scalar } from '@op-engineering/op-sqlite';
import { getDatabase } from '../connection';
import { generateId } from '@/utils/id';
import type { Expense, ExpenseCategory } from '@/utils/types';
import type { ExpenseRow } from '../types';

function mapRow(row: ExpenseRow): Expense {
  return {
    id: row.id,
    petId: row.pet_id,
    category: row.category as ExpenseCategory,
    amount: row.amount,
    currency: row.currency,
    description: row.description,
    expenseDate: row.expense_date,
    notes: row.notes,
    receiptUri: row.receipt_uri,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getByPetId(petId: string): Expense[] {
  const db = getDatabase();
  const result = db.executeSync(
    'SELECT * FROM expenses WHERE pet_id = ? ORDER BY expense_date DESC',
    [petId],
  );
  const expenses: Expense[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      expenses.push(mapRow(result.rows[i] as unknown as ExpenseRow));
    }
  }
  return expenses;
}

export function getByMonth(petId: string, year: number, month: number): Expense[] {
  const db = getDatabase();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

  const result = db.executeSync(
    `SELECT * FROM expenses
     WHERE pet_id = ? AND expense_date >= ? AND expense_date < ?
     ORDER BY expense_date DESC`,
    [petId, startDate, endDate],
  );
  const expenses: Expense[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      expenses.push(mapRow(result.rows[i] as unknown as ExpenseRow));
    }
  }
  return expenses;
}

export function create(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  db.executeSync(
    `INSERT INTO expenses (
      id, pet_id, category, amount, currency, description,
      expense_date, notes, receipt_uri, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.petId,
      data.category,
      data.amount,
      data.currency,
      data.description ?? null,
      data.expenseDate,
      data.notes ?? null,
      data.receiptUri ?? null,
      now,
      now,
    ],
  );

  const result = db.executeSync('SELECT * FROM expenses WHERE id = ?', [id]);
  return mapRow(result.rows![0] as unknown as ExpenseRow);
}

export function update(id: string, data: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>): Expense | null {
  const db = getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: Scalar[] = [];

  if (data.petId !== undefined) { fields.push('pet_id = ?'); values.push(data.petId); }
  if (data.category !== undefined) { fields.push('category = ?'); values.push(data.category); }
  if (data.amount !== undefined) { fields.push('amount = ?'); values.push(data.amount); }
  if (data.currency !== undefined) { fields.push('currency = ?'); values.push(data.currency); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
  if (data.expenseDate !== undefined) { fields.push('expense_date = ?'); values.push(data.expenseDate); }
  if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes); }
  if (data.receiptUri !== undefined) { fields.push('receipt_uri = ?'); values.push(data.receiptUri); }

  if (fields.length === 0) {
    const result = db.executeSync('SELECT * FROM expenses WHERE id = ?', [id]);
    if (result.rows && result.rows.length > 0) {
      return mapRow(result.rows[0] as unknown as ExpenseRow);
    }
    return null;
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.executeSync(`UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`, values);

  const result = db.executeSync('SELECT * FROM expenses WHERE id = ?', [id]);
  if (result.rows && result.rows.length > 0) {
    return mapRow(result.rows[0] as unknown as ExpenseRow);
  }
  return null;
}

export function remove(id: string): void {
  const db = getDatabase();
  db.executeSync('DELETE FROM expenses WHERE id = ?', [id]);
}

export interface MonthlySummary {
  totalAmount: number;
  count: number;
  currency: string;
}

export function getMonthlySummary(petId: string, year: number, month: number): MonthlySummary {
  const db = getDatabase();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

  const result = db.executeSync(
    `SELECT COALESCE(SUM(amount), 0) as total_amount, COUNT(*) as count, currency
     FROM expenses
     WHERE pet_id = ? AND expense_date >= ? AND expense_date < ?
     GROUP BY currency`,
    [petId, startDate, endDate],
  );

  if (result.rows && result.rows.length > 0) {
    const row = result.rows[0] as unknown as { total_amount: number; count: number; currency: string };
    return {
      totalAmount: row.total_amount,
      count: row.count,
      currency: row.currency,
    };
  }

  return { totalAmount: 0, count: 0, currency: 'PHP' };
}

export interface CategorySummary {
  category: ExpenseCategory;
  totalAmount: number;
  count: number;
}

export function getCategorySummary(petId: string, year: number, month: number): CategorySummary[] {
  const db = getDatabase();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

  const result = db.executeSync(
    `SELECT category, COALESCE(SUM(amount), 0) as total_amount, COUNT(*) as count
     FROM expenses
     WHERE pet_id = ? AND expense_date >= ? AND expense_date < ?
     GROUP BY category
     ORDER BY total_amount DESC`,
    [petId, startDate, endDate],
  );

  const summaries: CategorySummary[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows[i] as unknown as { category: string; total_amount: number; count: number };
      summaries.push({
        category: row.category as ExpenseCategory,
        totalAmount: row.total_amount,
        count: row.count,
      });
    }
  }
  return summaries;
}
