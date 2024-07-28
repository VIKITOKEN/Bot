import Database from 'better-sqlite3';
const db = new Database('foobar.db', {fileMustExist:false});
db.pragma('journal_mode = WAL');

// Create table if it doesn't exist
db.prepare(`CREATE TABLE IF NOT EXISTS buyTransaction (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   transactionID TEXT NOT NULL
 )`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS telegramUsers (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   telegramID TEXT NOT NULL UNIQUE
)`).run();

export default db;