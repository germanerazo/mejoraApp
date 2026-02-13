<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de EPP</title>
    <!-- Common CSS -->
    <link rel="stylesheet" href="/mejoraApp/front/styles/colors.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .epp-dashboard-container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .epp-header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .epp-title {
            font-size: 2rem;
            color: var(--primary-color, #2c3e50);
            border-bottom: 2px solid var(--accent-color, #3498db);
            display: inline-block;
            padding-bottom: 10px;
        }
        
        .epp-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            justify-content: center;
        }
        
        .epp-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 30px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            border: 1px solid #eee;
            position: relative;
            overflow: hidden;
        }
        
        .epp-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
            border-color: var(--accent-color, #3498db);
        }
        
        .epp-icon-wrapper {
            width: 80px;
            height: 80px;
            background: rgba(52, 152, 219, 0.1); /* Light blue bg */
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            transition: background 0.3s ease;
        }
        
        .epp-card:hover .epp-icon-wrapper {
            background: var(--accent-color, #3498db);
        }
        
        .epp-icon {
            font-size: 2.5rem;
            color: var(--accent-color, #3498db);
            transition: color 0.3s ease;
        }
        
        .epp-card:hover .epp-icon {
            color: white;
        }
        
        .epp-card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }
        
        .epp-card-desc {
            font-size: 0.9rem;
            color: #666;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="epp-dashboard-container fade-in">
        <div class="epp-header">
            <h1 class="epp-title">Gestión de Elementos de Protección Personal (EPP)</h1>
        </div>
        
        <div class="epp-grid">
            <!-- Crear EPP -->
            <div class="epp-card" onclick="window.location.hash = '../hacer/epp/createEpp.php'">
                <div class="epp-icon-wrapper">
                    <i class="fas fa-hard-hat epp-icon"></i>
                </div>
                <h3 class="epp-card-title">Crear EPP</h3>
                <p class="epp-card-desc">Administrar el catálogo de EPP y sus normas</p>
            </div>
            
            <!-- Entrega EPP -->
            <div class="epp-card" onclick="window.location.hash = '../hacer/epp/deliveryEpp.php'">
                <div class="epp-icon-wrapper">
                    <i class="fas fa-hand-holding-medical epp-icon"></i>
                </div>
                <h3 class="epp-card-title">Entrega EPP</h3>
                <p class="epp-card-desc">Registrar y gestionar entregas de EPP a empleados</p>
            </div>
            
            <!-- Procedimiento EPP -->
            <div class="epp-card" onclick="window.location.hash = '../hacer/epp/procedureEpp.php'">
                <div class="epp-icon-wrapper">
                    <i class="fas fa-file-contract epp-icon"></i>
                </div>
                <h3 class="epp-card-title">Procedimiento EPP</h3>
                <p class="epp-card-desc">Gestionar documentos y procedimientos relativos a EPP</p>
            </div>
            
            <!-- Matriz EPP -->
            <div class="epp-card" onclick="window.location.hash = '../hacer/epp/matrixEpp.php'">
                <div class="epp-icon-wrapper">
                    <i class="fas fa-table epp-icon"></i>
                </div>
                <h3 class="epp-card-title">Matriz EPP</h3>
                <p class="epp-card-desc">Definir matriz de elementos según cargo</p>
            </div>
        </div>
    </div>
</body>
</html>
