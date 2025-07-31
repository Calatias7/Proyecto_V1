<?php
require 'db.php';
$id = (int)($_GET['id'] ?? 0);

$stmt = $mysqli->prepare('DELETE FROM productos WHERE id=?');
$stmt->bind_param('i', $id);
$stmt->execute();

header('Location: index.php');
?>
