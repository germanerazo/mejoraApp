import config from '../js/config.js';

document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const user = document.getElementById('user').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!user || !password) {
    Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
    return;
  }

  try {
    const response = await fetch(`${config.BASE_API_URL}auth.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user, password })
    });

    const result = await response.json();

    if (result.status === 'ok') {
        const { token, user } = result.result;
      // Puedes guardar el token en sessionStorage/localStorage si lo necesitas
        const expirationTime = Date.now() + config.EXPIRATION_MINUTES * 60 * 1000;
        console.log('Expiration time:', expirationTime);
        sessionStorage.setItem('expiresAt', expirationTime);
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('token', token);

        window.location.href = '../dashboard/dashboard.php';
    } else {
      Swal.fire('Error', result.result.error_message, 'error');
    }
  } catch (error) {
    Swal.fire('Error', 'Hubo un problema al conectarse con el servidor.', 'error');
  }
});
