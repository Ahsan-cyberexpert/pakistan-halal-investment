import type { DbSchema, Transaction, Holding } from './types';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const DEFAULT_DB: DbSchema = {
  balance: 5000000,
  waliBalance: 0,
  globalZakatVault: 4580250,
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
  isPremium: false,
  waliSubscriptionExpiry: null,
  totalInvestedHistory: 150000000,
  totalRealizedProfit: 200000000,
  userZakatContributions: [],
};

function ensureDataDir(): void {
  if (typeof window === 'undefined') {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }
}

export function getDb(): DbSchema {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('roziq_db');
      if (!raw) return { ...DEFAULT_DB };
      return { ...DEFAULT_DB, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_DB };
    }
  }

  // Server-side (Node.js API routes)
  try {
    ensureDataDir();
    if (!fs.existsSync(DB_PATH)) {
      saveDb(DEFAULT_DB);
      return { ...DEFAULT_DB };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return { ...DEFAULT_DB, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_DB };
  }
}

export function saveDb(db: DbSchema): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('roziq_db', JSON.stringify(db));
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
    return;
  }

  // Server-side (Node.js API routes)
  try {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save to DB_PATH:', err);
  }
}

export type { DbSchema, Transaction, Holding };
