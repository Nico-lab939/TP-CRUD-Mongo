# CRUD MongoDB Tasks

Proyecto `08-crud-mongo` para operaciones CRUD sobre una colección `tasks` en MongoDB.

## Archivos clave

- `index.js`: servidor Express principal
- `src/routes/tasks.js`: rutas CRUD para la colección `tasks`
- `src/routes/health.js`: endpoint de health check
- `src/db/mongoClient.js`: conexión a MongoDB
- `src/db/tasksStore.js`: operaciones CRUD con MongoDB
- `.env`: contiene `MONGODB_URI`

## Requisitos

- La colección se llama `tasks`
- El POST crea tareas desde el backend
- El JSON original no existe; se genera con POST
- `tasks` debe tener los campos:
  - `title` (obligatorio)
  - `description` (opcional, string)
  - `priority` (low, mid, high)
  - `completed` (booleano)
  - `createdAt` (Date)
  - `updatedAt` (Date)

## Rutas principales

1. `GET /` - ruta principal
2. `GET /api/tasks` - obtener todas las tareas
3. `GET /api/tasks/:id` - obtener tarea por ID
4. `POST /api/tasks` - crear una tarea
5. `PATCH /api/tasks/:id` - modificar una tarea existente
6. `DELETE /api/tasks/:id` - eliminar una tarea

## JSON de prueba con 20 tareas

```json
[
  { "title": "Comprar leche", "description": "Ir al supermercado por leche", "priority": "low", "completed": false },
  { "title": "Enviar correo al equipo", "description": "Actualizar estado del proyecto", "priority": "mid", "completed": false },
  { "title": "Preparar resumen semanal", "description": "Generar informe para la reunión", "priority": "mid", "completed": false },
  { "title": "Leer capítulo del libro", "description": "Continuar con la lectura del curso", "priority": "low", "completed": false },
  { "title": "Organizar escritorio", "description": "Limpiar archivos y ordenar la mesa", "priority": "low", "completed": false },
  { "title": "Planificar viaje", "description": "Revisar opciones de alojamiento y vuelos", "priority": "high", "completed": false },
  { "title": "Configurar backup", "description": "Habilitar copias de seguridad automáticas", "priority": "high", "completed": false },
  { "title": "Actualizar dependencias", "description": "Ejecutar npm update y probar la app", "priority": "mid", "completed": false },
  { "title": "Responder mensajes", "description": "Contestar pedidos de clientes", "priority": "mid", "completed": false },
  { "title": "Crear prueba unitaria", "description": "Agregar caso de test para la ruta POST", "priority": "high", "completed": false },
  { "title": "Diseñar nueva funcionalidad", "description": "Especificar requerimientos y tareas", "priority": "high", "completed": false },
  { "title": "Revisar pull request", "description": "Verificar cambios y aprobar merge", "priority": "mid", "completed": false },
  { "title": "Hacer ejercicio", "description": "30 minutos de cardio", "priority": "low", "completed": false },
  { "title": "Actualizar perfil", "description": "Modificar información personal y foto", "priority": "low", "completed": false },
  { "title": "Enviar factura", "description": "Generar documento para el cliente", "priority": "mid", "completed": false },
  { "title": "Instalar certificado SSL", "description": "Configurar HTTPS para el servidor", "priority": "high", "completed": false },
  { "title": "Probar API", "description": "Verificar rutas GET, POST, PATCH y DELETE", "priority": "mid", "completed": false },
  { "title": "Crear documentación", "description": "Escribir README y ejemplos de uso", "priority": "low", "completed": false },
  { "title": "Revisar logs del servidor", "description": "Investigar errores recientes", "priority": "mid", "completed": false },
  { "title": "Aprender MongoDB", "description": "Repasar operaciones CRUD y colecciones", "priority": "low", "completed": false }
]
```

> Nota: Este JSON es para pruebas de payload en POST. MongoDB generará el `_id` automáticamente.

## Cómo testear el proyecto

1. Instalar dependencias:
   ```bash
   cd "08-crud-mongo"
   npm install
   ```

2. Iniciar el servidor:
   ```bash
   npm run dev
   ```

3. Antes de hacer el POST, configurar el header:
   - Key: `Content-Type`
   - Value: `application/json`

4. Probar rutas con `curl`, Postman o Insomnia:

   - Ruta principal:
     ```bash
     curl http://localhost:3000/
     ```

   - Ver todas las tareas:
     ```bash
     curl http://localhost:3000/api/tasks
     ```

   - Crear una tarea:
     ```bash
     curl -X POST http://localhost:3000/api/tasks \
       -H "Content-Type: application/json" \
       -d '{"title":"Comprar pan","description":"Pan para desayunar","priority":"low"}'
     ```

   - Obtener tarea por ID:
     ```bash
     curl http://localhost:3000/api/tasks/<TASK_ID>
     ```

   - Actualizar tarea:
     ```bash
     curl -X PATCH http://localhost:3000/api/tasks/<TASK_ID> \
       -H "Content-Type: application/json" \
       -d '{"title":"Comprar pan integral","completed":true}'
     ```

   - Eliminar tarea:
     ```bash
     curl -X DELETE http://localhost:3000/api/tasks/<TASK_ID>
     ```

5. Validaciones clave:
   - POST debe crear la tarea en MongoDB y devolverla con `_id`
   - GET `/api/tasks` debe mostrar todas las tareas
   - GET `/api/tasks/:id` debe devolver la tarea correcta o 404 si no existe
   - PATCH `/api/tasks/:id` debe actualizar campos válidos y devolver el documento actualizado
   - DELETE `/api/tasks/:id` debe eliminar la tarea y devolver un mensaje exitoso

## Consideraciones

- El campo `title` es obligatorio en POST.
- `priority` solo puede ser `low`, `mid` o `high`.
- La colección usada en MongoDB es `tasks`.
- No se debe enviar `_id` en el POST; MongoDB lo genera automáticamente.
