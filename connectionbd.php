<?php
$host = '162.241.60.183';  // IP del servidor
$db   = 'mejorac3_mejorabd';
$user = 'mejorac3_german';
$pass = 'Ot&TW27LI_)A';
$port = 3306;  // Puerto MySQL por defecto

$conn = new mysqli($host, $user, $pass, $db, $port);

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prueba de Conexión</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .status { font-size: 20px; padding: 10px; border-radius: 5px; }
        .success { background-color: #d4edda; color: #155724; }
        .error { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>Prueba de Conexión a MySQL</h1>
    <?php if ($conn->connect_error): ?>
        <div class="status error">
            <strong>Error de conexión:</strong> <?php echo $conn->connect_error; ?>
        </div>
    <?php else: ?>
        <div class="status success">
            <strong>¡Conexión exitosa!</strong>
        </div>
    <?php endif; ?>
    
    <?php $conn->close(); ?>
</body>
</html>
