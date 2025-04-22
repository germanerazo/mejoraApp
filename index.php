<?php
require_once 'class/connection/connection.php';
date_default_timezone_set('America/Bogota');

$connection = new connection;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Documentación API - MejoraApp</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f4f4f4;
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
        .endpoint {
            background-color: #fff;
            padding: 20px;
            margin-bottom: 30px;
            border-left: 6px solid #3498db;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .method {
            font-weight: bold;
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
        }
        .POST { background-color: #2ecc71; }
        .PUT { background-color: #f39c12; }
        .DELETE { background-color: #e74c3c; }
        .GET { background-color: #3498db; }
        pre {
            background: #ecf0f1;
            padding: 10px;
            overflow-x: auto;
        }
    </style>
</head>
<body>

    <h1>📘 Documentación de la API - MejoraApp</h1>
    <p>Esta documentación muestra cómo consumir los endpoints disponibles en el backend de MejoraApp usando JSON y métodos HTTP estándar. Puedes probar estos endpoints usando herramientas como <strong>Postman</strong>.</p>

    <div class="endpoint">
        <h2>🔐 Login</h2>
        <span class="method POST">POST</span> <code>/auth</code><br>
        <strong>URL:</strong> <code>http://localhost/mejoraApp/auth</code><br><br>
        <strong>Body (JSON):</strong>
        <pre>{
    "user": "123456789",
    "password": "123456"
}</pre>
        <strong>Respuesta:</strong>
        <pre>{
    "status": "ok",
    "result": {
        "token": "5d137e028ad1b86b631f9bd229df96b1",
        "user": {
            "id": "1",
            "name": "Jhonatan Vela",
            "email": "Jhonatan@gmail.com",
            "user": "123456789",
            "idClient": "1"
        }
    }
}</pre>
    </div>

    <div class="endpoint">
        <h2>👤 Crear Usuario</h2>
        <span class="method POST">POST</span> <code>/users</code><br>
        <strong>URL:</strong> <code>http://localhost/mejoraApp/users</code><br><br>
        <strong>Body (JSON):</strong>
        <pre>{
    "name": "nuevo registro 2",
    "email": "a@a.com",
    "cc": "123456789",
    "idClient": "1",
    "password": "123456",
    "profile": "ADM",
    "token": "b6540c19b2985196597735f36de3e821"
}</pre>
        <strong>Respuesta:</strong>
        <pre>{
    "status": "ok",
    "result": {
        "id": 9,
        "name": "nuevo registro 2",
        "email": "a@a.com",
        "cc": "123456789",
        "idClient": "1"
    }
}</pre>
    </div>

    <div class="endpoint">
        <h2>✏️ Actualizar Usuario</h2>
        <span class="method PUT">PUT</span> <code>/users</code><br>
        <strong>URL:</strong> <code>http://localhost/mejoraApp/users</code><br><br>
        <strong>Body (JSON):</strong>
        <pre>{
    "userId": "9",
    "name": "nuevo registro 6",
    "email": "a@a.com",
    "cc": "123456789",
    "idClient": "1",
    "password": "123456",
    "profile": "ADM",
    "token": "b6540c19b2985196597735f36de3e821"
}</pre>
        <strong>Respuesta:</strong>
        <pre>{
    "status": "ok",
    "result": {
        "userId": "9"
    }
}</pre>
    </div>

    <div class="endpoint">
        <h2>🗑️ Eliminar Usuario</h2>
        <span class="method DELETE">DELETE</span> <code>/users</code><br>
        <strong>URL:</strong> <code>http://localhost/mejoraApp/users</code><br><br>
        <strong>Body (JSON):</strong>
        <pre>{
    "userId": "8",
    "token": "b6540c19b2985196597735f36de3e821"
}</pre>
        <strong>Respuesta:</strong>
        <pre>{
    "status": "ok",
    "result": {
        "userId": "8"
    }
}</pre>
    </div>

</body>
<footer>    
<p>© 2025 MejoraApp. Todos los derechos reservados.</p>
</footer>
</html>
