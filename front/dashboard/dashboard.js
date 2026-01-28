import config from '../js/config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const contentArea = document.querySelector('.content-area');
  const mainMenu = document.getElementById('mainMenu');
  const logoutBtn = document.getElementById('logoutBtn');
  const menuToggle = document.getElementById('menuToggle');
  const companyNameSpan = document.getElementById('companyName');
  const userNameSpan = document.getElementById('userName');
  const userProfileSpan = document.getElementById('userProfile');
  let collapsed = false;

  const resetExpiration = () => {
    const newExpiration = Date.now() + config.EXPIRATION_MINUTES * 60 * 1000;
    sessionStorage.setItem('expiresAt', newExpiration);
  };

  const checkSessionExpiration = () => {
    const expiresAt = sessionStorage.getItem('expiresAt');
    const now = Date.now();

    if (sessionStorage.getItem('loggedIn') !== 'true' || !expiresAt || now > Number(expiresAt)) {
      console.log('Sesión expirada. Cerrando...');
      sessionStorage.clear();
      localStorage.clear();
      window.location.replace('../login/login.php');
    }
  };

  checkSessionExpiration();
  setInterval(checkSessionExpiration, 10000);

  // Eventos para renovar sesión
  ['click', 'mousemove', 'keydown'].forEach(evt => {
    document.addEventListener(evt, resetExpiration);
  });

  logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i><span class="logout-text">Cerrar sesión</span>';
  logoutBtn.addEventListener('click', () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace('../login/login.php');
  });

  // ====== MAPA DE ICONOS ======
  const iconMap = {
    // Definir mapeo basado en códigos o nombres (ajustar según DB real)
    '1': 'fa-solid fa-chart-line', // Ejemplo: Dashboard
    '2': 'fa-solid fa-users',     // Ejemplo: Usuarios
    '3': 'fa-solid fa-cogs',      // Ejemplo: Configuración
    '4': 'fa-solid fa-network-wired',
    'default': 'fa-solid fa-folder'
  };

  const getIcon = (code) => {
    // Intenta mapear por código o devuelve defecto
    // Se puede mejorar buscando palabras clave en el nombre si el codigo no es suficiente
    return iconMap[code] || iconMap['default'];
  };

  // ====== CARGAR MENÚ DINÁMICO DESDE API ======
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    // Renderizado Header Usuario
    if (user) {
      // Fetch company info first
      const companyResponse = await fetch(`${config.BASE_API_URL}companies.php?id=${user.idClient}`);
      const companyData = await companyResponse.json();
      
      if (companyData && companyData.length > 0) {
        const company = companyData[0];
        if (companyNameSpan) {
            companyNameSpan.textContent = company.nomEmpresa;
        }
        
        const companyLogo = document.getElementById('companyLogo');
        if (companyLogo && company.ruta) {
            companyLogo.src = `${config.ASSETS_URL}${company.ruta}`;
            companyLogo.style.display = 'block';
        }
      }
      
      // Set user name
      if (userNameSpan) {
        userNameSpan.textContent = user.name;
      }
      
      // Set user profile
      if (userProfileSpan) {
        userProfileSpan.textContent = `(${user.profile})`;
      }
    }

    // 1. Obtener accesos permitidos
    const accessResponse = await fetch(`${config.BASE_API_URL}access.php?page=1`);
    const accessData = await accessResponse.json();

    const userAccess = accessData.filter(acceso =>
      acceso.idUsuario === user.id ||
      acceso.rol === user.profile &&
      acceso.acceso === '1' &&
      acceso.estado === '0'
    );

    const allowedCodes = userAccess.map(a => a.codigo);
    allowedCodes.push('207'); // Allow Morbidity Module manually

    // 2. Obtener opciones del menú
    const optionsResponse = await fetch(`${config.BASE_API_URL}options.php?page=1`);
    const optionsData = await optionsResponse.json();

    // 3. Filtrar opciones válidas
    const options = optionsData.filter(option =>
      option.state === '0' && allowedCodes.includes(option.code)
    );

    const menuMap = {};

    options.forEach(option => {
      const nivel = parseInt(option.nivel);
      if (nivel === 1) {
        menuMap[option.code] = {
          ...option,
          sub: []
        };
      } else {
        const parentCode = Object.keys(menuMap).find(code =>
          parseInt(option.code) > parseInt(code) &&
          parseInt(option.code) < parseInt(code) + 100
        );
        if (parentCode) {
          menuMap[parentCode].sub.push(option);
        }
      }
    });

    const sortedParents = Object.values(menuMap).sort((a, b) => a.order - b.order);

    sortedParents.forEach(parent => {
      const li = document.createElement('li');
      
      // Contenedor principal del item (Parent)
      // Si tiene submenús es un 'accordion-toggle', si no es un link directo map
      const hasSub = parent.sub.length > 0;
      
      const menuItemDiv = document.createElement('div');
      menuItemDiv.className = 'menu-item';
      if (!hasSub) {
          menuItemDiv.setAttribute('data-url', parent.link);
          menuItemDiv.classList.add('clickable');
      } else {
          menuItemDiv.setAttribute('data-submenu-id', `submenu-${parent.code}`);
      }

      // Icono
      const icon = document.createElement('i');
      icon.className = `menu-icon ${getIcon(parent.code)}`;
      menuItemDiv.appendChild(icon);

      // Texto
      const textSpan = document.createElement('span');
      textSpan.className = 'menu-text';
      textSpan.textContent = parent.name;
      menuItemDiv.appendChild(textSpan);

      // Flecha si tiene submenú
      if (hasSub) {
          const arrow = document.createElement('i');
          arrow.className = 'fas fa-chevron-down menu-arrow';
          menuItemDiv.appendChild(arrow);
      }

      li.appendChild(menuItemDiv);

      // Submenú container
      if (hasSub) {
        const submenuUl = document.createElement('ul');
        submenuUl.className = 'submenu';
        submenuUl.id = `submenu-${parent.code}`;

        const sortedSub = parent.sub.sort((a, b) => a.order - b.order);
        sortedSub.forEach(sub => {
          const subLi = document.createElement('li');
          const subLink = document.createElement('a');
          subLink.href = '#';
          subLink.setAttribute('data-url', sub.link);
          
          // Icono opcional para subitems (dot o similar)
          subLink.innerHTML = `<i class="fas fa-circle" style="font-size: 6px; margin-right: 8px; vertical-align: middle;"></i> ${sub.name}`;
          
          subLi.appendChild(subLink);
          submenuUl.appendChild(subLi);
        });
        li.appendChild(submenuUl);
      }

      mainMenu.appendChild(li);
    });

    inicializarEventosMenu();

  } catch (error) {
    console.error('Error al cargar el menú:', error);
    mainMenu.innerHTML = '<li style="padding:20px; color:white;">Error cargando menú</li>';
  }


  function inicializarEventosMenu() {
    // 1. Manejo de Parents con Submenús (Accordion)
    const parents = document.querySelectorAll('.menu-item[data-submenu-id]');
    parents.forEach(parent => {
        parent.addEventListener('click', (e) => {
            if (collapsed) return; // Si está colapsado no expande accordion en hover (hover logic handled by css if needed, or simple click to expand popover - simplified here)
            
            e.stopPropagation();
            const submenuId = parent.getAttribute('data-submenu-id');
            const submenu = document.getElementById(submenuId);
            const isExpanded = parent.classList.contains('expanded');

            // Cerrar otros (opcional, acordeón estricto)
            document.querySelectorAll('.menu-item.expanded').forEach(other => {
                if (other !== parent) {
                    other.classList.remove('expanded');
                    const otherSub = document.getElementById(other.getAttribute('data-submenu-id'));
                    if(otherSub) otherSub.style.maxHeight = null;
                }
            });

            // Toggle actual
            if (isExpanded) {
                parent.classList.remove('expanded');
                submenu.style.maxHeight = null;
            } else {
                parent.classList.add('expanded');
                submenu.style.maxHeight = submenu.scrollHeight + "px";
            }
        });
    });

    // 2. Manejo de Links directos (Subitems y Parents sin hijos)
    const links = document.querySelectorAll('.submenu a, .menu-item.clickable');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remover active de todos
            document.querySelectorAll('.menu-item, .submenu a').forEach(el => el.classList.remove('active'));
            // Agregar active
            if(link.classList.contains('menu-item')) {
                link.classList.add('active');
            } else {
                link.classList.add('active'); // Style for submenu link active if needed
                // Highlight parent too
                const parentLi = link.closest('.submenu').parentNode;
                const parentDiv = parentLi.querySelector('.menu-item');
                parentDiv.classList.add('active');
            }

            const url = link.getAttribute('data-url');
            if (url) {
                window.location.hash = encodeURIComponent(url);
                resetExpiration();
            }
        });
    });

    // Toggle Sidebar
    menuToggle.addEventListener('click', () => {
      collapsed = !collapsed;
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.toggle('collapsed', collapsed);
      
      // Al colapsar, cerrar todos los acordeones
      if (collapsed) {
          document.querySelectorAll('.menu-item.expanded').forEach(item => {
              item.classList.remove('expanded');
              const sub = document.getElementById(item.getAttribute('data-submenu-id'));
              if(sub) sub.style.maxHeight = null;
          });
      }
    });
  }

  async function cargarContenidoPorHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) {
      contentArea.innerHTML = `
        <div style="text-align: center; margin-top: 50px; opacity: 0.7;">
            <i class="fas fa-chart-pie" style="font-size: 4rem; color: #23547b; margin-bottom: 20px;"></i>
            <h2>Bienvenido al sistema MEJORA</h2>
            <p>Selecciona una opción del menú para comenzar.</p>
        </div>
      `;
      return;
    }

    try {
      const url = decodeURIComponent(hash);
      // Animación de carga simple
      contentArea.innerHTML = '<div style="padding:20px; text-align:center;"><i class="fas fa-spinner fa-spin fa-2x"></i> Cargando...</div>';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar la página');
      const html = await response.text();
      contentArea.innerHTML = html;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const scripts = tempDiv.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.type) newScript.type = script.type;
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
      });
    } catch (err) {
      contentArea.innerHTML = `<div style="padding:20px; color: #e74c3c;"><i class="fas fa-exclamation-triangle"></i> Error cargando la página: ${err.message}</div>`;
    }
  }

  if (window.location.hash) {
    cargarContenidoPorHash();
  } else {
      // Cargar mensaje bienvenida
      cargarContenidoPorHash(); 
  }

  window.addEventListener('hashchange', cargarContenidoPorHash);

  // ====== CHATBOT FUNCTIONALITY ======
  const chatbotBtn = document.getElementById('chatbotBtn');
  const chatWindow = document.getElementById('chatWindow');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const chatInput = document.getElementById('chatInput');
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  const chatMessages = document.getElementById('chatMessages');

  // Toggle chat window
  chatbotBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      chatInput.focus();
    }
  });

  // Close chat window
  closeChatBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
  });

  // Send message function
  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.innerHTML = `
      <div class="message-content">${message}</div>
    `;
    chatMessages.appendChild(userMessageDiv);

    // Clear input
    chatInput.value = '';

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate bot response (placeholder for future AI integration)
    setTimeout(() => {
      const botMessageDiv = document.createElement('div');
      botMessageDiv.className = 'message bot-message';
      botMessageDiv.innerHTML = `
        <div class="message-content">Gracias por tu mensaje. Estoy aquí para ayudarte con el sistema MEJORA.</div>
      `;
      chatMessages.appendChild(botMessageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
  }

  // Send message on button click
  sendMessageBtn.addEventListener('click', sendMessage);

  // Send message on Enter key
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

});