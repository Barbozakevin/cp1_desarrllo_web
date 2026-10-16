# SportClass

Aplicación para registrar y consultar reservas de clases deportivas.

## Tecnologías

- React y React Router.
- Node.js y Express.
- CORS.
- Archivo JSON para almacenar las reservas.

## Requisito

Tener Node.js y npm instalados.

## Ejecutar el backend

Abrir una terminal en la carpeta principal:

    cd backend
    npm install
    node server.js

El backend utiliza http://localhost:3001.

## Ejecutar el frontend

Abrir otra terminal en la carpeta principal:

    cd frontend
    npm install
    npm run dev

Abrir la dirección indicada por Vite.
Mantener ambas terminales funcionando.

## Rutas del frontend

- /: página de inicio.
- /registro: formulario de reserva.
- /lista: consulta de reservas.

## API

- GET /api/reservas: consultar reservas.
- GET /api/reservas/:id: consultar una reserva.
- POST /api/reservas: crear una reserva.
- PUT /api/reservas/:id: actualizar una reserva existente.
- DELETE /api/reservas/:id: eliminar una reserva existente.

Campos del registro:
nombre, email, descripcion, fecha y categoria.

## Flujo de datos

Formulario React → peticiones POST/PUT/DELETE → API Express →
reservas.json → peticiones GET → lista en React.

## Validaciones y mensajes

- Campos obligatorios.
- Formato del correo electrónico.
- Mensajes de éxito y error.
- Estado de carga y aviso de lista vacía.

## Pruebas

Registrar los resultados reales de estas pruebas:

- Enviar campos vacíos.
- Enviar un correo incorrecto.
- Crear una reserva válida.
- Comprobar el archivo JSON.
- Consultar la reserva desde la lista.
- Consultar con el backend desconectado.

## Integrantes y aportes

- [Kevin Barboza]: Backend: Express, rutas, GET/POST, almacenamiento
- [Cristhian Gonzalez]: rutas, menú, inicio y estilos.
- [Christopher Aguiño]: formulario, validaciones y mensajes.
- Erick Minda: integración de la lista con la API,
  pruebas, README e informe.