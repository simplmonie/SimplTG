// db.mjs
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const adapter = new JSONFile('db.json');
const db = new Low(adapter, {});

export async function initDB() {
  await db.read();
  if (!db.data) {
    db.data = { scores: [], wallets: [], miners: [] };
    await db.write();
  } else if (!db.data.scores || !db.data.miners) {
    db.data.scores = db.data.scores || [];
    db.data.wallets = db.data.wallets || [];
    db.data.miners = db.data.miners || [];
    await db.write();
  }
  return db;
}
