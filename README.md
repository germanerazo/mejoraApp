# mejoraApp API

## Descripción
La API de mejoraApp proporciona endpoints para interactuar con la aplicación web mejora. Permite gestionar datos, realizar operaciones y obtener información relevante para los usuarios.

## Endpoints principales
- **GET /api/usuarios**: Obtiene la lista de usuarios.
- **POST /api/usuarios**: Crea un nuevo usuario.
- **PUT /api/usuarios/{id}**: Actualiza la información de un usuario existente.
- **DELETE /api/usuarios/{id}**: Elimina un usuario.

## Requisitos
- **Node.js**: Versión 14 o superior.
- **Base de datos**: MySQL (configurada en XAMPP).

## Instalación
1. Clona el repositorio:
    ```bash
    git clone https://github.com/usuario/mejoraApp.git
    ```
2. Instala las dependencias:
    ```bash
    cd mejoraApp
    npm install
    ```
3. Configura las variables de entorno en un archivo `.env`.

## Uso
1. Inicia el servidor:
    ```bash
    npm start
    ```
2. Accede a los endpoints a través de `http://localhost:3000/api`.

## Contribución
Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia
Este proyecto está bajo la licencia MIT.
