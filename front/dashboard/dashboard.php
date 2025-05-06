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
    <ul id="mainMenu">
      <li data-submenu="planearSubmenu">Planear
        <ul class="submenu" id="planearSubmenu">
        <li><a href="#" data-url="../planear/planear.php">Objetivos</a></li>
          <li><a href="indicadores.php">Indicadores</a></li>
        </ul>
      </li>
      <li data-submenu="hacerSubmenu">Hacer
        <ul class="submenu" id="hacerSubmenu">
          <li><a href="proyectos.php">Proyectos</a></li>
          <li><a href="tareas.php">Tareas</a></li>
        </ul>
      </li>
      <li data-submenu="verificarSubmenu">Verificar
        <ul class="submenu" id="verificarSubmenu">
          <li><a href="reportes.php">Reportes</a></li>
          <li><a href="auditorias.php">Auditorías</a></li>
        </ul>
      </li>
      <li data-submenu="actuarSubmenu">Actuar
        <ul class="submenu" id="actuarSubmenu">
          <li><a href="mejoras.php">Mejoras</a></li>
          <li><a href="acciones.php">Acciones Correctivas</a></li>
        </ul>
      </li>
    </ul>
    <button id="logoutBtn">Cerrar sesión</button>
  </div>

  <div class="main-content">
    <div class="header">
      <span>Dashboard</span>
    </div>
    <div class="content-area">
      <h2>Bienvenido al sistema MEJORA</h2>
      <p>Selecciona una opción del menú para comenzar.</p>
    </div>
  </div>
</body>

</html>
