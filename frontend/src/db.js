// db.js
import { openDB } from 'idb';

const DB_NAME = 'survivor-db';
const STORE_NAME = 'sos';

export async function initDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
  });
  return db;
}

export async function addMessage(message) {
  const db = await initDB();
  const id = generateMessageID(message);  // Unique ID based on content
  const existing = await db.get(STORE_NAME, id);

  if (!existing) {
    await db.put(STORE_NAME, { ...message, id, synced: false });
    console.log('New message stored locally');
  } else {
    console.log('Duplicate message ignored');
  }
}

export async function getUnsyncedMessages() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  const allMessages = await store.getAll();
  return allMessages.filter(msg => !msg.synced);
}

function generateMessageID(message) {
  return `${message.timestamp}-${message.latitude}-${message.longitude}-${message.text}`;
}
