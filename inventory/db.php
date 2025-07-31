<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'inventario_db';

$mysqli = new mysqli($host, $user, $pass, $db);
if ($mysqli->connect_error) {
    die('Connection error: ' . $mysqli->connect_error);
}
?>
