import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Initial state
const INITIAL_DATA = {
  balance: 250000,
  transactions: [
    { id: 1, type: 'deposit', amount: 250000, method: 'JazzCash', status: 'success', date: new Date().toISOString() }
  ],
  holdings: [],
  zakatHistory: []
};

export function getDb() {
  if (!fs.existsSync(DB_PATH)) {
    saveDb(INITIAL_DATA);
    return INITIAL_DATA;
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_DATA;
  }
}

export function saveDb(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
