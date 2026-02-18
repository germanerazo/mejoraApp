<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Procedimientos EPP</title>
    <!-- Common CSS -->
    <link rel="stylesheet" href="../styles/colors.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .page-container {
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .procedure-card {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: transform 0.2s;
        }

        .procedure-card:hover {
            transform: translateY(-2px);
        }

        .procedure-icon {
            font-size: 2.5rem;
            color: #e74c3c; /* PDF color */
            margin-right: 20px;
        }

        .procedure-info {
            flex-grow: 1;
        }

        .procedure-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 5px;
        }

        .procedure-meta {
            font-size: 0.9rem;
            color: #7f8c8d;
        }

        .btn-download {
            background-color: #3498db;
            color: white;
            padding: 8px 15px;
            border-radius: 4px;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: background 0.3s;
        }

        .btn-download:hover {
            background-color: #2980b9;
        }

        .btn-add {
            background-color: #27ae60;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s;
        }

        .btn-add:hover {
            background-color: #219150;
        }

        .btn-delete-card {
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.3s;
        }

        .btn-delete-card:hover {
            background-color: #c0392b;
        }
    </style>
</head>
<body>
    <div class="page-container fade-in">
        <div class="breadcrumbs">
            <a href="#../hacer/epp/epp.php" style="color: #3498db; text-decoration: none;">Gestión EPP</a> > Procedimientos y Documentos
        </div>

        <div class="page-header" style="justify-content: space-between; display: flex; align-items: center; margin-bottom: 30px;">
            <h1 class="page-title">
                <i class="fas fa-book" style="color: #f39c12;"></i>
                Procedimientos EPP
            </h1>
            <button class="btn-add" onclick="window.addProcedure()">
                <i class="fas fa-file-upload"></i> Nuevo Documento
            </button>
        </div>

        <div id="proceduresList">
            <!-- Procedures loaded via JS -->
        </div>

    </div>

    <!-- Script -->
    <script type="module" src="../epp/procedureEpp.js?v=1.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>
