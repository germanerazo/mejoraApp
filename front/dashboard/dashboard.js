import config from '../js/config.js';

document.addEventListener('DOMContentLoaded', () => {

  const contentArea = document.querySelector('.content-area');
  document.querySelectorAll('.submenu a').forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = link.getAttribute('data-url');
      if (!url) return;
  
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al cargar la página');
        const html = await response.text();
        contentArea.innerHTML = html;
        resetExpiration(); // renovar sesión al navegar
      } catch (err) {
        contentArea.innerHTML = `<p style="color:red;">Error cargando la página: ${err.message}</p>`;
      }
    });
  });

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

  checkSessionExpiration(); // Validar inmediatamente

  // Revalidar cada 10 segundos
  setInterval(checkSessionExpiration, 10000);

  const menuItems = document.querySelectorAll('#mainMenu > li');
  const submenus = document.querySelectorAll('.submenu');
  const logoutBtn = document.getElementById('logoutBtn');
  const menuToggle = document.getElementById('menuToggle');
  let collapsed = false;

  const resetExpiration = () => {
    const newExpiration = Date.now() + config.EXPIRATION_MINUTES * 60 * 1000;
    sessionStorage.setItem('expiresAt', newExpiration);
  };

  // Ocultar todos los submenús al inicio
  submenus.forEach(menu => menu.style.display = 'none');

  menuItems.forEach(item => {
    item.dataset.fullText = item.firstChild.textContent.trim();
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const submenuId = item.getAttribute('data-submenu');
      submenus.forEach(sm => {
        if (sm.id !== submenuId) sm.style.display = 'none';
      });
      const submenu = document.getElementById(submenuId);
      submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    });
  });

  menuToggle.addEventListener('click', () => {
    collapsed = !collapsed;
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed', collapsed);
    menuItems.forEach(li => {
      const fullText = li.dataset.fullText;
      li.firstChild.textContent = collapsed ? fullText.charAt(0) : fullText;
    });
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

  // Eventos para renovar sesión
  ['click', 'mousemove', 'keydown'].forEach(evt => {
    document.addEventListener(evt, resetExpiration);
  });
});
