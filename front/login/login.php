<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Mejora</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.12/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="../styles/colors.css">
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            display: flex;
            height: 100vh;
            position: relative;
            overflow: hidden;
        }

        .left-container {
            width: 50%;
            background-color: var(--fondo);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
        }

        .left-container h2 {
            margin-bottom: 20px;
        }

        .form-container {
            width: 80%;
            max-width: 400px;
        }

        input {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: none;
            border-radius: 5px;
        }

        button {
            width: 100%;
            padding: 12px;
            background-color: var(--color2);
            border: none;
            color: white;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
        }

        button:hover {
            background-color: var(--color4);
        }

        .right-container {
            width: 50%;
            background-color: var(--color1);
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }

        .right-container img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }

        @media(max-width: 768px) {
            body {
                flex-direction: column;
            }

            .left-container, .right-container {
                width: 100%;
                height: 50vh;
            }
        }
    </style>
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
        <img src="../assets/logo_mejora.png" alt="Logo Mejora">
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.12/dist/sweetalert2.all.min.js"></script>
    <script>
        document.getElementById('loginForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            const user = document.getElementById('user').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!user || !password) {
                Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
                return;
            }

            try {
                const response = await fetch('https://cors-anywhere.herokuapp.com/https://api.mejora.com.co/api/auth.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user, password })
                });

                const result = await response.json();

                if (result.status === 'ok') {
                    Swal.fire('Éxito', 'Login exitoso. ¡Bienvenido!', 'success');
                    // Aquí puedes redirigir o guardar el token
                    console.log(result.result.token);
                } else {
                    Swal.fire('Error', result.result.error_message, 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al conectarse con el servidor.', 'error');
            }
        });
    </script>
</body>
</html>
