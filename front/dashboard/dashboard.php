<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <link rel="stylesheet" href="../styles/colors.css">
  <link rel="stylesheet" href="./dashboard.css">
  <script type="module" src="./dashboard.js"></script>
</head>
<body>
  <div class="sidebar">
    <button id="menuToggle" title="Menú">☰</button>
    <ul id="mainMenu"></ul>
    <button id="logoutBtn">Cerrar sesión</button>
  </div>

  <div class="main-content">
    <div class="header">
      <span id="userInfo" class="user-meta"></span>
      <span id="companyName" class="user-meta"></span>
    </div>
    <div class="content-area">
      <h2>Bienvenido al sistema MEJORA</h2>
      <p>Selecciona una opción del menú para comenzar.</p>
    </div>
  </div>
</body>
</html>
