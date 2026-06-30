import express from 'express';
import healthRouter from './src/routes/health.js';
import tasksRouter from './src/routes/tasks.js';

const PORT = process.env.PORT || 3000;
const API_PREFIX = "/api";
const server = express();

// Habilita el middleware para parsear bodies JSON en las rutas POST/PATCH.
server.use(express.json());

// Ruta principal que permite verificar rápidamente que la API está activa.
server.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'CRUD MongoDB tasks API',
        routes: [
            { path: '/api/tasks', methods: ['GET', 'POST'] },
            { path: '/api/tasks/:id', methods: ['GET', 'PATCH', 'DELETE'] },
            { path: '/health', methods: ['GET'] }
        ]
    });
});

// health check
server.use("/health", healthRouter);

server.use(`${API_PREFIX}/tasks`, tasksRouter);



// 404 Not Found
server.use((req, res, next) => {
    const error = new Error(`Not Found: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

// Global Error Handler
server.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ status, error: err.message || 'Internal Server Error' });
});

server.listen(PORT, (err) => {
    if (err) {
        console.error('Error al iniciar el servidor:', err);
        return;
    }
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});