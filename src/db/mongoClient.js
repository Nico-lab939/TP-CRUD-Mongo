import { MongoClient } from 'mongodb';

// Configuración de conexión tomada desde .env.
const uri = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'taskManager';
const COLLECTION_NAME = 'tasks';

if (!uri) {
    throw new Error('MONGODB_URI no está definido en .env');
}

// Cliente MongoDB reutilizable para evitar múltiples conexiones abiertas.
const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
});

let clientPromise;

async function connect() {
    if (!clientPromise) {
        clientPromise = client.connect();
    }
    await clientPromise;
    return client;
}

function getDb() {
    return client.db(DB_NAME);
}

function getTasksCollection() {
    return getDb().collection(COLLECTION_NAME);
}

async function close() {
    if (clientPromise) {
        await client.close();
        clientPromise = undefined;
    }
}

export { connect, getTasksCollection, close };