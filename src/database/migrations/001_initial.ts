import type { DB } from '@op-engineering/op-sqlite';

export const migration001 = {
  version: 1,
  up: (db: DB): void => {
    // pets
    db.executeSync(`
      CREATE TABLE IF NOT EXISTS pets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        pet_type TEXT NOT NULL CHECK(pet_type IN ('dog','cat','other')),
        breed TEXT,
        birthday TEXT,
        sex TEXT NOT NULL DEFAULT 'unknown' CHECK(sex IN ('male','female','unknown')),
        color TEXT,
        weight REAL,
        weight_unit TEXT NOT NULL DEFAULT 'kg' CHECK(weight_unit IN ('kg','lbs')),
        microchip_number TEXT,
        photo_uri TEXT,
        owner_name TEXT,
        owner_contact TEXT,
        allergies TEXT DEFAULT '[]',
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // feedings
    db.executeSync(`
      CREATE TABLE IF NOT EXISTS feedings (
        id TEXT PRIMARY KEY,
        pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
        food_type TEXT NOT NULL CHECK(food_type IN ('wet','dry','raw','homemade','treats')),
        food_brand TEXT,
        portion_size REAL,
        portion_unit TEXT NOT NULL DEFAULT 'grams' CHECK(portion_unit IN ('grams','cups','pieces')),
        notes TEXT,
        fed_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // vet_visits
    db.executeSync(`
      CREATE TABLE IF NOT EXISTS vet_visits (
        id TEXT PRIMARY KEY,
        pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
        purpose TEXT NOT NULL CHECK(purpose IN ('checkup','vaccination','emergency','surgery','grooming','other')),
        clinic_name TEXT,
        vet_name TEXT,
        visit_date TEXT NOT NULL,
        notes TEXT,
        cost INTEGER,
        currency TEXT NOT NULL DEFAULT 'PHP',
        photo_uris TEXT DEFAULT '[]',
        next_visit_date TEXT,
        reminder_enabled INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // vaccinations
    db.executeSync(`
      CREATE TABLE IF NOT EXISTS vaccinations (
        id TEXT PRIMARY KEY,
        pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
        vet_visit_id TEXT REFERENCES vet_visits(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        date_administered TEXT NOT NULL,
        batch_number TEXT,
        next_due_date TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // medications
    db.executeSync(`
      CREATE TABLE IF NOT EXISTS medications (
        id TEXT PRIMARY KEY,
        pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        dosage TEXT,
        frequency TEXT NOT NULL CHECK(frequency IN ('daily','twice_daily','weekly','monthly','custom')),
        custom_frequency_days INTEGER,
        time_of_day TEXT DEFAULT '[]',
        start_date TEXT NOT NULL,
        end_date TEXT,
        is_deworming INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // medication_logs
    db.executeSync(`
      CREATE TABLE IF NOT EXISTS medication_logs (
        id TEXT PRIMARY KEY,
        medication_id TEXT NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
        pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
        status TEXT NOT NULL CHECK(status IN ('given','skipped','pending')),
        scheduled_at TEXT NOT NULL,
        logged_at TEXT,
        notes TEXT,
        created_at TEXT NOT NULL
      );
    `);

    // weight_entries
    db.executeSync(`
      CREATE TABLE IF NOT EXISTS weight_entries (
        id TEXT PRIMARY KEY,
        pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
        weight REAL NOT NULL,
        unit TEXT NOT NULL DEFAULT 'kg' CHECK(unit IN ('kg','lbs')),
        measured_at TEXT NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL
      );
    `);

    // expenses
    db.executeSync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
        category TEXT NOT NULL CHECK(category IN ('food','vet_bills','grooming','accessories','medication','insurance','other')),
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'PHP',
        description TEXT,
        expense_date TEXT NOT NULL,
        notes TEXT,
        receipt_uri TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // reminders
    db.executeSync(`
      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK(type IN ('feeding','medication','vet_visit','vaccination','general')),
        reference_id TEXT,
        title TEXT NOT NULL,
        body TEXT,
        scheduled_at TEXT NOT NULL,
        notifee_id TEXT,
        repeat_pattern TEXT NOT NULL DEFAULT 'once' CHECK(repeat_pattern IN ('once','daily','weekly','monthly','custom')),
        custom_interval_days INTEGER,
        is_complete INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Indexes on foreign keys and date columns
    db.executeSync('CREATE INDEX IF NOT EXISTS idx_feedings_pet_id ON feedings(pet_id);');
    db.executeSync('CREATE INDEX IF NOT EXISTS idx_feedings_fed_at ON feedings(fed_at);');

    db.executeSync('CREATE INDEX IF NOT EXISTS idx_vet_visits_pet_id ON vet_visits(pet_id);');
    db.executeSync('CREATE INDEX IF NOT EXISTS idx_vet_visits_visit_date ON vet_visits(visit_date);');

    db.executeSync('CREATE INDEX IF NOT EXISTS idx_vaccinations_pet_id ON vaccinations(pet_id);');
    db.executeSync('CREATE INDEX IF NOT EXISTS idx_vaccinations_date_administered ON vaccinations(date_administered);');

    db.executeSync('CREATE INDEX IF NOT EXISTS idx_medications_pet_id ON medications(pet_id);');

    db.executeSync('CREATE INDEX IF NOT EXISTS idx_medication_logs_medication_id ON medication_logs(medication_id);');
    db.executeSync('CREATE INDEX IF NOT EXISTS idx_medication_logs_pet_id ON medication_logs(pet_id);');
    db.executeSync('CREATE INDEX IF NOT EXISTS idx_medication_logs_scheduled_at ON medication_logs(scheduled_at);');

    db.executeSync('CREATE INDEX IF NOT EXISTS idx_weight_entries_pet_id ON weight_entries(pet_id);');
    db.executeSync('CREATE INDEX IF NOT EXISTS idx_weight_entries_measured_at ON weight_entries(measured_at);');

    db.executeSync('CREATE INDEX IF NOT EXISTS idx_expenses_pet_id ON expenses(pet_id);');
    db.executeSync('CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);');

    db.executeSync('CREATE INDEX IF NOT EXISTS idx_reminders_pet_id ON reminders(pet_id);');
    db.executeSync('CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_at ON reminders(scheduled_at);');
  },
};
