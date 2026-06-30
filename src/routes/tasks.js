import { Router } from 'express';
import { connect } from '../db/mongoClient.js';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../db/tasksStore.js';

const router = Router();
const VALID_PRIORITIES = ['low', 'mid', 'high'];

// Obtiene todas las tareas desde la colección tasks.
router.get('/', async (req, res, next) => {
    try {
        await connect();
        const tasks = await getAllTasks();
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// Obtiene una tarea por su ID. Devuelve 404 si no existe.
router.get('/:id', async (req, res, next) => {
    try {
        await connect();
        const { id } = req.params;
        const task = await getTaskById(id);

        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// Crea una nueva tarea. Valida title y priority antes de guardar.
router.post('/', async (req, res, next) => {
    try {
        const { title, description = '', priority = 'low' } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'El campo title es obligatorio' });
        }
        if (!VALID_PRIORITIES.includes(priority)) {
            return res.status(400).json({ error: `Priority inválido. Debe ser uno de ${VALID_PRIORITIES.join(', ')}` });
        }

        await connect();

        const now = new Date();
        const newTask = {
            title,
            description,
            priority,
            completed: false,
            createdAt: now,
            updatedAt: now,
        };

        const createdTask = await createTask(newTask);
        res.status(201).json(createdTask);
    } catch (err) {
        next(err);
    }
});

// Actualiza campos de una tarea existente. Solo acepta prioridades válidas.
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, priority, completed } = req.body;
        const updateFields = {};

        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;
        if (priority !== undefined) {
            if (!VALID_PRIORITIES.includes(priority)) {
                return res.status(400).json({ error: `Priority inválido. Debe ser uno de ${VALID_PRIORITIES.join(', ')}` });
            }
            updateFields.priority = priority;
        }
        if (completed !== undefined) updateFields.completed = completed;
        updateFields.updatedAt = new Date();

        await connect();
        // Preparamos los campos a actualizar y ejecutamos la operación contra la DB.
        // Nota: `updateFields` solo contiene los campos provistos por el cliente.
        const updatedTask = await updateTask(id, updateFields);

        if (!updatedTask) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        res.status(200).json(updatedTask);
    } catch (err) {
        next(err);
    }
});

// Elimina una tarea por ID.
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await connect();
        const deleted = await deleteTask(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        res.status(200).json({ message: `Tarea con id ${id} eliminada exitosamente` });
    } catch (err) {
        next(err);
    }
});

export default router;