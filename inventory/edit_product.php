<?php
require 'db.php';
$id = (int)($_POST['id'] ?? 0);
$nombre = $_POST['nombre'] ?? '';
$cantidad = (int)($_POST['cantidad'] ?? 0);
$precio = (float)($_POST['precio'] ?? 0);

$stmt = $mysqli->prepare('UPDATE productos SET nombre=?, cantidad=?, precio=? WHERE id=?');
$stmt->bind_param('sidi', $nombre, $cantidad, $precio, $id);
$stmt->execute();

header('Location: index.php');
?>
