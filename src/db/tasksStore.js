import { ObjectId } from 'mongodb';
import { getTasksCollection } from './mongoClient.js';

// Lee todas las tareas de la colección tasks.
async function getAllTasks() {
    const collection = getTasksCollection();
    return await collection.find({}).toArray();
}

// Lee una tarea por su _id en MongoDB.
async function getTaskById(id) {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const collection = getTasksCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
}

// Inserta un nuevo documento en la colección tasks y devuelve el documento creado.
async function createTask(taskData) {
    const collection = getTasksCollection();
    const result = await collection.insertOne(taskData);
    return await collection.findOne({ _id: result.insertedId });
}

// Actualiza una tarea por ID y devuelve la versión actualizada.
async function updateTask(id, updateData) {
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const collection = getTasksCollection();
    const filter = { _id: new ObjectId(id) };
    const update = { $set: updateData };
    // Ejecuta la actualización y devuelve el documento resultante.
    // Dependiendo de la versión del driver, `findOneAndUpdate` puede devolver
    // directamente el documento actualizado o un objeto con la propiedad `value`.
    // Normalizamos ambos casos para devolver siempre el documento final.
    const result = await collection.findOneAndUpdate(filter, update, { returnDocument: 'after' });
    return result && result.value ? result.value : result;
}

// Elimina un documento por ID y devuelve true si se borró.
async function deleteTask(id) {
    if (!ObjectId.isValid(id)) {
        return false;
    }
    const collection = getTasksCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
}

export { getAllTasks, getTaskById, createTask, updateTask, deleteTask };