import config from '../js/config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const contentArea = document.querySelector('.content-area');
  const mainMenu = document.getElementById('mainMenu');
  const logoutBtn = document.getElementById('logoutBtn');
  const menuToggle = document.getElementById('menuToggle');
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
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log('Usuario actual:', user);
    document.addEventListener(evt, resetExpiration);
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace('../login/login.php');
  });

  if (window.history && window.history.pushState) {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }

  // ====== CARGAR MENÚ DINÁMICO DESDE API ======
    try {
    const userNameSpan = document.getElementById('userInfo');

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      userNameSpan.textContent = `${user.name} | Cliente: ${user.idClient}`;
    }

    // 1. Obtener accesos permitidos al usuario
    const accessResponse = await fetch(`${config.BASE_API_URL}access.php?page=1`);
    const accessData = await accessResponse.json();

    const userAccess = accessData.filter(acceso =>
      acceso.idUsuario === user.id ||
      acceso.rol === user.profile &&
      acceso.acceso === '1' &&
      acceso.estado === '0'
    );

    const allowedCodes = userAccess.map(a => a.codigo);

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
      li.setAttribute('data-submenu', `submenu-${parent.code}`);
      li.dataset.fullText = parent.name;

      const label = document.createElement('span');
      label.textContent = parent.name;
      li.appendChild(label);

      if (parent.sub.length > 0) {
        const submenu = document.createElement('ul');
        submenu.classList.add('submenu');
        submenu.id = `submenu-${parent.code}`;
        submenu.style.display = 'none';

        const sortedSub = parent.sub.sort((a, b) => a.order - b.order);
        sortedSub.forEach(sub => {
          const subLi = document.createElement('li');
          const subLink = document.createElement('a');
          subLink.href = '#';
          subLink.setAttribute('data-url', sub.link);
          subLink.textContent = sub.name;
          subLi.appendChild(subLink);
          submenu.appendChild(subLi);
        });

        li.appendChild(submenu);
      } else {
        label.classList.add('clickable');
        label.setAttribute('data-url', parent.link);
      }

      mainMenu.appendChild(li);
    });

    inicializarEventosMenu();

  } catch (error) {
    console.error('Error al cargar el menú:', error);
    mainMenu.innerHTML = '<li>Error al cargar el menú</li>';
  }


  function inicializarEventosMenu() {
    // Manejo de clicks en submenús
    document.querySelectorAll('.submenu a, li > span.clickable').forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = link.getAttribute('data-url');
        if (!url) return;

        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Error al cargar la página');
          const html = await response.text();
          contentArea.innerHTML = html;
          resetExpiration();
        } catch (err) {
          contentArea.innerHTML = `<p style="color:red;">Error cargando la página: ${err.message}</p>`;
        }
      });
    });

    // Mostrar/Ocultar submenús
    const menuItems = document.querySelectorAll('#mainMenu > li');
    const submenus = document.querySelectorAll('.submenu');

    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const submenuId = item.getAttribute('data-submenu');
        submenus.forEach(sm => {
          if (sm.id !== submenuId) sm.style.display = 'none';
        });
        const submenu = document.getElementById(submenuId);
        if (submenu) {
          submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
        }
      });
    });

    // Toggle menú colapsado
    menuToggle.addEventListener('click', () => {
      collapsed = !collapsed;
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.toggle('collapsed', collapsed);
      menuItems.forEach(li => {
        const fullText = li.dataset.fullText;
        if (li.firstChild && li.firstChild.nodeType === Node.ELEMENT_NODE) {
          li.firstChild.textContent = collapsed ? fullText.charAt(0) : fullText;
        }
      });
    });
  }
});
