<?php
require 'db.php';

function fetch_products($mysqli) {
    $result = $mysqli->query('SELECT * FROM productos ORDER BY id DESC');
    return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
}

$products = fetch_products($mysqli);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Inventario</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Inventario de Productos</h1>

    <h2>Agregar Producto</h2>
    <form action="add_product.php" method="post">
        <label>Nombre:<br><input type="text" name="nombre" required></label><br>
        <label>Cantidad:<br><input type="number" name="cantidad" required></label><br>
        <label>Precio:<br><input type="number" step="0.01" name="precio" required></label><br>
        <button type="submit">Guardar</button>
    </form>

    <h2>Lista de Productos</h2>
    <input type="text" id="search" placeholder="Buscar por nombre...">
    <table id="product-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($products as $p): ?>
            <tr>
                <td><?php echo $p['id']; ?></td>
                <td><?php echo htmlspecialchars($p['nombre']); ?></td>
                <td><?php echo $p['cantidad']; ?></td>
                <td><?php echo $p['precio']; ?></td>
                <td>
                    <a href="edit.php?id=<?php echo $p['id']; ?>">Editar</a>
                    <a class="delete-link" href="delete_product.php?id=<?php echo $p['id']; ?>">Eliminar</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <script src="script.js"></script>
</body>
</html>
