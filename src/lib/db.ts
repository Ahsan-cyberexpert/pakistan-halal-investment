import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const INITIAL_DATA = {
  balance: 5000000,
  waliBalance: 0,
  isPremium: false,
  waliSubscriptionExpiry: null,
  totalInvestedHistory: 150000000, // 15 Crore
  totalRealizedProfit: 200000000, // 20 Crore
  globalZakatVault: 4580250,
  userZakatContributions: [], // Tracks user's history in the national vault
  transactions: [
    {
      id: 1,
      type: 'deposit',
      amount: 250000,
      method: 'JazzCash',
      status: 'success',
      date: new Date().toISOString(),
    },
  ],
  holdings: [],
  zakatHistory: [],
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDb(): typeof INITIAL_DATA {
  ensureDataDir();
  if (!fs.existsSync(DB_PATH)) {
    saveDb(INITIAL_DATA);
    return { ...INITIAL_DATA };
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { ...INITIAL_DATA };
  }
}

export function saveDb(data: any) {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}
