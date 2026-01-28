<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <link rel="stylesheet" href="../styles/colors.css">
  <link rel="stylesheet" href="./dashboard.css?v=1.2">
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
  <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.19.1/dist/sweetalert2.all.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>

  <script type="module" src="./dashboard.js?v=1.2"></script>
</head>

<body>
  <div class="sidebar">
    <button id="menuToggle" title="Menú">☰</button>
    <ul id="mainMenu"></ul>
    <button id="logoutBtn">Cerrar sesión</button>
  </div>

  <div class="main-content">
    <div class="header">
      <div class="header-info">
        <div class="header-text">
          <span id="companyName" class="company-name"></span>
          <span id="userName" class="user-name"></span>
          <span id="userProfile" class="user-profile"></span>
        </div>
        <img id="companyLogo" src="" alt="Logo Empresa" class="company-logo-header" style="display: none;">
      </div>
    </div>
    <div class="content-area">
      <h2>Bienvenido al sistema MEJORA</h2>
      <p>Selecciona una opción del menú para comenzar.</p>
    </div>
    
    <!-- Chatbot Button -->
    <button id="chatbotBtn" class="chatbot-button" title="Asistente Virtual">
      <img src="../assets/chatbotMejora.png" alt="Chatbot Mejora">
    </button>
    
    <!-- Chat Window -->
    <div id="chatWindow" class="chat-window">
      <div class="chat-header">
        <div class="chat-header-info">
          <img src="../assets/chatbotMejora.png" alt="Bot" class="chat-bot-avatar">
          <div>
            <h3>Asistente Virtual Mejora</h3>
            <span class="chat-status">En línea</span>
          </div>
        </div>
        <button id="closeChatBtn" class="close-chat-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div id="chatMessages" class="chat-messages">
        <div class="message bot-message">
          <div class="message-content">
            ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
          </div>
        </div>
      </div>
      
      <div class="chat-input-container">
        <input type="text" id="chatInput" class="chat-input" placeholder="Escribe tu mensaje...">
        <button id="sendMessageBtn" class="send-message-btn">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</body>

</html>