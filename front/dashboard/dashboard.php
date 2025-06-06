<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <link rel="stylesheet" href="../styles/colors.css">
  <link rel="stylesheet" href="./dashboard.css">
  <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.all.min.js"></script>
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