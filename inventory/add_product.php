<?php
require 'db.php';

$nombre = $_POST['nombre'] ?? '';
$cantidad = (int)($_POST['cantidad'] ?? 0);
$precio = (float)($_POST['precio'] ?? 0);

if ($nombre !== '') {
    $stmt = $mysqli->prepare('INSERT INTO productos (nombre, cantidad, precio) VALUES (?, ?, ?)');
    $stmt->bind_param('sid', $nombre, $cantidad, $precio);
    $stmt->execute();
}
header('Location: index.php');
?>
