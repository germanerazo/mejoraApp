<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Login Mejora</title>
  <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../styles/colors.css">
  <link rel="stylesheet" href="./login.css">
  <link rel="icon" href="../assets/favicon.png" type="image/png">
</head>
<body>
  <div class="left-container">
    <h2>Bienvenido</h2>
    <form id="loginForm" class="form-container">
      <input type="text" id="user" placeholder="Usuario" required>
      <input type="password" id="password" placeholder="Contraseña" required>
      <button type="submit">Iniciar Sesión</button>
    </form>
  </div>
  <div class="right-container">
    <img src="../assets/animacion_logo.gif" alt="Logo Mejora">
  </div>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.all.min.js"></script>
  <script type="module" src="./login.js"></script>
</body>
</html>
