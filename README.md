# SportClass

SportClass es una aplicación web para reservar clases deportivas y administrar las reservas existentes. Permite crear reservas, consultar la lista, editar sus datos y eliminar una reserva con confirmación.

## Tecnologías utilizadas

- **Frontend:** React, React Router y Vite.
- **Backend:** Node.js, Express y CORS.
- **Almacenamiento:** archivo JSON local en `backend/reservas.json`.

## Requisitos

- Node.js y npm instalados.
- Mantener el backend y el frontend ejecutándose en terminales separadas mientras se utiliza la aplicación.

## Instalación y ejecución

Desde la carpeta raíz del proyecto, abre una terminal para el backend:

```bash
cd backend
npm install
node server.js
```

La API estará disponible en `http://localhost:3001`. Si el puerto está ocupado, detén el proceso anterior antes de iniciar el servidor actualizado. El backend también admite configurar el puerto mediante la variable de entorno `PORT`.

Abre una segunda terminal en la carpeta raíz para el frontend:

```bash
cd frontend
npm install
npm run dev
```

Abre en el navegador la dirección local que indique Vite (normalmente `http://localhost:5173`). La primera vez que se inicia el backend, este crea `backend/reservas.json` si todavía no existe.

## Funcionalidades y rutas

- `/`: página de inicio.
- `/registro`: formulario para crear una reserva.
- `/lista`: consulta y actualización de la lista de reservas; cada reserva incluye las acciones **Editar reserva** y **Eliminar reserva**.
- `/reservas/:id/editar`: formulario con los datos actuales de la reserva seleccionada. Al guardar, actualiza esa misma reserva; se puede cancelar para volver a la lista.

La eliminación solicita confirmación antes de borrar la reserva seleccionada. Los cambios se guardan en el archivo JSON del backend.

## API

- `GET /api/reservas`: devuelve todas las reservas.
- `GET /api/reservas/:id`: devuelve una reserva por su identificador.
- `POST /api/reservas`: crea una reserva y genera un identificador nuevo.
- `PUT /api/reservas/:id`: valida y actualiza la reserva indicada, conservando su identificador.
- `DELETE /api/reservas/:id`: elimina la reserva indicada.

Los campos del formulario son `nombre`, `email`, `clase`, `categoria`, `fecha`, `franja`, `hora` y `descripcion`. Para crear una reserva, el formulario requiere que todos estén completos. Al editar, `nombre`, `email`, `clase`, `fecha` y `descripcion` son obligatorios; la categoría y el horario pueden quedar vacíos para reservas antiguas que no los tengan.

La API responde con `404` si el identificador de una reserva no existe y con `400` si los datos de actualización no son válidos.

## Flujo de datos

El frontend envía solicitudes `POST`, `PUT` y `DELETE` a la API Express. El backend actualiza `backend/reservas.json`, y el frontend consulta la API con `GET` para mostrar las reservas.

## Validaciones y errores

- El formulario comprueba que los campos obligatorios estén completos y que el correo tenga un formato válido.
- El backend valida los campos de actualización, la clase, la categoría, el horario y el formato de la fecha.
- La interfaz informa cuando una solicitud falla, muestra estados de carga y presenta un aviso cuando no hay reservas.
- Si el backend no reconoce una operación, comprueba que esté ejecutándose la versión actual desde `backend` y vuelve a cargar la aplicación.

## Comprobaciones de desarrollo

Desde la carpeta `frontend`, puedes ejecutar:

```bash
npm run lint
npm run build
```

Pruebas manuales recomendadas:

1. Crear una reserva y confirmar que aparece en `/lista` y en `backend/reservas.json`.
2. Editar sus campos, guardar y comprobar que se actualizó la misma reserva.
3. Cancelar la edición y confirmar que no se guardan cambios.
4. Eliminar una reserva, cancelar la confirmación y comprobar que se conserva; luego confirmar la eliminación.
5. Intentar guardar un correo inválido y comprobar el mensaje de validación.
6. Apagar el backend y comprobar que la interfaz informa del error de conexión.

## Integrantes y aportes

- [Kevin Barboza]: Backend: Express, rutas, GET/POST, almacenamiento
- [Cristhian Gonzalez]: rutas, menú, inicio y estilos.
- [Christopher Aguiño]: formulario, validaciones y mensajes.
- Erick Minda: integración de la lista con la API,
  pruebas, README e informe.