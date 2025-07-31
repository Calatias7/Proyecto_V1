<?php
require 'db.php';
$id = (int)($_GET['id'] ?? 0);

$stmt = $mysqli->prepare('SELECT * FROM productos WHERE id=?');
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Producto</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Editar Producto</h1>
    <form action="edit_product.php" method="post">
        <input type="hidden" name="id" value="<?php echo $product['id']; ?>">
        <label>Nombre:<br><input type="text" name="nombre" value="<?php echo htmlspecialchars($product['nombre']); ?>" required></label><br>
        <label>Cantidad:<br><input type="number" name="cantidad" value="<?php echo $product['cantidad']; ?>" required></label><br>
        <label>Precio:<br><input type="number" step="0.01" name="precio" value="<?php echo $product['precio']; ?>" required></label><br>
        <button type="submit">Guardar</button>
    </form>
    <p><a href="index.php">Volver</a></p>
</body>
</html>
