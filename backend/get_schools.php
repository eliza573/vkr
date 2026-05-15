<?php
require_once 'config.php';

$stmt = $pdo->query("SELECT id, name FROM schools ORDER BY name");
$schools = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "schools" => $schools]);
?>